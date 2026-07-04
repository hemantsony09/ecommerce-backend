import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const adminMiddleware = (req, res, next) => {
    const user = req.user

    if (!req.user) {
        return res.status(401).json({
            error: "Authentication required",
        });
    }

    if (user.role === 'admin') {
        return next()
    }

    return res.status(403).json({ error: "access denied" })

}