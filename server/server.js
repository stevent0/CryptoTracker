const express = require('express')  
const users = require('./users.js');
const csv = require('csv-parser')
const fs = require('fs')

const usrs = []
const cryptos = []
const owns = []

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

app.use((req, res, next) => {req.dbClient = client; next()})
app.use('/users', users)


app.get('/', (req, res, next) => {

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})