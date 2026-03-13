import { Injectable } from '@nestjs/common';
import { runOrchestrator } from '../agents/orchestrator.js';

@Injectable()
export class AgentService {
  async runOrchestrator(userInput: string): Promise<string> {
    return await runOrchestrator(userInput);
  }
}
