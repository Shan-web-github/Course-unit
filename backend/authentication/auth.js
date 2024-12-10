const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

exports.eventAuth = (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      if (token == null) res.status(401).send("Unauthorized");
      jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) res.status(403).send("Authorization was expired");
        req.user = user;
        next();
      });
    } else res.status(401).send("Unauthorized");
  } catch (error) {
    return res.status(501).send(error.message);
  }
};

exports.pageAuth = (req, res) => {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("bearer")
      ) {
        const token = req.headers.authorization.split(" ")[1];
        if (token == null) return res.status(401).send("Unauthorized");
        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
          if (err) return res.status(403).send("Authorization was expired");
          req.user = user;
          return res.status(200);
        });
      } else res.status(401).send("Unauthorized");
    } catch (error) {
      return res.status(501).send(error.message);
    }
  };
  
