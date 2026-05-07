import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import { envs } from 'src/config/envs';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly client = createClient({ url: envs.REDIS_URL });
  private isReady = false;

  async onModuleInit() {
    this.client.on('ready', () => {
      this.isReady = true;
    });

    this.client.on('end', () => {
      this.isReady = false;
    });

    this.client.on('error', (error) => {
      this.isReady = false;
      this.logger.warn(`Redis cache unavailable: ${error.message}`);
    });

    try {
      await this.client.connect();
      this.isReady = true;
      this.logger.log('Redis cache connected');
    } catch (error) {
      this.logger.warn(
        `Redis cache disabled: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isReady) {
      return null;
    }

    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = envs.CACHE_TTL_SECONDS) {
    if (!this.isReady) {
      return;
    }

    await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  }

  async del(key: string) {
    if (!this.isReady) {
      return;
    }

    await this.client.del(key);
  }
}
