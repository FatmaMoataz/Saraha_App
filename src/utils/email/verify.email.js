import { sendEmail } from "./send.email.js";
import { verifyEmailTemplate } from "./templates/verify.email.template.js";
export const otpStore = {};

export const requestOTP = (req, res) => {
  const { email } = req.body;
  const now = Date.now();
  const userData = otpStore[email];

  if (userData?.banUntil && now < userData.banUntil) {
    const wait = Math.ceil((userData.banUntil - now) / 1000);
    return res.status(429).json({ message: `You are banned. Try again in ${wait} seconds.` });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = now + 2 * 60 * 1000;

  otpStore[email] = {
    otp,
    otpExpires,
    failedAttempts: 0,
    banUntil: null,
  };

  sendEmail({
    to: email,
    subject: "Your Verification Code",
    html: verifyEmailTemplate({ otp }),
  });

  return res.json({ message: "OTP sent successfully." });
};

export const verifyEmailMiddleware = (req, res, next) => {
  const { email, otp } = req.body;
  const userData = otpStore[email];
  const now = Date.now();

  if (!userData) return res.status(400).json({ message: "No OTP found. Request a new one." });

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
      userData.banUntil = now + 5 * 60 * 1000;
      return res.status(403).json({ message: "Too many attempts. You are banned for 5 minutes." });
    }

    return res.status(400).json({
      message: `Wrong OTP. ${5 - userData.failedAttempts} attempts left.`,
    });
  }

  delete otpStore[email];
  req.verifiedEmail = email;
  next();
};

export const completeRegistration = (req, res) => {
  res.json({ message: `Email ${req.verifiedEmail} has been verified.` });
};
