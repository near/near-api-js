export default async function exponentialBackoff(startWaitTime: number, retryNumber: number, waitBackoff: number, getResult: () => Promise<any>) {
    // TODO: jitter?

    let waitTime = startWaitTime;
    for (let i = 0; i < retryNumber; i++) {
        const result = await getResult();
        if (result) {
            return result;
        }

        await sleep(waitTime);
        waitTime *= waitBackoff;
    }

    return null;
}

// Sleep given number of millis.
function sleep(millis: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, millis));
}


