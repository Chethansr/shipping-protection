export type ShippingProtectionEventName =
  | 'narvar:shipping-protection:state:ready'
  | 'narvar:shipping-protection:state:quote-available'
  | 'narvar:shipping-protection:action:add-protection'
  | 'narvar:shipping-protection:action:remove-protection'
  | 'narvar:shipping-protection:state:error';

export type ShippingProtectionEventPayload = Record<string, unknown>;

export type EventListener = (event: CustomEvent<ShippingProtectionEventPayload>) => void;

export class EventBus {
  private listeners = new Map<ShippingProtectionEventName, Set<EventListener>>();

  on(name: ShippingProtectionEventName, listener: EventListener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }
    this.listeners.get(name)!.add(listener);
  }

  off(name: ShippingProtectionEventName, listener: EventListener) {
    this.listeners.get(name)?.delete(listener);
  }

  emit(name: ShippingProtectionEventName, detail: ShippingProtectionEventPayload = {}) {
    const evt = new CustomEvent(name, { detail });
    this.listeners.get(name)?.forEach((listener) => listener(evt));
    window.dispatchEvent(evt);
  }
}
