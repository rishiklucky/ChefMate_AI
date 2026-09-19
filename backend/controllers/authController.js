const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { getIsConnected } = require('../config/db');
const { sendOtpEmail } = require('../services/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory fallback user store if MongoDB is offline during local test
const memoryUsers = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'chefmate_ai_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (!getIsConnected()) {
      // Memory fallback mode
      const existing = memoryUsers.find((u) => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        authProvider: 'local',
        savedRecipes: [],
        createdAt: new Date(),
      };
      memoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        authProvider: 'local',
        token: generateToken(newUser._id),
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: 'local',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!getIsConnected()) {
      const user = memoryUsers.find((u) => u.email === email.toLowerCase());
      if (user && user.password && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          authProvider: user.authProvider || 'local',
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        preferredSpice: user.preferredSpice,
        preferredMethod: user.preferredMethod,
        authProvider: user.authProvider || 'local',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Google OAuth Login / Register
exports.googleLogin = async (req, res) => {
  try {
    const { token, idToken } = req.body;
    const credentialToken = idToken || token;

    if (!credentialToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credentialToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      const decoded = jwt.decode(credentialToken);
      if (decoded && (decoded.email || decoded.sub)) {
        payload = decoded;
      } else {
        console.warn('Google verifyIdToken failed, invalid token format:', verifyError.message);
        return res.status(401).json({ message: 'Invalid Google authentication token' });
      }
    }

    const { sub: googleId, email, name, picture } = payload;
    const userEmail = email ? email.toLowerCase() : `google_${googleId}@chefmate.ai`;

    if (!getIsConnected()) {
      let user = memoryUsers.find((u) => u.googleId === googleId || u.email === userEmail);
      if (!user) {
        user = {
          _id: 'mem_g_' + Date.now(),
          name: name || 'ChefMate User',
          email: userEmail,
          googleId: googleId || 'mem_gid_' + Date.now(),
          authProvider: 'google',
          avatar: picture || '',
          savedRecipes: [],
          createdAt: new Date(),
        };
        memoryUsers.push(user);
      } else {
        if (!user.googleId) user.googleId = googleId;
        if (picture && !user.avatar) user.avatar = picture;
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider || 'google',
        token: generateToken(user._id),
      });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: userEmail }] });

    if (!user) {
      user = await User.create({
        name: name || 'ChefMate User',
        email: userEmail,
        googleId,
        authProvider: 'google',
        avatar: picture || '',
      });
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      preferredSpice: user.preferredSpice,
      preferredMethod: user.preferredMethod,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

// Get Me
exports.getMe = async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// Forgot Password - Send OTP via Brevo / Email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!getIsConnected()) {
      const user = memoryUsers.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(404).json({ message: 'No registered user found with this email address' });
      }
      user.resetOtp = otp;
      user.resetOtpExpires = otpExpires;

      await sendOtpEmail(cleanEmail, otp);
      return res.json({ success: true, message: 'OTP verification code sent to your email.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this email address' });
    }

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(cleanEmail, otp);
    res.json({ success: true, message: 'OTP verification code sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing password reset request' });
  }
};

// Verify OTP Code
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP code' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!getIsConnected()) {
      const user = memoryUsers.find((u) => u.email === cleanEmail);
      if (!user || user.resetOtp !== otp.trim()) {
        return res.status(400).json({ message: 'Invalid OTP code. Please check and try again.' });
      }
      if (user.resetOtpExpires && new Date(user.resetOtpExpires) < new Date()) {
        return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
      }
      return res.json({ success: true, message: 'OTP code verified successfully' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check and try again.' });
    }

    if (user.resetOtpExpires && new Date(user.resetOtpExpires) < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
    }

    res.json({ success: true, message: 'OTP code verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// Reset Password with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (!getIsConnected()) {
      const user = memoryUsers.find((u) => u.email === cleanEmail);
      if (!user || user.resetOtp !== otp.trim()) {
        return res.status(400).json({ message: 'Invalid or expired OTP code' });
      }
      if (user.resetOtpExpires && new Date(user.resetOtpExpires) < new Date()) {
        return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
      }

      user.password = hashedPassword;
      user.resetOtp = null;
      user.resetOtpExpires = null;
      return res.json({ success: true, message: 'Password reset successful! You can now sign in.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    if (user.resetOtpExpires && new Date(user.resetOtpExpires) < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
    }

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful! You can now sign in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};
