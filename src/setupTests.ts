import '@testing-library/jest-dom';
import '@mantine/core/styles.css';

class ResizeObserverPolyfill {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.ResizeObserver = global.ResizeObserver || ResizeObserverPolyfill;

if (!window.matchMedia) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!window.scrollTo) {
  // @ts-ignore
  window.scrollTo = () => {};
}
