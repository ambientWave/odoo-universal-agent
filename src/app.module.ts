import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentController } from './agent/agent.controller.js';
import { AgentService } from './agent/agent.service.js';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AppModule {}
