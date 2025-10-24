import amqp from "amqplib";
import config from "../config/config.js";

let channel, connection;

export async function connect() {
  connection = await amqp.connect(config.RABITMQ_URI);
  channel = await connection.createChannel();

  console.log("connected to RABITMQ");
}

export async function publicTOQueue(queueName, data) {
  await channel.assertQueue(queueName, { durable: true });
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log("message sent to queue", queueName);
}

export async function subscribeToQueue(queueName, callback) {
  await channel.assertQueue(queueName, { durable: true });
  await channel.consume(queueName, async (msg) => {
    await callback(JSON.parse(msg.content.toString()));
    await channel.ack(msg);
  });
}
