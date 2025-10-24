import jwt from 'jsonwebtoken';

export const generateJwtAndSetToken = (res, userId) => {
    const token = jwt.sign({userId }, process.env.JWT_SECRET,{expiresIn : "7d"});

    res.cookie("token", token, {
        httpOnly : true, // prevents xss attack
        secure : process.env.NODE_ENV === 'production',
        age : 7*24*60*60*1000, // 7 days 
        sameSite : "strict"//prevents csrf attacks
    })

    return token;
}