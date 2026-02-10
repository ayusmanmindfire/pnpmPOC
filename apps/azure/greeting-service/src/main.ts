import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { GreetingService } from '@js-serverless/application';
import { CloudLogger } from '@js-serverless/infrastructure';

// Instantiate dependencies
const logger = new CloudLogger();
const service = new GreetingService(logger);

export async function greetingHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // 1. Adapt Azure Request to InternalRequest
    const body = await request.json().catch(() => ({})); // Handle empty bodies safely
    
    const response = await service.handleGreeting({
        body: body as any,
        query: Object.fromEntries(request.query.entries()),
        params: request.params,
        headers: Object.fromEntries(request.headers.entries()),
        context: { 
            requestId: context.invocationId, 
            source: 'azure' as const 
        }
    });

    // 2. Return the adapted response
    return {
        status: response.statusCode,
        jsonBody: response.body,
        headers: response.headers
    };
}

// Register the function with the Azure runtime
app.http('greeting-service', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: greetingHandler
});