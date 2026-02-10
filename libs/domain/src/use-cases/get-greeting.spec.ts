import { GetGreetingUseCase } from './get-greeting.use-case';

describe('GetGreetingUseCase', () => {
  let useCase: GetGreetingUseCase;

  beforeEach(() => {
    useCase = new GetGreetingUseCase();
  });

  it('should return a greeting in English by default', () => {
    const result = useCase.execute({ name: 'Omprakash' });
    expect(result.message).toBe('Hello, Omprakash!');
    expect(result.recipient).toBe('Omprakash');
  });

  it('should return a greeting in Spanish when requested', () => {
    const result = useCase.execute({ name: 'Omprakash', language: 'es' });
    expect(result.message).toBe('¡Hola, Omprakash!');
  });
});