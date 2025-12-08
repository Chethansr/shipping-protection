import { Result, err, ok } from '../core/result';
import { SecureConfig, SecureConfigSchema } from '../validation/schemas';
import { createError } from '../errors/widget-error';

export class ConfigService {
  private cache: SecureConfig | null = null;

  async fetchConfiguration(url: string): Promise<Result<SecureConfig, Error>> {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        return err(createError('CONFIG_ERROR', `Config fetch failed: ${res.status}`));
      }
      const data = await res.json();
      const parsed = SecureConfigSchema.safeParse(data);
      if (!parsed.success) {
        return err(createError('CONFIG_ERROR', 'Invalid config schema', parsed.error));
      }
      this.cache = parsed.data;
      return ok(parsed.data);
    } catch (e) {
      return err(createError('NETWORK_ERROR', 'Config fetch error', e));
    }
  }

  getConfiguration(): SecureConfig | null {
    return this.cache;
  }
}
