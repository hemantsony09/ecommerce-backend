import express from 'express'
import 'dotenv/config'
const app = express()
const port = 8000 | process.env.PORT


app.use(express.json())


app.get('/health',(req,res)=>{
    return res.json("server is running fine");
    
})
app.listen(port,()=> console.log(`server is running on port ${port}` ))