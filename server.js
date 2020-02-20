const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs')

const server = express();
const db = require('./data/db-config');

server.use(express.json());
server.use(cors())

server.post('/api/register', (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(400).json({err: 'include all required fields'})
    }else {

        const hash = bcrypt.hashSync(req.body.password, 12 )
        req.body.password = hash;
        db('users').insert(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({err: "look, we aren't happy about this either"})
            })
    }
})

//needs to be changed slightly to validate, prob the sql part mostly
server.post('/api/login', (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(400).json({err: 'include all required fields'})
    }else {
        db('users').select('*').where({username: req.body.username})
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({err: "look, we aren't happy about this either"})
            })
    }
})

module.exports = server;