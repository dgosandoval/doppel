// Shim de `examples/context` de PlayCanvas: provee `data`, `deviceType` y `win`
// para poder reusar el código de los ejemplos casi verbatim.
let store = {};
let listeners = {};

export const data = {
  set(k, v) {
    store[k] = v;
    const ls = listeners[`${k}:set`];
    if (ls) ls.forEach((f) => { try { f(undefined, k, v); } catch (e) { /* noop */ } });
  },
  get(k) {
    return store[k];
  },
  on(ev, fn) {
    (listeners[ev] = listeners[ev] || []).push(fn);
    // Como un observer reactivo: si el valor ya existe al suscribirse a `X:set`,
    // reemite el estado actual (varios ejemplos hacen data.set(...) antes de data.on(...)).
    if (ev.endsWith(':set')) {
      const key = ev.slice(0, -4);
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        Promise.resolve().then(() => {
          try {
            fn(undefined, key, store[key]);
          } catch (e) {
            /* noop */
          }
        });
      }
    }
    return { off() {} };
  }
};

// Limpia el estado entre escenas (los ejemplos comparten este singleton).
export function reset() {
  store = {};
  listeners = {};
}

export const win = typeof window !== 'undefined' ? window : globalThis;

export const deviceType =
  typeof navigator !== 'undefined' && navigator.gpu ? 'webgpu' : 'webgl2';
