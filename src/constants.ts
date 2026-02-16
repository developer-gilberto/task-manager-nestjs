export const CONSTANTS = {
  VALIDATE_ID_KEY: 'validate-id',
  PASSWORD_SALT: 12,
  IS_PRODUCTION: process.env.NODE_ENV! === 'production',
  EMAIL_SENDER: '"Task Manager Nestjs" <no-reply@gilberto.dev>',
  BASE_URL:
    process.env.NODE_ENV! === 'production' ? process.env.BASE_URL! : 'http://localhost:3000/api/v1',
  EMAIL_QUEUE: 'email_queue',
  EMAIL_SERVICE: 'EMAIL_SERVICE',
  SEND_PASSWORD_RESET: 'SEND_PASSWORD_RESET',
}
