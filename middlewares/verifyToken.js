import jwt from 'jsonwebtoken';


//middleware
module.exports = async(req, res, next) =>{
    const accessToken = await req.header('auth-token');
    if (!accessToken) {
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        req.u = verified;
        return next();
    } catch (error) {
        return res.status(403).send('Invalid Token')
    }
}