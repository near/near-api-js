export abstract class Enum {
  enum: string;

  constructor(properties: any) {
      if (Object.keys(properties).length !== 1) {
          throw new Error('Enum can only take single value');
      }
      Object.keys(properties).map((key: string) => {
          (this as any)[key] = properties[key];
          this.enum = key;
      });
  }
}

export abstract class Assignable {
    constructor(properties: any) {
        Object.keys(properties).map((key: any) => {
            (this as any)[key] = properties[key];
        });
    }
}
