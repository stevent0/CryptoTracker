const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.use(express.json())


router.get('/user', async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) return res.sendStatus(400)

    try {
        const queryUserAccount = await req.dbClient.query(`SELECT U.email, U.password FROM USR U WHERE U.email = '${email}'`)
        if (queryUserAccount.rows.length == 0) return res.sendStatus(400)

        const hashedPassword = queryUserAccount.rows[0]["password"]

        bcrypt.compare(password, hashedPassword, function(err, result) {
        
            if (err) return res.sendStatus(400)

            if (result) {
                const jwtToken = jwt.sign({ email }, "SECRET KEY", {expiresIn: "30m"})
                console.log(`${email} has logged in`)
                res.json({jwtToken})
            }
            else {
                return res.sendStatus(400)  
            }

        })

    }
    catch (err) {
        console.log(err.message)
        return res.sendStatus(400)
    }

}) 

router.post('/user', async (req, res) => {

    const {name, email, password} = req.body

    
    if (!email || !password) return res.sendStatus(400)

    try {
        const queryUserEmail = await req.dbClient.query(`SELECT U.email FROM USR U WHERE U.email = '${email}'`)
        if (queryUserEmail.rows.length > 0) return res.sendStatus(400)
    }
    catch (err) {
        console.log(err.message)
        return res.sendStatus(400)
    }


    const saltRounds = 10
    bcrypt.hash(password, saltRounds, async (err, hash) => {

        if (err) return res.sendStatus(400)

        try {
            const queryUserId = await req.dbClient.query(`SELECT COALESCE(MAX(U.userId), 0) FROM USR U`)
            const nextUserId = queryUserId.rows[0]["coalesce"]
            await req.dbClient.query(`INSERT INTO USR (userId, email, password, name, verified) VALUES (${nextUserId+1}, '${email}', '${hash}', '${name}', 'false')`)
        }
        catch (err) {
            console.log(err.message)
            return res.sendStatus(400)
        }

    })

}) 

module.exports = router