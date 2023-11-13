import * as Levels from './LevelsController';
import * as Credentials from './CredentialsController';
import * as Modules from './ModulesController';
import * as Cache from './CacheController';

export const SystemController = { 
  ...Levels,
  ...Credentials,
  ...Modules,
  ...Cache
}
