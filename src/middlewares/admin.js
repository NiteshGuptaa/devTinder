const adminAuth = (req, res, next) => {
  console.log("Admin auth. is getting checked!!");
  const tokan = "xyz";
  const isAdminAuthorized = tokan === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized Admin!");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
