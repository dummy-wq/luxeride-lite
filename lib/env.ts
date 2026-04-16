/**
 * Centralized environment variable validation.
 * Throws a clear error at startup if required vars are missing,
 * instead of crashing later with a cryptic `!` assertion failure.
 */

function getRequiredEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `   Please set it in .env.local or your hosting provider's dashboard.\n` +
      `   See .env.example for the expected variables.`
    );
  }
  return value;
}

export const env = {
  /** MongoDB connection string (required) */
  MONGODB_URI: getRequiredEnv('MONGODB_URI', process.env.MONGODB_URI),

  /** MongoDB database name (defaults to "luxeride") */
  MONGODB_DB: process.env.MONGODB_DB || 'luxeride',

  /** JWT signing secret (required) */
  JWT_SECRET: getRequiredEnv('JWT_SECRET', process.env.JWT_SECRET),

  /** Admin email — defaults to "admin" */
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin',

  /** Admin password — defaults to "pass" */
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'pass',

  /** Current environment */
  NODE_ENV: process.env.NODE_ENV || 'development',

  /** Convenience boolean */
  isDev: process.env.NODE_ENV === 'development',
} as const;
