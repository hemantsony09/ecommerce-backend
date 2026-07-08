import express from 'express'
import {authMiddleware} from '../../middlewares/auth.middleware.js'
import {getAddressById,getAllAddress,updateAddress,deleteAddressById,createAddress } from './address.controller.js'


const addressRoute = express.Router()

addressRoute.get('/',authMiddleware,getAllAddress)
addressRoute.get('/:id',authMiddleware,getAddressById)

addressRoute.post('/',authMiddleware,createAddress)
addressRoute.patch('/:id',authMiddleware,updateAddress)

addressRoute.delete('/:id',authMiddleware,deleteAddressById)

export default addressRoute;