export interface SearchRecoveryState {
  primaryRpcFailed: boolean;
  resultCount: number;
}

/**
 * Do not turn a database failure into a successful empty-search response.
 * A recovered result remains a success, while an ordinary empty query remains
 * a legitimate empty result.
 */
export function shouldSurfaceSearchUnavailable(
  state: SearchRecoveryState,
): boolean {
  return state.primaryRpcFailed && state.resultCount === 0;
}
