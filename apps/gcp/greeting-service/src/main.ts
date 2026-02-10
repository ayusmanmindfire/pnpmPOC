import { GreetingService } from '@js-serverless/application';
import { CloudLogger } from '@js-serverless/infrastructure';
import type { HttpFunction } from '@google-cloud/functions-framework';

// Composition Root: Instantiate dependencies
const logger = new CloudLogger();
const service = new GreetingService(logger);

export const helloGCP: HttpFunction = async (req, res) => {
  // 1. Adapt GCP/Express Request to InternalRequest
  const response = await service.handleGreeting({
    body: req.body || {},
    query: (req.query as Record<string, string>) || {},
    params: (req.params as Record<string, string>) || {},
    headers: (req.headers as Record<string, string>) || {},
    context: { 
      requestId: req.header('x-cloud-trace-context') || 'gcp-req-id', 
      source: 'gcp' as const 
    }
  });

  // 2. Map back to GCP/Express Response
  res.status(response.statusCode)
     .set(response.headers)
     .send(response.body);
};