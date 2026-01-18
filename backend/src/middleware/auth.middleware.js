import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Not authorized, token expired' });
  }

  return res.status(401).json({ message: 'Not authorized, token invalid' });
}
};

export default protect;
