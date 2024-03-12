/** @hidden @module */
import * as providers from './providers';
import * as utils from './utils';
import * as transactions from './transaction';
import * as validators from './validators';
import * as lightClient from './light-client';

import { Account } from './account';
import * as multisig from './account_multisig';
import * as accountCreator from './account_creator';
import { Connection } from './connection';
import { Signer, InMemorySigner } from './signer';
import { Contract } from './contract';
import { KeyPair } from './utils/key_pair';
import { Near } from './near';

import {
    ConnectedWalletAccount,
    WalletConnection
} from './wallet-account';

export {
    accountCreator,
    providers,
    utils,
    transactions,
    validators,
    lightClient,

    multisig,
    Account,
    Connection,
    Contract,
    InMemorySigner,
    Signer,
    KeyPair,

    Near,

    ConnectedWalletAccount,
    WalletConnection
};
