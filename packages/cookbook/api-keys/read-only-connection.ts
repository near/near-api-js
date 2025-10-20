/**
 * Example: Read-only connection with API key authentication
 *
 * Demonstrates using connectReadOnly() for querying NEAR without signing.
 * This pattern is ideal for:
 * - Displaying account information in dashboards
 * - Reading smart contract state for analytics
 * - Blockchain explorers
 * - Public data APIs
 *
 * Run: npm run readOnlyConnection
 */

import { connectReadOnly } from 'near-api-js';
import * as nearAPI from 'near-api-js';
import dotenv from 'dotenv';

dotenv.config();

// Sample accounts to demonstrate queries
const SAMPLE_ACCOUNTS = [
    'near',              // NEAR Foundation
    'aurora',            // Aurora EVM
    'relay.aurora',      // Aurora relay
    'wrap.near',         // wNEAR contract
    'v2.ref-finance.near' // Ref Finance
];

async function main() {
    console.log('\n🔍 Read-Only Connection Example\n');
    console.log('═'.repeat(60));

    // Check for API key
    const apiKey = process.env.FASTNEAR_API_KEY;
    if (apiKey) {
        console.log('✅ Using FastNEAR API key for authentication');
    } else {
        console.log('⚠️  No API key found - using public RPC endpoint');
        console.log('   Set FASTNEAR_API_KEY in .env for better performance');
    }
    console.log('═'.repeat(60));

    // Create read-only connection
    const connection = await connectReadOnly({
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.fastnear.com',
        headers: apiKey ? {
            'Authorization': `Bearer ${apiKey}`
        } : undefined
    });

    console.log('\n📊 Querying Account Balances:\n');

    // Query multiple accounts in parallel
    const balancePromises = SAMPLE_ACCOUNTS.map(async (accountId) => {
        try {
            const accountState = await connection.provider.query({
                request_type: 'view_account',
                finality: 'final',
                account_id: accountId
            });

            const balanceInNear = nearAPI.utils.format.formatNearAmount(
                accountState.amount,
                2
            );

            return {
                accountId,
                balance: balanceInNear,
                success: true
            };
        } catch (error) {
            return {
                accountId,
                error: error.message,
                success: false
            };
        }
    });

    const results = await Promise.all(balancePromises);

    // Display results
    results.forEach(result => {
        if (result.success) {
            console.log(`  ✅ ${result.accountId.padEnd(25)} ${result.balance.padStart(15)} Ⓝ`);
        } else {
            console.log(`  ❌ ${result.accountId.padEnd(25)} Error: ${result.error}`);
        }
    });

    // Example: Call a view function
    console.log('\n═'.repeat(60));
    console.log('\n📞 Calling View Function (wNEAR Token Metadata):\n');

    try {
        const result = await connection.provider.query({
            request_type: 'call_function',
            finality: 'final',
            account_id: 'wrap.near',
            method_name: 'ft_metadata',
            args_base64: Buffer.from('{}').toString('base64')
        });

        const metadata = JSON.parse(Buffer.from(result.result).toString());
        console.log('  Token:', metadata.name);
        console.log('  Symbol:', metadata.symbol);
        console.log('  Decimals:', metadata.decimals);
        console.log('  Icon:', metadata.icon ? '✅ Present' : '❌ None');
    } catch (error) {
        console.error('  ❌ Error calling view function:', error.message);
    }

    // Example: Get access keys
    console.log('\n═'.repeat(60));
    console.log('\n🔑 Fetching Access Keys for near.near:\n');

    try {
        const keysResult = await connection.provider.query({
            request_type: 'view_access_key_list',
            finality: 'final',
            account_id: 'near.near'
        });

        console.log(`  Found ${keysResult.keys.length} access keys`);
        keysResult.keys.slice(0, 3).forEach((key, idx) => {
            console.log(`  ${idx + 1}. ${key.public_key} (${key.access_key.permission})`);
        });
        if (keysResult.keys.length > 3) {
            console.log(`  ... and ${keysResult.keys.length - 3} more`);
        }
    } catch (error) {
        console.error('  ❌ Error fetching access keys:', error.message);
    }

    console.log('\n═'.repeat(60));
    console.log('\n✨ Example complete!');
    console.log('\n💡 Key takeaways:');
    console.log('   - No signer required for read-only operations');
    console.log('   - Custom headers work seamlessly');
    console.log('   - Parallel queries are efficient');
    console.log('   - Error handling is straightforward\n');
}

// Run with error handling
main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
});
