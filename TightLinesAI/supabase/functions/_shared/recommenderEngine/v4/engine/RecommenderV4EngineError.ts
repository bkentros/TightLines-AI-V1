export class RecommenderV4EngineError extends Error {
  override readonly name = "RecommenderV4EngineError";
  constructor(message: string) {
    super(message);
  }
}
