const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errorHandler/customErrorHandlers");
const authConfig = require("../config/config").auth;
const customError = require("./error");

function signToken(data, algorithm = "RS256") {
  const privateKey = authConfig.jwt_secret;
  const refreshKey = authConfig.jwt_refresh_Secret;
  const expired = authConfig.jwt_expiresin;
  const refreshExpired = authConfig.jwt_refresh_expiresin;

  if (!data) {
    throw new BadRequestError(
      "please provide a valid data ,your data might be null",
    );
  }

  const accessToken = jwt.sign({ data }, privateKey, { expiresIn: expired });
  const refreshToken = jwt.sign({ data }, refreshKey, {
    expiresIn: refreshExpired,
  });
  token = {
    accessToken,
    refreshToken,
  };

  return token;
}

async function isAuthorized(req, res, next) {
  try {
    const refreshToken = req.headers[authConfig.jwt_refresh_auth_header_name];
    const accessToken = getTokenFromRequest(req);
    const decodedToken = await verifyToken(accessToken, refreshToken, req, res);
    //  const userid = decodedToken.data.user_id;
    // const qid=decodedToken.data.qid;
    // const userFromRedis = await getFromRedis(qid);
    req.decoded = decodedToken.data;

    if (decodedToken.data !== null) {
      next();
    } else {
      const err = customError.error(
        6666,
        "error",
        "Invalid Token or User has been logged out",
      )();
      req.error = err.message;
      res.status(403).send(err);
    }
  } catch (error) {
    res.status(400).send(error);
  }
}

function getTokenFromRequest(req) {
  const authHeader =
    req.headers &&
    req.headers[authConfig.jwt_auth_header_name] &&
    typeof req.headers[authConfig.jwt_auth_header_name] === "string"
      ? req.headers[authConfig.jwt_auth_header_name]
      : null;
  // console.log("AuthHeader: ", authHeader);
  if (authHeader) {
    const authorization = authHeader.split(" ");
    if (authorization[0] === authConfig.jwt_auth_value_prefix) {
      return authorization[1];
    }
  }

  return null;
}

function verifyToken(token, refreshToken, req, res) {
  return new Promise((resolve, reject) => {
    try {
      const refreshKey = authConfig.jwt_refresh_Secret;
      const expired = authConfig.jwt_expiresin;
      const refreshExpired = authConfig.jwt_refresh_expiresin;
      const error = new Error();
      if (!token) {
        return reject(
          customError.error(
            401,
            "error",
            "Not Authorized to access this resource!",
          )(),
        );
      }
      jwt.verify(token, authConfig.jwt_secret, (err, decoded) => {
        // 3 -> when access token is expired or is invalid
        if (err) {
          //  when access accss token is expired
          if (err.name === "TokenExpiredError") {
            // 2 -> when access token is expired and valid
            // return jwt.verify(refreshToken, refreshKey,
            //     (err, decoded) => {
            //         if (err) {

            //             //4 -> when refresh token is expired and valid
            //             return reject(customError.error(6666, "error", err.message)())
            //         }
            //         //send a new access token in error response headers
            //         data = decoded.data
            //         const accessToken = jwt.sign({
            //             data
            //         }, authConfig.jwt_secret, {
            //             expiresIn: expired
            //         });
            //         res.setHeader('Authorization', 'Bearer ' + accessToken);
            //         res.setHeader('x-refresh-token', refreshToken);
            //         res.setHeader('X-updated-access-token', 'true');
            //         res.setHeader('Access-Control-Expose-Headers', 'X-updated-access-token, Authorization');
            //         // resolve(decoded);
            //         return reject(customError.error(403, "error", "Access token expired")())
            //     })
            return reject(
              customError.error(403, "error", "Access token expired")(),
            );
          }
          // access token is invalid
          return reject(customError.error(498, "error", "Invalid token")());
        }
        // return jwt.verify(refreshToken, refreshKey,
        //     (err, decoded) => {
        //         if (err) {
        //             // 5 - > when refresh token is invalid
        //             return reject(customError.error(6666, "error", err.message)())
        //         }
        //         //1 -> when access token is not expired and valid
        //         res.setHeader('Authorization', 'Bearer ' + token);
        //         res.setHeader('x-refresh-token', refreshToken);
        //         res.setHeader('X-updated-access-token', 'false');
        //         res.setHeader('Access-Control-Expose-Headers', 'X-updated-access-token, Authorization');
        //         resolve(decoded)
        //     }
        // )
        return resolve(decoded);
      });
    } catch (error) {
      reject(customError.error(500, "error", "Internal Server Error")());
    }
  });
}

module.exports = { isAuthorized, signToken };
