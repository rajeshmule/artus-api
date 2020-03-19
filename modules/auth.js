const jwt = require("jsonwebtoken");

exports.generateJWT = async user => {
  const payload = { userId: user.id, email: user.email };
  const token = await jwt.sign(payload, process.env.SECRET);
  return token;
};

function getTokenFromHeader(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Token"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
}

exports.validateJWT = async (req, res, next) => {
  try {
    let token = getTokenFromHeader(req);
    var payload = await jwt.verify(token, process.env.SECRET);
    req.user = payload;
    req.user.token = token;
    next();
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.optionalValidateJWT = async (req, res, next) => {
  try {
    let token = getTokenFromHeader(req);
    if (token) {
      var payload = await jwt.verify(token, process.env.SECRET);
      req.user = payload;
      req.user.token = token;
    }
    next();
  } catch (error) {
    res.json({ message: error.message });
  }
};
