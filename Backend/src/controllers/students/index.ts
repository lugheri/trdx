import * as CreateStudent from './CreateStudent';
import * as GetStudent from './GetStudent';
import * as UpdateStudent from './UpdateStudent';
import * as DeleteStudent from './DeleteStudent';

export const StudentsController = {
  ... CreateStudent,
  ... GetStudent,
  ... UpdateStudent,
  ... DeleteStudent
 }