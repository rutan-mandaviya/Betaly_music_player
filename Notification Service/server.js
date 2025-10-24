import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import { connect } from "./src/broker/rabbit.js";
import Listner from "./src/broker/listner.js";

connectDB();
connect()
  .then(() => {
    Listner();
  })
  .catch((err) => {
    console.log("Error connecting to RabbitMQ", err);
  });

app.listen(3001, () => {
  console.log("notifiction service run on PORT 3001");
});
