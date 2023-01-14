import { Type } from 'class-transformer';

export class Excluder {
  constructor() {}
  static exclude<Type, Key extends keyof Type>(
    type: Type,
    ...keys: Key[]
  ): Omit<Type, Key> {
    for (let key of keys) {
      delete type[key];
    }
    return type;
  }
}
