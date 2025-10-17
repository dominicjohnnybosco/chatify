import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            // identify by IP or user
            identifier: req.ip || req.headers["x-forwarded-for"] || "anonymous",
            });
        // check if decision is denied
        if (decision.isDenied()) {
            // check for reason of denial and give appropriate error message
            if(decision.reason.isRateLimit()) {
                // check for rate limit detection
                return res.status(429).json({ message: "Rate Limit Exceeded. Please try again later"});
            } else if(decision.reason.isBot()) {
                // checking for bot detection 
                return res.status(403).json({ message: "Bot Access Denied"});
            } else {
                return res.status(403).json({ message: "Access Denied By Security Policy."})
            }
        }
        // check for spoofed bots (spoofed bots are type of bots that pretends to be human)
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ 
                error: "Spoofed bot detected", 
                message: "Malicious bot activity detected.",
            });
        }
        next();
    } catch (error) {
        console.log("Arcjet Protection Error:", error);
        next();
    }
}