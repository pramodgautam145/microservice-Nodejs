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
  channel.sendToQueue(
    "MyRabbitMQQueue",
    Buffer.from(
      JSON.stringify({
        courses: [{ id: 1, title: "React" }],
      }),
    ),
  );
});

app.listen(3500, () => {
  console.log("Producer Service running @ 3500 !");
});
