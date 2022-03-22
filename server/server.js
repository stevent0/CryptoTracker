const express = require('express')  
const users = require('./users.js');
const csv = require('csv-parser')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 5000;

const { Client } = require('pg')

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'password',
    database: 'postgres'
})

client.connect()


function authorizeUser(req, res, next) {
    const jwtToken = req.headers["authorization"].split(" ")[1]

    jwt.verify(token, "SECRET KEY", (err, decoded) => {

        if (err) return res.sendStatus(500)

        req.email = decoded["email"]
        next()
        
    })
}

app.use((req, res, next) => {req.dbClient = client; next()})
app.use('/users', users)


app.get('/', (req, res, next) => {

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})