import {
    signNep413Message,
} from '@near-js/signer'; // 
import {
    verifyNep413Message,
} from '@near-js/utils'; // this should move

export default async function signAndVerifyNep413Message(accountId: string = ACCOUNT_ID, transactionHash: string = TX_HASH) {

    // create a payload (Nep413Message)

    const signedMessage = signNep413Message(Nep413Message);

    try {
        const isValid = verifyNep413Message(Nep413Message, signedMessage);
    } catch (e) {
        // invalid
    }
}
