const express = require("express");
const app = express();
const amqp = require("amqplib");

var connection, channel;
// connecting to rabbitmq
async function connectToRabbitMQ() {
  const amqpServer = "amqp://localhost";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("MyRabbitMQQueue"); // .env
}

connectToRabbitMQ().then(() => {
  channel.consume("MyRabbitMQQueue", payload => {
    const { courses } = JSON.parse(payload.content);
    console.log("Received : ", courses);
    channel.ack(payload);
  });
});

app.listen(3501, () => {
  console.log("Consumer Service running at 3501 !");
});
