import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { NarvarSecure } from '../api';
import type { Quote } from '../services/quote-calculator';
import type { CartData } from '../validation/schemas';

/**
 * Shipping Protection Widget Web Component
 * TRD-compliant declarative component for cart page
 *
 * Usage:
 * <narvar-shipping-protection-widget></narvar-shipping-protection-widget>
 *
 * The retailer calls init() once, then render(cartData) on every cart change.
 * The widget listens to SDK events and updates its UI accordingly.
 */
@customElement('narvar-shipping-protection-widget')
export class NarvarShippingProtectionWidget extends LitElement {
  @property({ type: String }) headline = 'Protect your shipment';
  @state() private quote: Quote | null = null;
  @state() private loading = false;
  @state() private selected = false;

  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--narvar-shipping-protection-border-color, #dfe1e6);
      border-radius: 8px;
      padding: 16px;
      background: var(--narvar-shipping-protection-bg, #fff);
      color: var(--narvar-shipping-protection-text, #172b4d);
      font-family: var(--narvar-shipping-protection-font-family, system-ui, -apple-system, 'Segoe UI', sans-serif);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .quote {
      color: var(--narvar-shipping-protection-accent, #4c6ef5);
      font-weight: 600;
      font-size: 14px;
    }
    .toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      cursor: pointer;
    }
    input[type="checkbox"] {
      cursor: pointer;
    }
    .status {
      font-size: 12px;
      color: #4c6ef5;
      margin-top: 6px;
    }
    .error {
      color: #c92a2a;
      font-size: 12px;
      margin-top: 6px;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    NarvarSecure.on('narvar:shipping-protection:state:quote-available', this.handleQuote);
    NarvarSecure.on('narvar:shipping-protection:state:ready', this.handleReady);
    NarvarSecure.on('narvar:shipping-protection:state:error', this.handleError);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    NarvarSecure.off('narvar:shipping-protection:state:quote-available', this.handleQuote);
    NarvarSecure.off('narvar:shipping-protection:state:ready', this.handleReady);
    NarvarSecure.off('narvar:shipping-protection:state:error', this.handleError);
  }

  private handleQuote = (evt: CustomEvent) => {
    const detail = evt.detail as { quote?: Quote };
    if (detail?.quote) {
      this.quote = detail.quote;
      this.loading = false;
    }
  };

  private handleReady = () => {
    this.loading = false;
  };

  private handleError = () => {
    this.loading = false;
    this.quote = null;
  };

  render() {
    return html`
      <div class="header">
        <h3 style="margin: 0;">${this.headline}</h3>
      </div>

      ${this.loading
        ? html`<div class="status">Calculating quote...</div>`
        : this.quote
        ? html`
            <div class="quote">
              Shipping Protection: ${this.formatCurrency(this.quote.amount, this.quote.currency)}
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this.selected}
                @change=${this.handleToggle}
              />
              <span>${this.selected ? 'Protection added' : 'Add protection to your order'}</span>
            </label>
          `
        : html`<div class="error">Unable to calculate protection quote</div>`
      }
    `;
  }

  private handleToggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.selected = checked;

    // Emit standard SDK events (TRD pattern)
    const eventName = checked
      ? 'narvar:shipping-protection:action:add-protection'
      : 'narvar:shipping-protection:action:remove-protection';

    window.dispatchEvent(new CustomEvent(eventName, {
      detail: { amount: this.quote?.amount, currency: this.quote?.currency },
      bubbles: true
    }));
  }

  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'narvar-shipping-protection-widget': NarvarShippingProtectionWidget;
  }
}
