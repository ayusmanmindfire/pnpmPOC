import { GreetingService } from '@js-serverless/application';
import { CloudLogger } from '@js-serverless/infrastructure';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const logger = new CloudLogger();
const service = new GreetingService(logger);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Translate AWS event to your clean InternalRequest
  const internalRequest = {
    body: event.body ? JSON.parse(event.body) : {},
    query: (event.queryStringParameters as Record<string, string>) || {},
    params: (event.pathParameters as Record<string, string>) || {},
    headers: event.headers as Record<string, string>,
    context: { 
      requestId: event.requestContext.requestId, 
      source: 'aws' as const 
    }
  };

  // Execute the shared business logic
  const response = await service.handleGreeting(internalRequest);

  // Translate back to AWS format
  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
    headers: response.headers
  };
};