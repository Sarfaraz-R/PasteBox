import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import morgan from "morgan"
import dotenv from "dotenv"
dotenv.config();

const app=express();

const authHits = new Map();
const authRateLimit = (req, res, next) => {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const max = 40;
    const hit = authHits.get(key) || { count: 0, resetAt: now + windowMs };

    if (hit.resetAt < now) {
        hit.count = 0;
        hit.resetAt = now + windowMs;
    }

    hit.count += 1;
    authHits.set(key, hit);

    if (hit.count > max) {
        return res.status(429).json({ message: "Too many authentication attempts. Please try again later." });
    }

    next();
};

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(cookieParser());

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
app.use(morgan('dev'))

export { authRateLimit };

export {app};
