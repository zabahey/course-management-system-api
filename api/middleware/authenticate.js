const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization === undefined) {
      return res
        .status(401)
        .json({
          error: {
            code: 401,
            message: 'UnAuthorized',
          },
        })
        .send();
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        error: {
          code: 401,
          message: 'UnAuthorized',
        },
      })
      .send();
  }
};
