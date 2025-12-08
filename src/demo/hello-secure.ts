import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SECURE_SDK_VERSION } from '../index';

@customElement('hello-secure')
export class HelloSecure extends LitElement {
  @property({ type: String }) message = 'Secure.js is wired up';

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 2px dashed #4c6ef5;
      border-radius: 8px;
      background: #f8f9ff;
      color: #0b1530;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .version {
      font-size: 12px;
      color: #4c6ef5;
    }
  `;

  render() {
    return html`
      <div>${this.message}</div>
      <div class="version">Version: ${SECURE_SDK_VERSION}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hello-secure': HelloSecure;
  }
}
