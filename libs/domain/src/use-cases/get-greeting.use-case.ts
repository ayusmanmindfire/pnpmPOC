import { Greeting, GreetingRequest } from '../models/greeting.model';

export class GetGreetingUseCase {
  execute(request: GreetingRequest): Greeting {
    const { name, language = 'en' } = request;
    
    const messages = {
      en: `Hello, ${name}!`,
      es: `¡Hola, ${name}!`,
      fr: `Bonjour, ${name}!`,
    };

    return {
      message: messages[language] || messages.en,
      recipient: name,
      timestamp: new Date().toISOString(),
    };
  }
}