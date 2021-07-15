import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rabbitmqWrapper from './events/rabbitmq-wrapper';
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'


class SocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions & {
    namespance?: string
    server?: string
  }) {
    const server = super.createIOServer(port, { ...options, cors: true })
    return server
  }
}

async function bootstrap() {
  await rabbitmqWrapper.connect()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useWebSocketAdapter(new SocketAdapter(app))


  const port = 7104
  await app.listen(port, () => console.log(`Mapping backend service is running on ${port}`));
}
bootstrap();
