export interface ILogger {
  log(message: string, context?: Record<string, any>): void;
  error(message: string, trace?: string, context?: Record<string, any>): void;
}

export class CloudLogger implements ILogger {
  private getMetadata(context?: Record<string, any>) {
    return {
      timestamp: new Date().toISOString(),
      // Adding project context from your monorepo metadata
      project: 'js-serverless-monorepo',
      ...context
    };
  }

  log(message: string, context?: Record<string, any>): void {
    const logEntry = {
      level: 'INFO',
      message,
      ...this.getMetadata(context)
    };
    // Structured JSON logging is the "Sure Shot" for Cloud Observability
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, trace?: string, context?: Record<string, any>): void {
    const errorEntry = {
      level: 'ERROR',
      message,
      trace,
      ...this.getMetadata(context)
    };
    console.error(JSON.stringify(errorEntry));
  }
}