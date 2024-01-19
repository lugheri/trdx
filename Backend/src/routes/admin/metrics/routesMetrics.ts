import {Router} from 'express';
import MetricController from '../../../controllers/MetricController';

export default (routes:Router) => {
  //Students
  routes.get('/totalStudents',MetricController.totalStudents)
  routes.get('/activesNow',MetricController.activesNow)
  routes.get('/newStudentsLast20days',MetricController.newStudentsLast20days)
  routes.get('/accessExpireds',MetricController.accessExpireds)
  routes.get('/satisfactionChart',MetricController.satisfactionChart)
}