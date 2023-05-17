import knex from 'knex';
const knexConnection  = require('./knexfile');
export default knex(knexConnection)