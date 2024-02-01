import express from "express";
const router = express.Router({ mergeParams: true });

// executed for every request mathinch this route
router.use((req, res, next) => {
  console.log("\t[Router User: router.use middleware]");
  next();
});

router.get(
  "/:id",
  (req, res, next) => {
    console.log("\t[Router User: router.get middleware substack 1]");
    next();
  },
  (req, res, next) => {
    const id = parseInt(req.params.id);
    console.log("\t[Router User: router.get middleware substack 2]");
    console.log("\t\tSending response");
    res.status(200).send({ id });
    if (id !== 0) return next("route");
    else return next();
  },
  (req, res, next) => {
    // called only if id === 0
    console.log("\t[Router User: router.get middleware substack 3]");
    console.log("\t\tid is 0");
    next();
  }
);

router.get("/:id", (req, res, next) => {
  // called anyway
  console.log("\t[Router User: router.get middleware 4]");
  next("router");
});

router.get("/:id", (req, res, next) => {
  // never called, because of next("router") on middleware 4
  console.log("\t[Router User: router.get middleware 5]");
  next();
});

export default router;
