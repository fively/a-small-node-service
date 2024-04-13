import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsValidatePhone implements ValidatorConstraintInterface {
  validate(value: any) {
    return /^1[3456789]\d{9}$/.test(value);
  }
}

export function IsPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidatePhone
    });
  };
}
