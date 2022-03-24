const express = require('express')  
const axios = require('axios')
require('dotenv').config()
const accounts = require('./accounts.js')
const users = require('./users.js')
const asset = require('./asset.js')

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

client.connect().then( (res) => {
    app.use(express.json())
    app.use((req, res, next) => {req.dbClient = client; next()})
    app.use('/accounts', accounts)
    app.use("/users", users)
    app.use("/asset", asset)

    updateCryptocurrencyColumns()
    setInterval(() => updateCryptocurrencyColumns(), 700000)
    
    
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
})




async function updateCryptocurrencyColumns() {

    let currentPage = 1

    do {
        axios({
            method:  'get',
            url: `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NOMICS_API_KEY}`,
            responseType: 'json',
            params: { page: currentPage, status: "active" }
        })
        .then( (res) => {
            if (!res.data) return
            for (let asset of res.data) {
                const {id, symbol, name, logo_url, price} = asset
                let insertQueryStr = `INSERT INTO CRYPTOCURRENCY (cryptoId, usdPrice, logoUrl) `
                insertQueryStr += `VALUES ('${id}', ${parseFloat(price)}, '${logo_url}') ON CONFLICT (cryptoId) DO UPDATE SET usdPrice = ${parseFloat(price)}`
                client.query(insertQueryStr)
            }
        })

        currentPage += 1

        await new Promise( (resolve, reject) => setTimeout( () => resolve(''), 1700) )
        console.log(currentPage)

    } while (currentPage <= 400)

}




