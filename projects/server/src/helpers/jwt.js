//jwt : jason web token

const jwt = require('jsonwebtoken');

module.exports = {
    createToken: (payload, exp = '1h') => jwt.sign(payload, process.env.TOKEN_KEY, {
        expiresIn: exp
    }),
    readToken: (req, res, next) => {
        jwt.verify(req.token, process.env.TOKEN_KEY, (error, decript) => {
            if (error) {
                return res.status(401).send({
                    success: false,
                    message: 'Authenticate failed'
                })
            }
            req.decript = decript;
            next()
        })
    }
}
