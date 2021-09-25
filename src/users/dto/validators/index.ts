import { ValidationArguments } from 'class-validator';

export const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const validateLength =
  (tooShortMessage: string, tooLongMessage: string) => (validationObj: ValidationArguments) => {
    const [minValue, maxValue] = validationObj.constraints;
    const length = String(validationObj.value).length;

    if (length < minValue) {
      return tooShortMessage;
    }

    if (length > maxValue) {
      return tooLongMessage;
    }

    return undefined;
  };
