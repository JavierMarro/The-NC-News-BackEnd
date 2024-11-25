exports.psqlErrorHandler = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res
        .status(400)
        .send({ message: "Bad request - article Id can only be a number" });
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
