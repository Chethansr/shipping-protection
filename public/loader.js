(function (w, d, url) {
  // Create Narvar namespace if it doesn't exist
  w.Narvar = w.Narvar || {};

  // Check if ShippingProtection SDK already loaded (check both locations)
  if ((w.NarvarShippingProtection && w.NarvarShippingProtection._real) ||
      (w.Narvar.ShippingProtection && w.Narvar.ShippingProtection._real)) return;

  var queue = [];
  // TRD-specified public API methods (Task 0.6.2)
  var methods = ['init', 'render', 'on', 'off', 'setCustomerIdentity', 'getVersion', 'isReady', 'destroy'];
  var stub = {
    _queue: queue,
    _failed: false
  };

  methods.forEach(function (fn) {
    stub[fn] = function () {
      queue.push([fn, Array.prototype.slice.call(arguments)]);
    };
  });

  // Set stub in both locations to match bundle expectations
  w.NarvarShippingProtection = stub;
  w.Narvar.ShippingProtection = stub;

  var s = d.createElement('script');
  s.async = true;
  var resolved = url || w.ShippingProtectionScriptUrl || new URL('../dist/shipping-protection.js', d.baseURI).toString();
  s.src = resolved;
  s.onerror = function () {
    stub._failed = true;
    console.error('[Narvar] Failed to load ShippingProtection SDK from:', resolved);
  };
  s.onload = function () {
    // no-op: real SDK will drain _queue
  };
  d.head.appendChild(s);
})(window, document);
