const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

let channel;

async function connect() {
  try {
    console.log("Connecting to RabbitMQ...");
    const conn = await amqp.connect("amqp://rabbitmq:5672");
    channel = await conn.createChannel();
    await channel.assertQueue("tasks");
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection failed. Retrying in 5s...", err.message);
    setTimeout(connect, 5000);
  }
}
connect();

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/tasks", async (req, res) => {
  channel.sendToQueue("tasks", Buffer.from(req.body.task));
  res.send("Task queued");
});

app.listen(3002, () => console.log("API running on port 3002"));