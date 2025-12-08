import { EventBus, ShippingProtectionEventName } from './state/events';
import { SecureState, reduceState, SecureAction } from './state/fsm';
import { CartData, ShippingProtectionConfig } from './validation/schemas';
import { QuoteCalculator } from './services/quote-calculator';
import { ConfigService } from './services/config-service';
import { Result, err, ok } from './core/result';
import { createError } from './errors/widget-error';

export type CoordinatorOptions = {
  configUrl: string;
  sdkConfig: ShippingProtectionConfig;
};

export class Coordinator {
  private state: SecureState = 'UNINITIALIZED';
  private bus = new EventBus();
  private configService = new ConfigService();
  private quoteCalc: QuoteCalculator | null = null;
  private sdkConfig: ShippingProtectionConfig | null = null;

  getState() {
    return this.state;
  }

  on(event: ShippingProtectionEventName, listener: (evt: CustomEvent) => void) {
    this.bus.on(event, listener);
  }

  off(event: ShippingProtectionEventName, listener: (evt: CustomEvent) => void) {
    this.bus.off(event, listener);
  }

  emitError(error: Error) {
    this.transition({ type: 'ERROR' });
    this.bus.emit('narvar:shipping-protection:state:error', { error });
  }

  async initialize(options: CoordinatorOptions): Promise<Result<void, Error>> {
    this.transition({ type: 'INITIALIZE' });
    this.sdkConfig = options.sdkConfig;
    const configResult = await this.configService.fetchConfiguration(options.configUrl);
    if (!configResult.ok) {
      this.transition({ type: 'ERROR' });
      this.bus.emit('narvar:shipping-protection:state:error', { error: configResult.error });
      return err(configResult.error);
    }
    this.quoteCalc = new QuoteCalculator(configResult.value);
    this.transition({ type: 'READY' });
    this.bus.emit('narvar:shipping-protection:state:ready', {});
    return ok(undefined);
  }

  async calculateQuote(cart: CartData): Promise<Result<any, Error>> {
    if (!this.quoteCalc) {
      this.transition({ type: 'ERROR' });
      const error = createError('CONFIG_ERROR', 'Quote calculator not initialized');
      this.bus.emit('narvar:shipping-protection:state:error', { error });
      return err(error);
    }
    if (!this.sdkConfig) {
      this.transition({ type: 'ERROR' });
      const error = createError('CONFIG_ERROR', 'SDK config not initialized');
      this.bus.emit('narvar:shipping-protection:state:error', { error });
      return err(error);
    }

    this.transition({ type: 'CALCULATE_QUOTE' });

    // Story 0.10: Choose client vs server based on page context
    // Note: Edge service requires retailer to be configured in edge config store
    if (this.sdkConfig.page === 'checkout') {
      // Server-side quote with edge compute
      const result = await this.quoteCalc.calculateWithEdge(cart, this.sdkConfig);
      if (!result.ok) {
        this.transition({ type: 'ERROR' });
        this.bus.emit('narvar:shipping-protection:state:error', { error: result.error });
        return result;
      }
      this.transition({ type: 'QUOTE_READY' });
      this.bus.emit('narvar:shipping-protection:state:quote-available', { quote: result.value });
      return ok(result.value);
    } else {
      // Client-side quote (cart page)
      const quote = this.quoteCalc.calculate(cart);
      const extendedQuote = { ...quote, source: 'client' as const };
      this.transition({ type: 'QUOTE_READY' });
      this.bus.emit('narvar:shipping-protection:state:quote-available', { quote: extendedQuote });
      return ok(extendedQuote);
    }
  }

  selectProtection(payload: Record<string, unknown> = {}) {
    this.transition({ type: 'SELECT_PROTECTION' });
    this.bus.emit('narvar:shipping-protection:action:add-protection', payload);
  }

  declineProtection(payload: Record<string, unknown> = {}) {
    this.transition({ type: 'DECLINE_PROTECTION' });
    this.bus.emit('narvar:shipping-protection:action:remove-protection', payload);
  }

  destroy() {
    this.transition({ type: 'DESTROY' });
  }

  private transition(action: SecureAction) {
    this.state = reduceState(this.state, action);
  }
}
