const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = err.message;
  } else if (err.code === 11000) {
    let key = Object.keys(err.keyValue);
    key = key[0].toUpperCase();
    err.statusCode = 409;
    err.message = `${key} already exists`;
  } else if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token, Please login again!";
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errObject: err,
    errLine: err.stack,
  });
};

export default error;
