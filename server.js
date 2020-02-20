const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs')
const session = require('express-session');

const server = express();
const db = require('./data/db-config');

const sessionConfig = {
    name: 'bikini',
    secret: 'super secret',
    cookie: {
        maxAge: 1000 * 3600 * 24,
        secure: false, //needs to be true in production
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true //gdpr compliance, illegal to set cookies automatically
}

server.use(express.json());
server.use(cors())
server.use(session(sessionConfig))

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

server.post('/api/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ err: 'include all required fields' })
    } else {
        db('users').select('*').where({ username: req.body.username })
            .then(user => {
                console.log(user)
                // res.status(200).json({mes: 'closer'})

                if (user) {
                    console.log(user)
                    if (bcrypt.compareSync(req.body.password, user[0].password)) {
                        req.session.user =  user[0]
                        res.status(200).json({ message: 'success' })
                    }
                    else {
                        res.status(403).json({ message: 'invalid credentials' })
                    }
                }
                else {
                    res.status(403).json({ message: 'invalid credentials' })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ err: "look, we aren't happy about this either" })
            })
    }
})

server.get('/api/users', restricted, (req, res) => {
    db('users').select('*')
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: "look, we aren't happy about this either" })
        })
})

server.get('/api/logout', restricted, (req, res) => {
    req.session.destroy(err => {
         if (err) {
              res.json({err: "you're staying with me bud"})
         } else {
             res.json({mes: "good job, you've esc aepd"})
         }
    })
})

function restricted(req, res, next){
    if(req.session && req.session.user){
        next()
    }
    else {
        res.status(403).json({err: "Not without a warrant you aren't"})
    }
} 



module.exports = server;