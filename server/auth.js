const jwt = require('jsonwebtoken')

function authorizeUser(req, res, next) {
    const jwtToken = req.headers["authorization"].split(" ")[1]



    jwt.verify(jwtToken, "SECRET KEY", async (err, decoded) => {

        if (err) return res.sendStatus(500)


        try {
            const email = decoded["email"]
            const userId = decoded["userId"]

            const queryUserAccount = await req.dbClient.query(`SELECT U.email, U.userid FROM USR U WHERE U.email = '${email}' AND U.userId = '${userId}'`)
            
            if (queryUserAccount.rows.length == 0) return res.sendStatus(400)
            req.userIdFromJWT = userId
    
            next()
        }
        catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        

    })
}

module.exports = authorizeUser