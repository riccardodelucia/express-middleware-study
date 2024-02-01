import express from "express";
const app = express();
import userRoutes from "./routes/user.js";
import errorRoutes from "./routes/error.js";

// called anyway
app.use((req, res, next) => {
  console.log("\n\n\n\n");
  console.log("[App: app.use middleware 1]");
  next();
});

// this is called only if there are no more specific routes matching
// not executed if I call /user/:id
app.get("/user", (req, res, next) => {
  console.log("[App: app.get middleware 2]");
  next();
});

// /user routes mounted here
app.use("/user", userRoutes);
app.use("/error", errorRoutes);

// this is executed again for every request, since it matches all methods and routes
app.use((req, res, next) => {
  console.log("[App: app.get middleware 3]");
  next();
});

// this is executed again for every request, since it matches all methods and routes
app.all("*", (req, res, next) => {
  console.log("[App: app.get middleware 4]");
  if (!res.writableEnded) {
    console.log("\tSending response");
    res.status(200).send({});
  }
});

app.use((err, req, res, next) => {
  console.error("[App: general error middleware]");
  console.error(err);
  res.status(500).send({ error: err.message || "Unknown error" });
});

export default app;
