const express = require('express')
const authorizeUser = require('./auth.js')
const router = express.Router()


router.use(authorizeUser)


router.get("/:userId/assets", async (req, res) => {
    const { userId } = req.params

    if (req.userIdFromJWT != userId) return res.sendStatus(400)

    try {
        const assetsQuery = await req.dbClient.query(`SELECT * FROM OWNS WHERE userId = '${userId}'`)
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

        const assetsQuery = await req.dbClient.query(`SELECT * FROM OWNS O`)
        const lowerCaseSearchKey = searchKey.toLowerCase()

        let rows = assetsQuery.rows

        rows = rows.filter( (asset) => {
            return asset["label"].toLowerCase().includes(lowerCaseSearchKey) 
            || asset["abbreviation"].toLowerCase().includes(lowerCaseSearchKey) 
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
    const { abbreviation, label, amount } = req.body

    if (req.userIdFromJWT != userId) return res.sendStatus(400)

    try {

        const cryptocurrenciesQuery = await req.dbClient.query(`SELECT * FROM CRYPTOCURRENCY C WHERE C.abbreviation = '${abbreviation}'`)
        if (cryptocurrenciesQuery.rows.length == 0) return res.sendStatus(400)

        const assetsOwnedQuery = await req.dbClient.query(`SELECT COALESCE(MAX(O.id), 0) FROM OWNS O`)
        const nextAssetId = assetsOwnedQuery.rows[0]["coalesce"] + 1

        await req.dbClient.query(`INSERT INTO OWNS (id, userId, abbreviation, label, amount) VALUES (${nextAssetId}, ${userId}, '${abbreviation}', '${label}', ${amount})`)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


module.exports = router