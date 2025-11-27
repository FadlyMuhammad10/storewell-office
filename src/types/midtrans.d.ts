declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: unknown) => void;
    };
  }
}

export {};
