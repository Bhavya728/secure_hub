export const authorizePermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user.permissions) {
      return res.status(403).json({ message: "No permissions assigned" });
    }

    const allowed = permissions.every(p =>
      req.user.permissions.includes(p)
    );

    if (!allowed) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};
   