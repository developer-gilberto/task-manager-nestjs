export const CONSTANTS = {
  VALIDATE_ID_KEY: 'validate-id',
  PASSWORD_SALT: 12,
  IS_PRODUCTION: process.env.NODE_ENV! === 'production' ? true : false,
  EMAIL_SENDER: '"Task Manager Nestjs" <no-reply@gilberto.dev>'
}
