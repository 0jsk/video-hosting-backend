export const DEFAULT_AUTH_ERROR_MESSAGE = 'Неверная почта или пароль';
export const DEFAULT_ERROR = 'Что-то пошло не так';

export const USERNAME = {
  NOT_PRESENT: 'Имя пользователя обязательно для заполнения',
  TOO_SHORT: 'Длина никнейма должна составлять более 2 символов',
  TOO_LONG: 'Длина никнейма должна составлять менее 20 символов',
};

export const PASSWORD = {
  TOO_WEAK: 'Пароль слишком слабый',
  TOO_SHORT: 'Длина пароля должна составлять более 6 символов',
  TOO_LONG: 'Длина пароля должна составлять менее 20 символов',
  CONFIRM: 'Введенные пароли не совпадают',
};

export const MAIL = {
  NOT_PRESENT: 'E-Mail обязателен для заполнения',
  NOT_FOUND: 'Пользователь с заданным E-Mail не найден',
  ALREADY_EXISTS: 'Пользователь с заданным E-Mail уже существует',
  INVALID: 'Неверный E-Mail',
};
