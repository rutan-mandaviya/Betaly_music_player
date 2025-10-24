import express from "express";

const app = express();
app.use(express.json());

// sendEmail(
//   "rutanmandaviya14@gmail.com",
//   "test subject",
//   "test fail",
//   "<h1>this is test description</h1>"
// );

export default app;
