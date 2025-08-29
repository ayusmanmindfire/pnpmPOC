export const logger = (message: string, context?: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${context? `[${context}]` : ''} ${message}`);
  };