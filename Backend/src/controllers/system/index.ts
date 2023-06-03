import * as Levels from './LevelsController';
import * as Credentials from './CredentialsController';
import * as Modules from './ModulesController';

export const SystemController = { 
  ...Levels,
  ...Credentials,
  ...Modules
}
