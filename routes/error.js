import express from "express";
const router = express.Router({ mergeParams: true });

router.get("/sync", (req, res, next) => {
  throw new Error("Sync error");
  next();
});

router.get("/async", async (req, res, next) => {
  await Promise.reject(new Error("unhandled rejection"));
  next();
});

router.get("/async-good", async (req, res, next) => {
  await Promise.reject(new Error("handled async rejection")).catch(next);
  next();
});

router.use((err, req, res, next) => {
  console.error("[Router Error: error middleware called]");
  next(err);
});

export default router;
