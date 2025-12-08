/**
 * Environment configuration
 * Reads from Vite environment variables with sensible defaults
 */

export type Environment = 'qa' | 'st' | 'prod';

/**
 * Get the current environment from build-time env vars
 * Defaults to 'qa' if not specified
 */
export function getEnvironment(): Environment {
  const env = import.meta.env?.VITE_ENVIRONMENT as string | undefined;

  if (env === 'st' || env === 'prod' || env === 'qa') {
    return env;
  }

  // Default to QA
  return 'qa';
}

/**
 * Current environment
 */
export const ENV: Environment = getEnvironment();

/**
 * Check if running in specific environment
 */
export const isQA = ENV === 'qa';
export const isST = ENV === 'st';
export const isProd = ENV === 'prod';
