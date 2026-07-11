import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const authMiddleware = (req, res, next) => {
    const tokenHeader = req.headers.authorization

    if (!tokenHeader) {
        return res.status(401).json({   success:false,error: "missing token" })
    }
    if (!(tokenHeader.startsWith('Bearer '))) {
        return res.status(401).json({  success:false, error: "authorization header must start with Bearer" })

    }
    const token = tokenHeader.split(' ')[1]

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        req.user = decodedToken;

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token",
        });
    }
}