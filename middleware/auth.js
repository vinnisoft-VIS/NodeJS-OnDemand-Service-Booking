const jwt = require("jsonwebtoken");
const { success, error } = require("../lib/response");
const User = require("../models/user");

module.exports = {
  isAuthenticated: async (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
          console.log(err);
          return res.json(await error("Invalid Token", {}));
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json(await error("Unauthorized User", {}));
    }
  },
  checkIsBlocked: async (req, res, next) => {
    let userId = req.decoded.userId;
    let user = await User.findOne({ _id: userId });
    if (user.isDeleted) {
      return res.json(
        await success("Your account has been disabled.", {
          familyCount: 0,
          professionalCount: 0,
          academicCount: 0,
          notificationCount: 0,
          isBlocked: 1,
        })
      );
    } else {
      next();
    }
  },
  isAdmin: async (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
          return res.json(await error("Invalid Token", {}));
        } else {
          if (decoded.isAdmin) {
            req.decoded = decoded;
            next();
          } else {
            return res.json(await error("You are not Admin", {}));
          }
        }
      });
    } else {
      return res.json(await error("Unauthorized Admin", {}));
    }
  },

  // Provider..........................
  isProvider: async (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).json(await error("Invalid Token", {}));
        } else {
          if (decoded.providerId) {
            req.decoded = decoded;
            next();
          } else {
            return res.json(await error("You are not provider", {}));
          }
        }
      });
    } else {
      return res.status(401).json(await error("Unauthorized Access!...", {}));
    }
  },

  //user
  isUser: async (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).json(await error("Invalid Token", {}));
        } else {
          if (decoded.userId) {
            req.decoded = decoded;
            next();
          } else {
            return res.json(await error("You are not User", {}));
          }
        }
      });
    } else {
      return res.status(401).json(await error("Unauthorized Access!...", {}));
    }
  },
};
