const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()



router.get('/user', async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) return res.sendStatus(400)

    try {
        const queryUserAccount = await req.dbClient.query(`SELECT U.userId, U.email, U.password FROM USR U WHERE U.email = '${email}'`)
        if (queryUserAccount.rows.length == 0) return res.status(400).send("Account does not exist.")

        const hashedPassword = queryUserAccount.rows[0]["password"]
        const userId = queryUserAccount.rows[0]["userid"]

        console.log(queryUserAccount.rows[0])

        bcrypt.compare(password, hashedPassword, function(err, result) {
            queryUserAccount.rows[0]["password"]

            if (err) return res.sendStatus(400)

            if (result) {
                const jwtToken = jwt.sign({ email, userId }, "SECRET KEY", {expiresIn: "24hr"})
                console.log(`${email} has logged in`)
                res.json({jwtToken, userId})
            }
            else {
                return res.status(400).send("Incorrect password.")
            }

        })

    }
    catch (err) {
        console.log(err.message)
        return res.sendStatus(400)
    }

}) 

router.post('/user', async (req, res) => {

    const {name, email, password, confirmPassword} = req.body

    
    if (!email || !password || !confirmPassword || !name) return res.status(400).send("Missing required information.")
    if (password != confirmPassword) return res.status(400).send("Passwords do not match.")


    try {
        const queryUserEmail = await req.dbClient.query(`SELECT U.email FROM USR U WHERE U.email = '${email}'`)
        if (queryUserEmail.rows.length > 0) return res.status(400).send("An account already exists.")
    }
    catch (err) {
        console.log(err.message)
        return res.sendStatus(400)
    }


    const saltRounds = 10
    bcrypt.hash(password, saltRounds, async (err, hash) => {

        if (err) return res.status(500).sendStatus("There was a problem creating your account.")

        try {
            const queryUserId = await req.dbClient.query(`SELECT COALESCE(MAX(U.userId), 0) FROM USR U`)
            const nextUserId = queryUserId.rows[0]["coalesce"]
            await req.dbClient.query(`INSERT INTO USR (userId, email, password, name, verified) VALUES (${nextUserId+1}, '${email}', '${hash}', '${name}', 'false')`)
            res.sendStatus(200)
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).sendStatus("There was a problem creating your account.")
        }

    })

}) 

module.exports = router