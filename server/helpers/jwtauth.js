const jwt = require('jsonwebtoken');
const jwtSecret=process.env.JWT_SECRET
const responseMessage = require("../../assets/responseMessage");
 
const { userServices } = require("../api/v1/services/userServices");
const {
  createUser,
  findUser,
  findUserData,
  deleteUser,
  updateUser,
  countTotalUser,
} = userServices;
 
 
verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];  
    console.log("🔍 Authorization Header:", authHeader);  
    if (!authHeader) {
      return res
        .status(404)
        .send({ statusCode: 'NO_TOKEN', responseMessage: responseMessage.NO_TOKEN });
    }
 
    jwt.verify(authHeader,jwtSecret, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res
            .status(400)
            .send({ statusCode: 'TOKEN_EXPIRED', responseMessage: responseMessage.TOKEN_EXPIRED });
        }
        return res
          .status(401)
          .send({ statusCode: 'UNAUTHORIZED', responseMessage: responseMessage.UNAUTHORIZED });
      }
 
      try {
        const user = await findUser({ userId: decoded.userId });
        if (!user) {
          return res
            .status(404)
            .send({ statusCode: 'USER_NOT_FOUND', responseMessage: responseMessage.USER_NOT_FOUND });
        }
        if (user.status === 'BLOCKED') {
          return res
            .status(401)
            .send({ statusCode: 'BLOCK_BY_ADMIN', responseMessage: responseMessage.BLOCK_BY_ADMIN });
        }
        if (user.status === 'DELETED') {
          return res
            .status(401)
            .send({ statusCode: 'DELETE_BY_ADMIN', responseMessage: responseMessage.DELETE_BY_ADMIN });
        }
 
        req.userId = user.userId;
        req.userRole=user.role
        return next();
      } catch (dbErr) {
        console.error('DB Error:', dbErr);
        return res
          .status(500)
          .send({ statusCode: 'INTERNAL_ERROR', responseMessage: 'Internal server error' });
      }
    });
  }
 
module.exports = verifyToken;