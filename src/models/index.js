//CONEXÃO COM BANCO DE DADOS 
const mongoDB = require('../database');

//SCHEMAS
const UserSchema = require('./UserSchema');

module.exports = { 
    User: UserSchema 
};