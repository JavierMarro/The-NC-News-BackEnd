exports.psqlErrorHandler = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ message: "Bad request - incorrect data type" });
      break;
    case "23503":
      res.status(404).send({ message: "User does not exist" });
      break;
    default:
      next(err);
      break;
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};
