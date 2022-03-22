const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')



router.use(express.json())


let arr = []


router.get('/user', (req, res) => {
    const {email, password} = req.body

    if (!email || !password) return res.sendStatus(400)

    let hash = arr[0].hash
    bcrypt.compare(password, hash, function(err, result) {
        
        if (err) return res.sendStatus(400)

        console.log(result)
    })


}) 

router.post('/user', async (req, res) => {

    const {name, email, password} = req.body

    
    if (!email || !password) return res.sendStatus(400)

    try {
        const user = await req.dbClient.query(`SELECT U.email FROM USR U WHERE U.email = '${email}'`)
        if (user.rows.length > 0) return res.sendStatus(400)
    }
    catch (err) {
        return res.sendStatus(400)
    }


    const saltRounds = 10
    bcrypt.hash(password, saltRounds, async (err, hash) => {

        if (err) return res.sendStatus(400)

        try {
            const queryResult = await req.dbClient.query(`SELECT COALESCE(MAX(U.userId), 0) FROM USR U`)
            const nextUserId = queryResult.rows[0]["coalesce"]
            console.log(`INSERT INTO USR (userId, email, password, name, verified) VALUES ( ${nextUserId+1}, '${email}', '${hash}', '${name}', 'true')`)
            await req.dbClient.query(`INSERT INTO USR (userId, email, password, name, verified) VALUES (${nextUserId+1}, '${email}', '${hash}', '${name}', 'true')`)
        }
        catch (err) {
            console.log(err.message)
            return res.sendStatus(400)
        }

    })

}) 

module.exports = router