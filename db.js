const {Pool} = require('pg');
const db = require('./dbconfig.js');

const pool = new Pool(db);

module.exports ={
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
};