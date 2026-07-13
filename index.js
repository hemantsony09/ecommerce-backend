import express from 'express'
import authRoute from './src/modules/auth/auth.routes.js'
import categoryRoute from './src/modules/category/category.routes.js'
import productRoute from './src/modules/product/product.routes.js'
import  addressRoute from './src/modules/address/address.route.js'
import cartRoute from './src/modules/cart/cart.route.js'
import orderRoute from './src/modules/order/order.route.js'
import uploadRoute from './src/modules/upload/upload.route.js'
import wishlistRoute from './src/modules/wishlist/wishlist.route.js'
import reviewsRoute from './src/modules/review/review.route.js'
import { env } from './src/config/env.js'


const app = express()

const port = env.PORT || 8000


app.use(express.json())

app.use("/upload", uploadRoute);
app.use('/auth',authRoute)
app.use('/categories',categoryRoute)
app.use('/product',productRoute)
app.use('/address',addressRoute)
app.use('/cart',cartRoute)
app.use('/orders',orderRoute)
app.use('/wishlist',wishlistRoute)
app.use('/review',reviewsRoute)

app.get('/health',(req,res)=>{
    return res.json("server is running fine");
    
})
app.listen(port,()=> console.log(`server is running on port ${port}` ))