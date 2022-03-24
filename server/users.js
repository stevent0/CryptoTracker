const express = require('express')
const authorizeUser = require('./auth.js')
const router = express.Router()


router.use(authorizeUser)


router.get("/:userId/assets", async (req, res) => {
    const { userId } = req.params

    if (req.userIdFromJWT != userId) return res.sendStatus(400)

    try {

        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)
        const rows = assetsQuery.rows

        res.json(rows)

    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


router.get("/:userId/assets/:searchKey", async (req, res) => {
    const { userId, searchKey } = req.params

    if (req.userIdFromJWT != userId) return res.sendStatus(400)

    try {
        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)
        
        const lowerCaseSearchKey = searchKey.toLowerCase()

        let rows = assetsQuery.rows

        if (rows.length == 0) return res.json([])

        rows = rows.filter( (asset) => {
            return asset["label"].toLowerCase().includes(lowerCaseSearchKey) 
            || asset["publicaddress"].includes(lowerCaseSearchKey)
            || asset["cryptoid"].toLowerCase().includes(lowerCaseSearchKey) 
            || asset["amount"].toString().toLowerCase().includes(lowerCaseSearchKey)
        } )

        res.json(rows)

    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


router.post("/:userId/assets", async (req, res) => {
    const { userId } = req.params
    const { cryptoId, label, publicAddress, amount } = req.body


    if (req.userIdFromJWT != userId) return res.sendStatus(400)

    try {
        const cryptocurrenciesQuery = await req.dbClient.query(`SELECT * FROM CRYPTOCURRENCY C WHERE C.cryptoId = '${cryptoId}'`)
        if (cryptocurrenciesQuery.rows.length == 0) return res.sendStatus(400)


        const assetsOwnedQuery = await req.dbClient.query(`SELECT COALESCE(MAX(O.id), 0) FROM OWNS O`)
        const nextAssetId = assetsOwnedQuery.rows[0]["coalesce"] + 1

        await req.dbClient.query(`INSERT INTO OWNS (id, userId, cryptoId, label, publicAddress, amount) VALUES (${nextAssetId}, ${userId}, '${cryptoId}', '${label}', '${publicAddress}', ${amount})`)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


router.get("/:userId/assets-value", async (req, res) => {
    const { userId } = req.params


    if (req.userIdFromJWT != userId) return res.sendStatus(400)

    try {
        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)

        if (assetsQuery.rows.length == 0) return res.sendStatus(400)

        let assetValue = 0

        for (let asset of assetsQuery.rows) {
            assetValue += (asset["amount"] * asset["usdprice"])
        }

        res.json({assetValue})
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = router