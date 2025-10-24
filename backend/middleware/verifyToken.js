import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({success : false, msg : "token not provided"})
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedData){
            res.status(401).json({success : false, msg : "Unauthorized/invalid token "})
        }
        req.userId = decodedData.userId;

        next();
    } catch (error) {
        console.log("error while verifying token");
        res.status(401).json({success : false, msg : error.message });
    }
}