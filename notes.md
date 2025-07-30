TODO:
    * add address types to swagger
    * add bearer token to:
      * swagger
      * mostly all routes
    * CRUD user
    * if user registers with google, can login with password?
    * reuse NotFoundError & BadRequestError
    * create `errorHandler` middleware (scroll down)
    * implement soft delete on user delete






errorHandler sample:
  
```const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    status: "error",
    code: status,
    message,
  });
};
```