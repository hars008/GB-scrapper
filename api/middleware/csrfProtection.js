

const csrfProtection = (req, res, next) => {
    var token =
      req.body._csrf || req.query._csrf || req.headers["x-csrf-token"];
    console.log("token", token);
    if (!token || !csrf_tokens.verify(secret, token)) {
        return res.status(403).send("unauthorized");
    }
    next();
};

module.exports = csrfProtection;
