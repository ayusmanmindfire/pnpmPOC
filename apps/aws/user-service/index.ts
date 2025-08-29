// import { logger } from '@org/utils';
import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
//   logger('CreateUser function invoked', 'UserService');

  const body = event.body? JSON.parse(event.body) : {};
  const userName = body.name || 'Anonymous';

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: `User ${userName} created successfully!`,
    }),
  };
};
