const express = require('express')  
const accounts = require('./accounts.js')
const users = require('./users.js')
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





app.use(express.json())
app.use((req, res, next) => {req.dbClient = client; next()})
app.use('/accounts', accounts)
app.use("/users", users)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})