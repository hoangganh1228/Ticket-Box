import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
}));