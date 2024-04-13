import * as knex from 'knex';

export interface KnexModuleOptions {
  name?: string;
  config: knex.Knex.Config;
  retryAttempts?: number;
  retryDelay?: number;
}

export type Knex = knex.Knex;
