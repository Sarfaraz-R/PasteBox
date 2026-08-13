import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const generateUniqueId = () => {
  return uuidv4();
};

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const OAUTH_STATE_COOKIE = "googleOAuthState";
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";
const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const OAUTH_STATE_MAX_AGE = 10 * 60 * 1000;

const isProductionCookieEnv = () => {
  const clientUrl = process.env.CLIENT_URL || "";
  const baseUrl = process.env.BASE_URL || "";
  return process.env.NODE_ENV === "production"
    || clientUrl.startsWith("https://")
    || baseUrl.startsWith("https://");
};

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProductionCookieEnv(),
  sameSite: isProductionCookieEnv() ? "none" : "lax",
  maxAge,
  path: "/",
});

const sanitizeUser = (user) => ({
  id: user._id,
  _id: user._id,
  fullname: user.fullname,
  username: user.username,
  email: user.email,
  authProvider: user.authProvider,
  profilePic: user.profilePic,
  totalUploads: user.totalUploads,
  totalDownloads: user.totalDownloads,
  videoCount: user.videoCount,
  imageCount: user.imageCount,
  documentCount: user.documentCount,
  lastLogin: user.lastLogin,
});

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const buildFrontendUrl = (path = "") => {
  const frontendBase = process.env.CLIENT_URL || "http://localhost:5173";
  return `${frontendBase.replace(/\/$/, "")}${path}`;
};

const randomProfilePic = () => `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`;

const validatePassword = (password = "") => {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a special character.";
  return null;
};

const signAccessToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

const signRefreshToken = (user, tokenId = generateUniqueId()) =>
  jwt.sign({ userId: user._id, tokenId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });

const setAuthCookies = async (res, user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  await user.save();

  res.cookie(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));

  return { accessToken, refreshToken };
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE, cookieOptions(0));
  res.clearCookie(REFRESH_COOKIE, cookieOptions(0));
  res.clearCookie("token", cookieOptions(0));
  res.clearCookie(OAUTH_STATE_COOKIE, cookieOptions(0));
};

const setOAuthStateCookie = (res, state) => {
  res.cookie(OAUTH_STATE_COOKIE, state, cookieOptions(OAUTH_STATE_MAX_AGE));
};

const exchangeGoogleCode = async (code) => {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(tokenData.error_description || tokenData.error || "Google token exchange failed");
  }

  return tokenData;
};

const fetchGoogleProfile = async (accessToken) => {
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profileData = await profileResponse.json();
  if (!profileResponse.ok) {
    throw new Error(profileData.error?.message || "Unable to load Google profile");
  }

  return profileData;
};

const buildGoogleAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const registerUser = async (req, res) => {
  const { fullname, name, email, password, confirmPassword } = req.body;
  const displayName = (fullname || name || "").trim().replace(/[<>]/g, "");
  const normalizedEmail = normalizeEmail(email);

  try {
    if (!displayName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (displayName.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const existedUser = await User.findOne({ email: normalizedEmail });
    if (existedUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const cleanedFullname = displayName.replace(/\s+/g, "");
    const username = `${cleanedFullname.substring(0, 4).toLowerCase()}${generateUniqueId().substring(0, 5)}`;
    const profilePic = randomProfilePic();

    const newUser = new User({
      fullname: displayName,
      username,
      email: normalizedEmail,
      password,
      profilePic,
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully.", user: sanitizeUser(newUser) });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Error during registration" });
  }
};

// logoutUser
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.userId, { refreshTokenHash: null });
      } catch (error) {
        // Token is already invalid or expired; clearing cookies is enough.
      }
    }
    clearAuthCookies(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Fix updateUser
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;


  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Fix deleteUser
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if ((!email && !username) || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

   
    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google sign-in. Continue with Google instead." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.lastLogin = new Date();
    const { accessToken, refreshToken } = await setAuthCookies(res, user);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

const refreshSession = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokenHash) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      user.refreshTokenHash = null;
      await user.save();
      clearAuthCookies(res);
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    const tokens = await setAuthCookies(res, user);
    return res.status(200).json({ message: "Session refreshed", ...tokens, user: sanitizeUser(user) });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -refreshTokenHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching current user" });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
};

const googleAuthStart = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
      return res.status(500).json({ message: "Google OAuth is not configured on the server." });
    }

    const state = generateUniqueId();
    setOAuthStateCookie(res, state);
    return res.redirect(buildGoogleAuthUrl(state));
  } catch (error) {
    console.error("Google auth start error:", error);
    return res.redirect(buildFrontendUrl("/login?oauth=error"));
  }
};

const googleAuthCallback = async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(buildFrontendUrl(`/login?oauth_error=${encodeURIComponent(error)}`));
  }

  if (!code || !state || state !== req.cookies?.[OAUTH_STATE_COOKIE]) {
    clearAuthCookies(res);
    return res.redirect(buildFrontendUrl("/login?oauth_error=state_mismatch"));
  }

  try {
    const tokenData = await exchangeGoogleCode(code);
    const googleProfile = await fetchGoogleProfile(tokenData.access_token);
    const normalizedEmail = normalizeEmail(googleProfile.email);

    if (!googleProfile.id || !normalizedEmail) {
      throw new Error("Google account did not return the required profile information.");
    }

    let user = await User.findOne({
      $or: [{ googleId: googleProfile.id }, { email: normalizedEmail }],
    });

    if (!user) {
      const displayName = (googleProfile.name || normalizedEmail.split("@")[0] || "PasteBox User")
        .trim()
        .replace(/[<>]/g, "");
      const baseName = displayName.replace(/\s+/g, "").toLowerCase() || "user";

      user = new User({
        fullname: displayName,
        username: `${baseName.substring(0, 10)}${generateUniqueId().substring(0, 5)}`,
        email: normalizedEmail,
        authProvider: "google",
        googleId: googleProfile.id,
        profilePic: googleProfile.picture || randomProfilePic(),
      });
    } else {
      user.authProvider = "google";
      user.googleId = googleProfile.id;
      user.fullname = user.fullname || googleProfile.name || user.email;
      user.profilePic = googleProfile.picture || user.profilePic || randomProfilePic();
    }

    user.lastLogin = new Date();
    await user.save();
    await setAuthCookies(res, user);
    res.clearCookie(OAUTH_STATE_COOKIE, cookieOptions(0));

    return res.redirect(buildFrontendUrl("/dashboard"));
  } catch (callbackError) {
    console.error("Google auth callback error:", callbackError);
    clearAuthCookies(res);
    return res.redirect(buildFrontendUrl("/login?oauth_error=callback_failed"));
  }
};

export {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  verifyToken,
  generateUniqueId,
  logoutUser,
  refreshSession,
  getCurrentUser,
  googleAuthStart,
  googleAuthCallback,
};
