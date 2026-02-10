import { GetGreetingUseCase } from '@js-serverless/domain';
import { ILogger } from '@js-serverless/infrastructure';
import { InternalRequest } from '../dtos/internal-request.dto';
import { ResponseUtils, StandardResponse } from '../utils/response.util';

export class GreetingService {
  private useCase = new GetGreetingUseCase();

  // Injecting the interface, not the class
  constructor(private logger: ILogger) {}

  async handleGreeting(request: InternalRequest<{ name?: string }>): Promise<StandardResponse> {
    const name = request.body?.name || request.query?.name || 'Guest';
    
    this.logger.log(`Processing greeting for: ${name}`, { 
      requestId: request.context.requestId 
    });

    try {
      const result = this.useCase.execute({ name });
      return ResponseUtils.success({
        ...result,
        provider: request.context.source
      });
    } catch (err) {
      this.logger.error('Failed to generate greeting', (err as Error).stack);
      return ResponseUtils.error('Internal Server Error', 500);
    }
  }
}