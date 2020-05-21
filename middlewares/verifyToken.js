import jwt from 'jsonwebtoken';


//middleware
module.exports = (req, res, next) =>{
    const accessToken = req.header('auth-token');
    if (!accessToken) {
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        req.u = verified;
        next();
    } catch (error) {
        res.status(403).send('Invalid Token')
    }
}