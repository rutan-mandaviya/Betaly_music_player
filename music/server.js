import { connectDB } from "./src/db/db.js";
import app from "./src/app.js";

import { connect } from "./src/broker/rabbit.js";
connectDB();
connect();
app.listen(3002, () => {
  console.log("music service is started on port 3000");
});
