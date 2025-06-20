import ratelimit from "../config/upstash.js";

//middleware to rate limit requests

const rateLimiter = async (req, res, next) => {

    try {
        //in production we will use ip address or user id to limit requests, here a static key is used for demonstration
        const {success} = await ratelimit.limit("my-rate-limit");
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }
        next(); //if the request is within the limit, proceed to the next middleware or route handler
    } catch (error) {
        console.log("Rate Limiter Error:", error);
        next(error);
    }
}

export default rateLimiter;