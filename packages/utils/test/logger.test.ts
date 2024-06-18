import { beforeEach, describe, expect, test } from '@jest/globals';
import { Logger } from '../src';


describe('logger', () => {
    let logs;

    beforeEach(async () => {
        logs = [];

        const custom = {
            verbose: (...args) => {
                logs.push(args.join(''));
            },
            debug: (...args) => {
                logs.push(args.join(''));
            },
            log: (...args) => {
                logs.push(args.join(''));
            },
            warn: (...args) => {
                logs.push(args.join(''));
            },
            error: (...args) => {
                logs.push(args.join(''));
            },
            fatal: (...args) => {
                logs.push(args.join(''));
            },
        };

        Logger.overrideLogger(custom);
    });

    test('test logger can be overrided', async () => {
        Logger.log('111');
        Logger.debug('11s1');
        Logger.warn('1111');
        Logger.error('1131');
        Logger.log('112');

        expect(logs.length).toBe(5);
    });

    test('test logger can be disabled', async () => {
        Logger.overrideLogger(undefined);

        Logger.log('111');
        Logger.log('222');

        expect(logs.length).toBe(0);
    });

    test('test logged data is accurate', async () => {
        Logger.log('lol');
        expect(logs[0]).toEqual('lol');

        Logger.log('his name is ', 'test');
        expect(logs[1]).toEqual('his name is test');
    });
});
