export interface Greeting {
    message: string;
    recipient: string;
    timestamp: string;
  }
  
  export interface GreetingRequest {
    name: string;
    language?: 'en' | 'es' | 'fr';
  }