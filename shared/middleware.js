// import files
const jwt = require("jsonwebtoken");

// middleware
const middleware = {
  // auth middleware
  async auth(req, res, next) {
    req.user = null;
    try {
      if (req.headers && req.headers.authorization) {
        const [_, token] = req.headers.authorization.split(" ");
        req.user = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(req.user);
        next();
      } else {
        res.status(403).send({ error: "No authorization headers" });
      }
    } catch (error) {
      res.status(403).send({ error: error.message });
    }
  },

  // Entry middleware
  logging(req, res, next) {
    console.log(`${new Date()} - ${req.method} - ${req.url}`);
    next();
  },

  // maintenance middleware
  maintenance(req, res, next) {
    process.env.IS_MAINTENANCE == "true"
      ? res.send({ message: "site is under maintenance" })
      : next();
  },
};

// export
module.exports = middleware;
