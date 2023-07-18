function error(status, errorType, errorMessage) {
  return () => {
    e = {};
    e.status = status;
    e.type = errorType;
    e.message = errorMessage || "Default Error";
    e.data = {};
    return e;
  };
}

module.exports = { error };
