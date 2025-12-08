import { ENV as CURRENT_ENV, type Environment } from '../config/env';

/**
 * Edge compute API endpoints with environment support
 */
export type { Environment };
export { CURRENT_ENV as ENV };

export const EDGE_API_BASE_URLS: Record<Environment, string> = {
  qa: 'https://edge-compute-f.dp.domain-ship.qa20.narvar.qa',
  st: 'https://edge-compute-f.dp.domain-ship.st20.narvar.qa',
  prod: 'https://edge-compute-f.dp.domain-ship.narvar.com'
};

export function getEdgeEndpoints(env: Environment = CURRENT_ENV) {
  const baseUrl = EDGE_API_BASE_URLS[env];
  return {
    QUOTE: `${baseUrl}/v1/quote`,
    VERIFY: `${baseUrl}/v1/verify`,
    CONFIG: (retailerMoniker: string) => `${baseUrl}/v1/config/${retailerMoniker}`,
    JWKS: `${baseUrl}/.well-known/jwks.json`,
    HEALTH: `${baseUrl}/health`
  } as const;
}

// Current environment endpoints (uses CURRENT_ENV from config)
export const EDGE_API_BASE_URL = EDGE_API_BASE_URLS[CURRENT_ENV];
export const EDGE_ENDPOINTS = getEdgeEndpoints(CURRENT_ENV);
