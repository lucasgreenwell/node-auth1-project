const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs')

const server = express();
const db = require('./data/db-config');

server.use(express.json());
server.use(cors())

server.post('/api/register', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ err: 'include all required fields' })
    } else {

        const hash = bcrypt.hashSync(req.body.password, 12)
        req.body.password = hash;
        db('users').insert(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ err: "look, we aren't happy about this either" })
            })
    }
})

//needs to be changed slightly to validate, prob the sql part mostly
server.post('/api/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ err: 'include all required fields' })
    } else {
        db('users').select('*').where({ username: req.body.username })
            .then(user => {
                console.log(user)
                // res.status(200).json({mes: 'closer'})

                if(user){
                    console.log(user)
                    if (bcrypt.compareSync(req.body.password, user[0].password)){
                        res.status(200).json({message: 'success'})
                    }
                    else{
                        res.status(403).json({message: 'invalid credentials'})
                    }
                }
                else{
                    res.status(403).json({message: 'invalid credentials'})
                }

                // if (user && bcrypt.compareSync(req.body.password, user.password)) { res.status(201).json(user) }
                // else { res.status(401).json({ err: 'invalid credentials' }) }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ err: "look, we aren't happy about this either" })
            })
    }
})



module.exports = server;