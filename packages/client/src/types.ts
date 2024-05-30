import { BlockReference } from '@near-js/types';

export interface ViewOptions {
  block: BlockReference;
}

export interface CallOptions extends ViewOptions {
  deposit: bigint;
  gas: bigint;
}