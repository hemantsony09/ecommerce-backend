import express from 'express'
import 'dotenv/config'
import authRoute from './src/modules/auth/auth.routes.js'
const app = express()
const port = process.env.PORT || 8000



app.use(express.json())

app.use('/auth',authRoute)

app.get('/health',(req,res)=>{
    return res.json("server is running fine");
    
})
app.listen(port,()=> console.log(`server is running on port ${port}` ))