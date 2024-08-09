import type { Finality } from '@near-js/types';

import type { ViewBaseParams } from './interfaces';

interface DefaultFinality {
  defaultFinality?: Finality;
}

export function getBlock({ blockReference, defaultFinality, deps: { rpcProvider } }: ViewBaseParams & DefaultFinality) {
  if (!blockReference && !defaultFinality) {
    return Promise.resolve(null);
  }

  return rpcProvider.block(
    blockReference || { finality: defaultFinality! }
  );
}
