const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://rabbitmq:5672";
const QUEUE_NAME = "tasks";

let channel;

// Retry connection until RabbitMQ is available
async function connectRabbitMQ() {
  try {
    console.log("Connecting to RabbitMQ...");

    const connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. Reconnecting...");
      setTimeout(connectRabbitMQ, 5000);
    });

    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection failed. Retrying in 5s...", err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

connectRabbitMQ();


// Health endpoint for Kubernetes probes
app.get("/health", (req, res) => {
  if (channel) {
    res.status(200).send("OK");
  } else {
    res.status(500).send("RabbitMQ not connected");
  }
});


// API to push task into queue
app.post("/tasks", async (req, res) => {
  try {
    if (!channel) {
      return res.status(500).send("RabbitMQ not ready");
    }

    const { task } = req.body;

    if (!task) {
      return res.status(400).send("Task is required");
    }

    channel.sendToQueue(QUEUE_NAME, Buffer.from(task), {
      persistent: true,
    });

    res.send("Task queued successfully");
  } catch (err) {
    console.error("Error sending task:", err);
    res.status(500).send("Failed to queue task");
  }
});


const PORT = 3002;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));