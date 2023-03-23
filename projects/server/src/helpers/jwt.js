//jwt : jason web token

const jwt = require('jsonwebtoken');

module.exports ={
    createToken: (payload, exp ='24h') => jwt.sign(payload,'123456789',{
        expreseIn: exp
    }),
    readToken:(req,res,next) =>{jwt.verify(req.token,'123456789',(error, decript)=>{
        if(error){
            return res.status(401).send({
                success:false,
                message:'Authenticate failed'
            })
        }
        req.decript = decript; 
        next()
    })
}
}
