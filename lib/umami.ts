type singleArgument = undefined | string | object

type umami = {
  track: (arg1: singleArgument, arg2?: object) => void;
}

// Extend the Window interface to include umami
declare global {
  interface Window {
    umami?: umami;
  }
}

export const umami = () => {
  if (typeof window !== 'undefined' && window.umami) {
    return window.umami;
  }
}