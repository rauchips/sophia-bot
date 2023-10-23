import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createBot } from 'whatsapp-cloud-api';
import { application } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // const from = '149350494925771';
  // const token = 'EAAMbz96jR5sBO1jI3X7iO96ZCi1d4fzdZBtxQ3V95wILZBSxD9Hwv4J5GsDtq5ZAJoNIFAct9RTaBSXNpJ02YlhkqLksvYfdMrXuIL4v3aTOaquT3wpvmQ4cZCMBdtq1P3PWTDnRkI1kvEefZAileXFQSCyNAY5toT2fLPFWrTa0TOIQ9weUIhsQy4YpcobJrr6jT4ZCRdAauL3B6iwnWoZD';
  // const to = '+254701093842';
  // const webhookVerifyToken = 'meatyhamhock';

  // // Create a bot that can send messages
  // const bot = createBot(from, token);

  // // Send text message
  // //const result = await bot.sendText(to, 'Hello world');

  // // Start express server to listen for incoming messages
  // // NOTE: See below under `Documentation/Tutorial` to learn how
  // // you can verify the webhook URL and make the server publicly available
  // await bot.startExpressServer({
  //   app: application,
  //   webhookVerifyToken,
  // });

  await app.listen(3000);


  // Listen to ALL incoming messages
  // NOTE: remember to always run: await bot.startExpressServer() first
  // bot.on('message', async (msg) => {
  //   console.log(msg);

  //   if (msg.type === 'text') {
  //     await bot.sendText(msg.from, 'Received your text message!');
  //   } else if (msg.type === 'image') {
  //     await bot.sendText(msg.from, 'Received your image!');
  //   }
  // });
}
bootstrap();
