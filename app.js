import express from "express";
const app = express();
const router = express.Router();
import fs from "fs";

/////////////////////////////////////////////
// 1. Standard middleware
// In this example multiple route handlers are used, creating multiple routes for the same path.
// In addition, conditional checks are use to create conditional middleware stacks, taking advantage of next('route') and next('router')

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  if (!req.headers["x-auth"]) return next("router");
  next();
});

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get(
  "/user/:id",
  (req, res, next) => {
    // if the user ID is 0, skip to the next router
    if (req.params.id === "0") next("route");
    // otherwise pass control to the next middleware function in this stack
    else next();
  },
  (req, res, next) => {
    // render a regular page
    res.send("regular");
    next();
  },
  (req, res, next) => {
    // never executed
    console.log("This should not be printed");
    res.send("regular");
  }
);

// handler for the /user/:id path, which renders a special page
router.get("/user/:id", (req, res, next) => {
  console.log(req.params.id);
  res.send("special");
});

/////////////////////////////////////////////
// 2. Error middleware
// Use the error path to see how all errors are treated from express

// synchronous error
router.get("/error/sync", (req, res, next) => {
  throw new Error(
    "This is a synchronous error, managed from Express standard error handling mechanism"
  );
});

// error caused into an asynchronous operation.
// In this case, a dedicated errback is executed, which allows to immediately manage the error without any try/catch block
router.get("/error/async", (req, res, next) => {
  fs.readFile("/file-does-not-exist", (err, data) => {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});

// error caused inside a promise executor function. Again, we can call next from
router.get("/error/promise", (req, res, next) => {
  const errorPromise = new Promise((resolve, reject) => {
    throw new Error("Error during promise executor function");
  });
  errorPromise.catch((err) => {
    console.log(err);
    next(err);
  });
});

router.get("/error/chain1", (req, res) => {
  throw new Error("Error chain 1");
});

router.get("/error/chain2", (req, res) => {
  throw new Error("Error chain 2");
});

/////////////////////////////////////////////
// use the router and 401 anything falling through
app.use("/", router, (req, res) => {
  res.sendStatus(401);
});

const errorMiddleWare1 = (err, req, res, next) => {
  console.error("errorMiddleWare1");
  if (err.message === "Error chain 1") next(err);
  else next("route");
};

const errorMiddleWare2 = (err, req, res, next) => {
  console.error("errorMiddleWare2");
  next(err);
};

const errorMiddleWare3 = (err, req, res, next) => {
  console.error("errorMiddleWare3");
  next(err);
};

app.use(errorMiddleWare1);
app.use(errorMiddleWare2);
app.use(errorMiddleWare3);

export default app;
