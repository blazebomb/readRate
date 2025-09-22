import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).send({ message: "Invalid or expired token." });
    }
}
