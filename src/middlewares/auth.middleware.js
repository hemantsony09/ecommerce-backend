import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const authMiddleware = (req,res,next)=>{
    const tokenHeader = req.headers.authorization
    
    if(!tokenHeader){
       return next();
    }
    if(!(tokenHeader.startsWith('Bearer '))){
         res.status(401).json({error:"authorization header must start with Bearer"}) 
         return next()
    }
    const token = tokenHeader.split(' ')[1]
   

    const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)


if(decodedToken.role=='admin'){
    res.status(200).json
   } 
    req.user = decodedToken
    return next()
}
