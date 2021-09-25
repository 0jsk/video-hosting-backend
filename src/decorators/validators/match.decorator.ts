import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const Match = (property: string, validationOptions?: ValidationOptions) => (object: any, propertyName: string) =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    options: validationOptions,
    constraints: [property],
    validator: {
      validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];

        return value === relatedValue;
      },
    },
  });
