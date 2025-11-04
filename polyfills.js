// Polyfill document for styled-jsx during SSR/static generation
// This file must be plain JavaScript (not TypeScript) to ensure it runs early
if (typeof document === 'undefined') {
  const mockDocument = {
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    getElementById: function() { return null; },
    getElementsByClassName: function() { return []; },
    getElementsByTagName: function() { return []; },
    createElement: function() {
      return {
        setAttribute: function() {},
        getAttribute: function() { return null; },
        removeAttribute: function() {},
        appendChild: function() {},
        removeChild: function() {},
        style: {},
      };
    },
    head: {
      appendChild: function() {},
    },
    body: {
      appendChild: function() {},
    },
  };

  if (typeof global !== 'undefined') {
    global.document = mockDocument;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.document = mockDocument;
  }
}

