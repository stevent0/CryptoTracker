const express = require('express')  
const router = express.Router()


router.get('/:searchKey', async (req, res) => {
    let { searchKey } = req.params
    searchKey = decodeURIComponent(searchKey)
    const response = await req.dbClient.query(`SELECT * FROM CRYPTOCURRENCY C WHERE C.cryptoid = '${searchKey}'`)
    res.json(response.rows)
})

module.exports = router