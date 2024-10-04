// todo get rid of this class stuff altogether
// TODO determine why subclassing is still necessary even though `enum`
//  cannot be set in the base class or it will not be borsh-serializable
export abstract class Enum {
  abstract enum: string;

  constructor(properties: any) {
    if (Object.keys(properties).length !== 1) {
      throw new Error('Enum can only take single value');
    }
    Object.keys(properties).map((key: string) => {
      (this as any)[key] = properties[key];
    });
  }
}
