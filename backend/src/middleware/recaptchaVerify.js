import axios from 'axios';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6Lem8T8sAAAAAKoXBEUc3u7gZ5i5zFNEm1hYGuQq'; // Production key

export const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ 
        error: 'reCAPTCHA token is required',
        details: ['Please complete the reCAPTCHA verification']
      });
    }

    // Verify token with Google
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await axios.post(verificationURL, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
        remoteip: req.ip || req.connection.remoteAddress
      }
    });

    const { success, score, 'error-codes': errorCodes } = response.data;

    if (!success) {
      console.error('reCAPTCHA verification failed:', errorCodes);
      return res.status(400).json({ 
        error: 'reCAPTCHA verification failed',
        details: ['Please try again or refresh the page']
      });
    }

    // For reCAPTCHA v2, success is enough
    // For v3, you would check the score here (score >= 0.5 is usually good)
    
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
