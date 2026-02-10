export interface InternalRequest<T = any> {
    body: T;
    params: Record<string, string>;
    query: Record<string, string>;
    headers: Record<string, string>;
    context: {
      requestId: string;
      source: 'aws' | 'azure' | 'gcp' | 'local';
    };
  }