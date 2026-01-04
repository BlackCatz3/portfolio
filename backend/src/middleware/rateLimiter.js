import rateLimit from 'express-rate-limit';

// Rate limiter for contact form submissions - More strict
export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    error: 'Too many messages sent from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for authenticated admin users
  skip: (req) => {
    return req.user !== undefined; // Skip if user is authenticated
  },
  // Handler for when limit is exceeded
  handler: (req, res) => {
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
    res.status(429).json({
      error: 'Too many messages sent from this IP, please try again after 15 minutes'
    });
  }
});

// General API rate limiter (more lenient)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
