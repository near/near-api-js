import * as providers from './providers';
import * as utils from './utils';
import * as transactions from './transaction';
import * as validators from './validators';

import { Account } from './account';
import * as multisig from './account_multisig';
import * as accountCreator from './account_creator';
import { Connection } from './connection';
import { Signer, InMemorySigner } from './signer';
import { Contract } from './contract';
import { KeyPair } from './utils/key_pair';
import { connect, Near } from './near';

// TODO: Deprecate and remove WalletAccount
import { WalletAccount, WalletConnection } from './wallet-account';

export {
    accountCreator,
    providers,
    utils,
    transactions,
    validators,

    multisig,
    Account,
    Connection,
    Contract,
    InMemorySigner,
    Signer,
    KeyPair,

    connect,
    Near,

    WalletAccount,
    WalletConnection
};
