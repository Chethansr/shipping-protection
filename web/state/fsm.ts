export type SecureState =
  | 'UNINITIALIZED'
  | 'INITIALIZING'
  | 'READY'
  | 'CALCULATING'
  | 'QUOTE_AVAILABLE'
  | 'ERROR'
  | 'DESTROYED';

export type SecureAction =
  | { type: 'INITIALIZE' }
  | { type: 'READY' }
  | { type: 'CALCULATE_QUOTE' }
  | { type: 'QUOTE_READY' }
  | { type: 'SELECT_PROTECTION' }
  | { type: 'DECLINE_PROTECTION' }
  | { type: 'ERROR' }
  | { type: 'DESTROY' };

export function reduceState(state: SecureState, action: SecureAction): SecureState {
  switch (state) {
    case 'UNINITIALIZED':
      return action.type === 'INITIALIZE' ? 'INITIALIZING' : state;
    case 'INITIALIZING':
      if (action.type === 'READY') return 'READY';
      if (action.type === 'ERROR') return 'ERROR';
      return state;
    case 'READY':
      if (action.type === 'CALCULATE_QUOTE') return 'CALCULATING';
      if (action.type === 'ERROR') return 'ERROR';
      return state;
    case 'CALCULATING':
      if (action.type === 'QUOTE_READY') return 'QUOTE_AVAILABLE';
      if (action.type === 'ERROR') return 'ERROR';
      return state;
    case 'QUOTE_AVAILABLE':
      if (action.type === 'SELECT_PROTECTION' || action.type === 'DECLINE_PROTECTION') return 'READY';
      if (action.type === 'ERROR') return 'ERROR';
      return state;
    case 'ERROR':
      if (action.type === 'DESTROY') return 'DESTROYED';
      return state;
    case 'DESTROYED':
      return 'DESTROYED';
    default:
      return state;
  }
}
