import { Coordinator, CoordinatorOptions } from './coordinator';
import { CartDataSchema, ShippingProtectionConfig, ShippingProtectionConfigSchema } from './validation/schemas';
import { Result, err, ok } from './core/result';
import { createError } from './errors/widget-error';
import { safeWrapAsync } from './core/safe-wrappers';
import { debounce } from './core/debounce';
import { TIMEOUTS } from './core/timeouts';

/**
 * Public API for Narvar Shipping Protection SDK
 * Exposed at window.Narvar.ShippingProtection
 *
 * All methods have zero-throw guarantee - they never throw exceptions
 */
export class SecureAPI {
  private coordinator: Coordinator;
  private ready = false;
  private initPromise: Promise<Result<void, Error>> | null = null; // For idempotency
  private renderDebounced: (cartData: unknown) => Promise<void>;

  constructor() {
    this.coordinator = new Coordinator();

    // Debounce render with 100ms delay (TRD requirement)
    this.renderDebounced = debounce(
      this.renderInternal.bind(this),
      100
    );
  }

  /**
   * Derive edge config URL from retailer moniker and environment
   * Pattern: https://edge-compute-f.{retailerMoniker}.domain-ship.{env-domain}/v1/config/{retailerMoniker}
   *
   * @param retailerMoniker - Unique retailer identifier
   * @param environment - Environment ('qa' | 'st' | 'prod')
   * @returns Edge config URL
   */
  private deriveEdgeConfigUrl(retailerMoniker: string, environment: 'qa' | 'st' | 'prod'): string {
    const envDomain = environment === 'qa' ? 'qa20.narvar.qa' :
                      environment === 'st' ? 'st.narvar.com' :
                      'narvar.com';

    return `https://edge-compute-f.${retailerMoniker}.domain-ship.${envDomain}/v1/config/${retailerMoniker}`;
  }

  /**
   * Initialize SDK with configuration
   * Idempotent - multiple calls return the same promise
   * Times out after 10 seconds
   *
   * @param config - Shipping protection configuration
   * @returns Promise<Result<void, Error>> - Success or error result
   */
  async init(config: ShippingProtectionConfig): Promise<Result<void, Error>> {
    // Return cached promise if already initializing/initialized (idempotency)
    if (this.initPromise) {
      return this.initPromise;
    }

    // Create new init promise with timeout and zero-throw guarantee
    this.initPromise = safeWrapAsync(async () => {
      // Validate config
      const configParsed = ShippingProtectionConfigSchema.safeParse(config);
      if (!configParsed.success) {
        throw createError('CONFIG_ERROR', 'Invalid SDK config', configParsed.error);
      }

      const validConfig = configParsed.data;

      // Derive configUrl from retailerMoniker + environment if not provided
      const configUrl = validConfig.configUrl || this.deriveEdgeConfigUrl(validConfig.retailerMoniker, validConfig.environment || 'qa');

      const coordinatorOptions: CoordinatorOptions = {
        configUrl,
        sdkConfig: validConfig
      };

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(createError('CONFIG_ERROR', 'SDK initialization timeout after 10s')),
          TIMEOUTS.INIT
        )
      );

      // Race between init and timeout
      const result = await Promise.race([
        this.coordinator.initialize(coordinatorOptions),
        timeoutPromise
      ]);

      if (!result.ok) {
        throw result.error;
      }

      this.ready = true;
      return; // Return void on success
    }, 'SecureAPI.init');

    return this.initPromise;
  }

  /**
   * Render protection offer for given cart data
   * Debounced by 100ms - rapid calls will cancel previous pending renders
   * Fire-and-forget - results come via events (quote-available, error)
   * TRD-compliant: Returns void, caller listens to events
   *
   * @param cartData - Cart data to calculate protection for
   */
  render(cartData: unknown): void {
    // Fire and forget - debounced calculation happens internally
    // Results emitted via coordinator events
    this.renderDebounced(cartData).catch((err) => {
      // Safety net: log any unexpected errors
      console.error('[ShippingProtection] Unexpected render error:', err);
    });
  }

  /**
   * Internal render implementation (wrapped by debounce)
   * Fire-and-forget - coordinator emits events for results
   */
  private async renderInternal(cartData: unknown): Promise<void> {
    try {
      if (!this.ready) {
        // Emit error event for not ready
        this.coordinator.emitError(createError('CONFIG_ERROR', 'SDK not ready - call init() first'));
        return;
      }

      const parsed = CartDataSchema.safeParse(cartData);
      if (!parsed.success) {
        // Emit error event for invalid cart data
        this.coordinator.emitError(createError('CONFIG_ERROR', 'Invalid cart data', parsed.error));
        return;
      }

      // Coordinator calculateQuote internally emits quote-available or error events
      await this.coordinator.calculateQuote(parsed.data);
    } catch (error) {
      // Safety net: emit error event for any unexpected exceptions
      const widgetError = error instanceof Error
        ? createError('UNKNOWN_ERROR', error.message, error)
        : createError('UNKNOWN_ERROR', 'Unknown error in render', error);
      this.coordinator.emitError(widgetError);
    }
  }

  /**
   * Subscribe to SDK events
   * Returns unsubscribe function
   *
   * @param event - Event name
   * @param listener - Event listener callback
   */
  on(event: string, listener: (evt: CustomEvent) => void): () => void {
    this.coordinator.on(event as any, listener);
    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Unsubscribe from SDK events
   *
   * @param event - Event name
   * @param listener - Event listener callback to remove
   */
  off(event: string, listener: (evt: CustomEvent) => void): void {
    this.coordinator.off(event as any, listener);
  }

  /**
   * Set customer identity for analytics tracking
   * Phase 0: Placeholder implementation
   * Phase 1: Will integrate with Analytics service
   *
   * @param identity - Customer identity (customerId, emailId)
   */
  setCustomerIdentity(identity: { customerId?: string; emailId?: string }): void {
    // Phase 0: Log only, no-op
    // Phase 1: Will send to Analytics service
    console.log('[ShippingProtection] Customer identity set:', identity);
  }

  /**
   * Get SDK version
   *
   * @returns Semver version string
   */
  getVersion(): string {
    return import.meta.env?.VITE_SECURE_SDK_VERSION || '0.0.1';
  }

  /**
   * Check if SDK is ready (initialized and config loaded)
   *
   * @returns true if SDK is ready to render quotes
   */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Destroy SDK and clean up all resources
   * Cancels in-flight requests, removes listeners, resets state
   */
  destroy(): void {
    this.coordinator.destroy();
    this.ready = false;
    this.initPromise = null; // Reset idempotency cache
  }
}

export const NarvarSecure = new SecureAPI();
export const NarvarShippingProtection = NarvarSecure; // New primary export
