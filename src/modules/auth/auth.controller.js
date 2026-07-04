import db from '../../db/index.js'
import { usersTable } from '../../db/schema/schema.js'
import { eq } from "drizzle-orm"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const login = async (req, res) => {
    const { email, password } = req.body
try{
    const [user] = await db.select({ id: usersTable.id, name: usersTable.name,email:usersTable.email, password: usersTable.password, role: usersTable.role }).from(usersTable).where(eq(usersTable.email, email))

    if (!user) {
    return res.status(401).json({
        error: "Invalid email or password"
    });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: "invalid email or password" })
    }
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
    })
    return res.status(200).json({ status: "success", token: token })
}
catch(error){
    return res.status(400).json({error:error})
}



}

export const signup =  async (req, res) => {
    const { name, email, password } = req.body

    try{

        const [existingUser] = await db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.email, email))
        if (existingUser) {
            return res.status(409).json({ error: `user with email ${email} already exist` })
        }
    
        const hashedPassword =  await bcrypt.hash(password, 10);
    
        const [user] = await db.insert(usersTable).values({
            name,
            email,
            password: hashedPassword,
          
        }).returning({ id: usersTable.id })
        return res.status(201).json({ status: "success", data: user.id })
    }
    catch(error){
        return res.status(400).json({error:error})
    }
}
