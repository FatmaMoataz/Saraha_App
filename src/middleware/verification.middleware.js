import { otpStore } from "../utils/email/verify.email.js";


export const verifyEmailMiddleware = (req, res, next) => {
  const { email, otp } = req.body;

  const userData = otpStore[email];
  const now = Date.now();

  if (!userData) {
    return res.status(400).json({ message: "No OTP found. Request a new one." });
  }

  if (userData.banUntil && now < userData.banUntil) {
    const wait = Math.ceil((userData.banUntil - now) / 1000);
    return res.status(429).json({ message: `You are banned. Try again in ${wait} seconds.` });
  }

  if (now > userData.otpExpires) {
    return res.status(400).json({ message: "OTP expired. Request a new one." });
  }

  if (otp !== userData.otp) {
    userData.failedAttempts += 1;

    if (userData.failedAttempts >= 5) {
      userData.banUntil = now + 5 * 60 * 1000; // 5 minutes
      return res.status(403).json({ message: "Too many attempts. You are banned for 5 minutes." });
    }

    return res.status(400).json({
      message: `Wrong OTP. ${5 - userData.failedAttempts} attempts left.`,
    });
  }

  // ✅ Success
  delete otpStore[email]; // Remove from memory
  req.verifiedEmail = email;
  next();
};
