import axios from 'axios';

// Production reCAPTCHA v2 Checkbox secret key
const RECAPTCHA_SECRET_KEY = '6Lf49T8sAAAAAACEiOAI6BuSvUsqZBPynKADEmm5I';

// IP Blacklist - Add spam IPs here
const BLACKLISTED_IPS = new Set([
  // Add spam IPs here as they are detected
  // Example: '123.456.789.0'
]);

export const verifyRecaptcha = async (req, res, next) => {
  try {
    // Get client IP
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Check IP blacklist
    if (BLACKLISTED_IPS.has(clientIP)) {
      console.warn(`Blocked request from blacklisted IP: ${clientIP}`);
      return res.status(403).json({ 
        error: 'Access denied',
        details: ['Your IP has been blocked due to suspicious activity']
      });
    }

    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      console.warn(`Missing reCAPTCHA token from IP: ${clientIP}`);
      return res.status(400).json({ 
        error: 'reCAPTCHA token is required',
        details: ['Please complete the reCAPTCHA verification']
      });
    }

    // Additional validation: Check token format (should be long string)
    if (typeof recaptchaToken !== 'string' || recaptchaToken.length < 20) {
      console.warn(`Invalid reCAPTCHA token format from IP: ${clientIP}`);
      return res.status(400).json({ 
        error: 'Invalid reCAPTCHA token',
        details: ['Please refresh the page and try again']
      });
    }

    // Verify token with Google
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await axios.post(verificationURL, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
        remoteip: clientIP
      }
    });

    const { success, 'error-codes': errorCodes, hostname, challenge_ts } = response.data;

    if (!success) {
      console.error(`reCAPTCHA verification failed from IP ${clientIP}:`, errorCodes);
      
      // Log suspicious activity
      if (errorCodes && errorCodes.includes('invalid-input-response')) {
        console.warn(`Possible bot attack from IP: ${clientIP} - Invalid token`);
      }
      
      return res.status(400).json({ 
        error: 'reCAPTCHA verification failed',
        details: ['Please try again or refresh the page']
      });
    }

    // Additional security: Verify hostname matches your domain
    if (hostname && !['4leafclover.id', 'localhost'].includes(hostname)) {
      console.warn(`reCAPTCHA hostname mismatch from IP ${clientIP}: ${hostname}`);
      return res.status(400).json({ 
        error: 'Invalid request origin',
        details: ['Please submit the form from the official website']
      });
    }

    // Check token age (should be recent, not older than 2 minutes)
    if (challenge_ts) {
      const tokenAge = Date.now() - new Date(challenge_ts).getTime();
      if (tokenAge > 120000) { // 2 minutes
        console.warn(`Old reCAPTCHA token from IP ${clientIP}: ${tokenAge}ms old`);
        return res.status(400).json({ 
          error: 'reCAPTCHA token expired',
          details: ['Please refresh the page and try again']
        });
      }
    }

    // Log successful verification
    console.log(`✅ reCAPTCHA verified successfully for IP: ${clientIP}`);
    
    // Remove recaptchaToken from body before passing to controller
    delete req.body.recaptchaToken;
    
    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify reCAPTCHA',
      details: ['Please try again later']
    });
  }
};

export default verifyRecaptcha;
