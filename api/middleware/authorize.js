const Role = require('../models/role');

const authorize = (roles) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      if (
        roles.length &&
        Role.isValidRole(req.user.role) &&
        !roles
          .map((role) => role.toLowerCase())
          .includes(req.user.role.toLowerCase())
      ) {
        req.destroy();
        // user's role is not authorized
        return res
          .status(401)
          .json({
            error: {
              code: 401,
              message: 'UnAuthorized',
            },
          })
          .end();
      }

      // authentication and authorization successful
      next();
    },
  ];
};

module.exports = authorize;
