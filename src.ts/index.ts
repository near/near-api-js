'use strict';

import * as providers from './providers';
import * as utils from './utils';
import * as keyStores from './key_stores';

import { Account } from './account';
import * as accountCreator from './account_creator';
import { Connection } from './connection';
import { Signer, InMemorySigner } from './signer';
import { Contract } from './contract';

class Near {
    readonly connection: Connection;

    constructor(config: any) {
        this.connection = Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: { type: 'InMemorySigner', keyStore: config.deps.keyStore }
        });
    }

    account(accountId: string): Account {
        return new Account(this.connection, accountId);
    }
}

function connect(config: any): Near {
    return new Near(config)
}

export {
    accountCreator,
    keyStores,
    providers,
    utils,

    Account,
    Connection,
    Contract,
    InMemorySigner,
    Signer,

    connect
};
