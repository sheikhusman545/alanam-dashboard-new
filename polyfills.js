// Polyfill document and performance APIs for styled-jsx and React scheduler during SSR/static generation
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

// Polyfill performance.now() for React scheduler during SSR
if (typeof performance === 'undefined' || typeof performance.now !== 'function') {
  const startTime = Date.now();
  const performanceMock = {
    now: function() {
      return Date.now() - startTime;
    },
  };

  if (typeof global !== 'undefined') {
    global.performance = performanceMock;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.performance = performanceMock;
  }
}

// Polyfill requestAnimationFrame and cancelAnimationFrame for React during SSR
if (typeof requestAnimationFrame === 'undefined') {
  const rafMock = function(callback) {
    return setTimeout(callback, 16);
  };
  const cafMock = function(id) {
    clearTimeout(id);
  };

  if (typeof global !== 'undefined') {
    global.requestAnimationFrame = rafMock;
    global.cancelAnimationFrame = cafMock;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.requestAnimationFrame = rafMock;
    globalThis.cancelAnimationFrame = cafMock;
  }
}

// Polyfill location for axios/apisauce during SSR
if (typeof location === 'undefined') {
  const locationMock = {
    href: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
  };

  if (typeof global !== 'undefined') {
    global.location = locationMock;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.location = locationMock;
  }
}

