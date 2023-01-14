import Bot from "./Bot";

export abstract class EventExecutable {
  constructor() {}
  async execute(bob: Bot, ...args: any): Promise<any> {
    console.error('brurh');
  }
}

export interface EventData {
  name: string;
  once: boolean;
}

export interface Event {
  Impl: new () => EventExecutable;
  name: string;
  once: boolean;
}
