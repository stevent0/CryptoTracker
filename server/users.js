const express = require('express')
const authorizeUser = require('./auth.js')
const router = express.Router()


router.use(authorizeUser)


router.get("/:userId/assets", async (req, res) => {
    const { userId } = req.params


    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {

        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice, C.logoUrl`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)
        const rows = assetsQuery.rows

        for (let asset of rows) {
            asset["value"] = `$${(asset["amount"] * asset["usdprice"]).toFixed(2)}`
            asset["usdprice"] = `$${asset["usdprice"].toFixed(2)}`
        }

        res.json(rows)

    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})


router.get("/:userId/assets/:searchKey", async (req, res) => {
    let { userId, searchKey } = req.params

    searchKey = decodeURIComponent(searchKey)

    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {
        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice, C.logoUrl`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)
        
        const lowerCaseSearchKey = searchKey.toLowerCase()

        let rows = assetsQuery.rows

        if (rows.length == 0) return res.json([])

        for (let asset of rows) {
            asset["value"] = `$${(asset["amount"] * asset["usdprice"]).toFixed(2)}`
            asset["usdprice"] = `$${asset["usdprice"].toFixed(2)}`
        }

        rows = rows.filter( (asset) => {
            return asset["label"].toLowerCase().includes(lowerCaseSearchKey) 
            || asset["publicaddress"].includes(lowerCaseSearchKey)
            || asset["cryptoid"].toLowerCase().includes(lowerCaseSearchKey) 
            || asset["amount"].toString().toLowerCase().includes(lowerCaseSearchKey)
            || asset["value"].toString().toLowerCase().includes(lowerCaseSearchKey)
        } )


        res.json(rows)

    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})


router.post("/:userId/assets", async (req, res) => {
    const { userId } = req.params
    const { cryptoId, label, publicAddress, amount } = req.body


    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {
        const cryptocurrenciesQuery = await req.dbClient.query(`SELECT * FROM CRYPTOCURRENCY C WHERE C.cryptoId = '${cryptoId}'`)
        if (cryptocurrenciesQuery.rows.length == 0) return res.status(400).send("Cannot insert: asset does not exist.")


        const assetsOwnedQuery = await req.dbClient.query(`SELECT COALESCE(MAX(O.id), 0) FROM OWNS O`)
        const nextAssetId = assetsOwnedQuery.rows[0]["coalesce"] + 1

        await req.dbClient.query(`INSERT INTO OWNS (id, userId, cryptoId, label, publicAddress, amount) VALUES (${nextAssetId}, ${userId}, '${cryptoId}', '${label}', '${publicAddress}', ${amount})`)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

router.delete("/:userId/assets/:ownsId", async (req, res) => {
    const { userId, ownsId } = req.params

    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {
        const deletionQuery = await req.dbClient.query(`DELETE FROM OWNS WHERE id = ${ownsId} AND userId = ${userId} RETURNING *`)
        if (deletionQuery.rows.length == 0) return res.status(400).send("Cannot delete: asset does not exist.")
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }
})


router.patch("/:userId/assets/:ownsId", async (req, res) => {
    const { userId, ownsId } = req.params
    const { label, publicAddress, amount } = req.body

    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {
        const deletionQuery = await req.dbClient.query(`UPDATE OWNS SET label = '${label}', publicAddress = '${publicAddress}', amount = ${amount} WHERE id = ${ownsId} AND userId = '${userId}' RETURNING *`)
        if (deletionQuery.rows.length == 0) return res.status(400).send("Cannot update: asset does not exist.")
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }
})


router.get("/:userId/assets-value", async (req, res) => {
    const { userId } = req.params


    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {
        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)

        let assetValue = 0

        for (let asset of assetsQuery.rows) {
            assetValue += (asset["amount"] * asset["usdprice"])
        }

        res.send(`$${assetValue.toFixed(2)}`)
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

router.get("/:userId/highest-value-asset", async (req, res) => {
    const { userId } = req.params


    if (req.userIdFromJWT != userId) return res.status(400).send("Invalid credentials.")

    try {
        let queryString = ""
        queryString += `SELECT O.id, O.userId, O.cryptoId, O.label, O.publicAddress, O.amount, C.usdPrice`
        queryString += ` FROM OWNS O, CRYPTOCURRENCY C`
        queryString += ` WHERE O.userId = ${userId} AND C.cryptoId = O.cryptoId`

        const assetsQuery = await req.dbClient.query(queryString)

        let highestValueAsset = 0
        let assetId = ""

        for (let asset of assetsQuery.rows) {
            const val = asset["amount"] * asset["usdprice"]
            if (val > highestValueAsset) {
                highestValueAsset = val
                assetId = asset["cryptoid"]
            }

        }

        res.json({value: `$${highestValueAsset.toFixed(2)}`, assetId })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

module.exports = router