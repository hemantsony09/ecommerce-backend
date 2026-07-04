import express from "express"
import { login, signup } from './auth.controller.js'

const authRoute = express.Router()

authRoute.post('/login', login)
authRoute.post('/signup', signup)

export default authRoute;