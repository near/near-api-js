'use strict';

export type Network = {
    name: string
    chainId: string,
    _defaultProvider?: (providers: any) => any
}
