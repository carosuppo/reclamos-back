export const CONFIG_KEYS = {
  DATABASE_URL: 'DATABASE_URL',
  ORIGIN_URL: 'ORIGIN_URL',
} as const;

// Type for the keys
export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

export const env: Env = {
  [CONFIG_KEYS.DATABASE_URL]: process.env.DATABASE_URL,
  [CONFIG_KEYS.ORIGIN_URL]: process.env.ORIGIN_URL,
} as const;

export type Env = Record<ConfigKey, string | undefined>;
