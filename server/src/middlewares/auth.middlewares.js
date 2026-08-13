import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const cookieToken = req.cookies?.accessToken || req.cookies?.token;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authenticate;
