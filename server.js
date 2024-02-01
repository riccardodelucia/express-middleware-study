import app from "./app.js";

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection!");
  console.error(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
