type Callback = (payload: any) => void;

class Dispatcher {
  private callbacks: Map<string, Callback>;
  private isDispatching: boolean;
  private pendingPayload: any;

  constructor() {
    this.callbacks = new Map();
    this.isDispatching = false;
    this.pendingPayload = null;
  }

  register(id: string, callback: Callback): void {
    if (this.callbacks.has(id)) {
      console.warn(`Dispatcher: Callback with ID "${id}" is already registered.`);
      return;
    }
    this.callbacks.set(id, callback);
  }

  unregister(id: string): void {
    this.callbacks.delete(id);
  }

  dispatch(payload: any): void {
    if (this.isDispatching) {
      throw new Error('Dispatcher: Cannot dispatch while already dispatching.');
    }

    this.startDispatching(payload);

    try {
      this.callbacks.forEach((callback) => {
        callback(this.pendingPayload);
      });
    } finally {
      this.stopDispatching();
    }
  }

  private startDispatching(payload: any): void {
    this.isDispatching = true;
    this.pendingPayload = payload;
  }

  private stopDispatching(): void {
    this.pendingPayload = null;
    this.isDispatching = false;
  }
}

// Exportamos una instancia única del Dispatcher para toda la aplicación
export const dispatcher = new Dispatcher();