import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service.js';

@Controller('query')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async handleQuery(@Body('prompt') prompt: string) {
    if (!prompt) {
      return { error: 'Prompt is required' };
    }
    const result = await this.agentService.runOrchestrator(prompt);
    return { result };
  }
}
