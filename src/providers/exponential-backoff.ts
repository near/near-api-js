/**
 * Polls a callback with exponentially increasing delays until it returns a truthy value.
 * @param startWaitTime - Initial delay in milliseconds after an unsuccessful attempt.
 * @param retryNumber - Maximum callback invocations, including the first attempt.
 * @param waitBackoff - Multiplier applied to the delay after each unsuccessful attempt.
 * @param getResult - Callback to poll. Falsy results, including 0 and false, cause another attempt.
 * @returns The first truthy result, or `null` after all attempts. Callback exceptions propagate without retry.
 */
export async function exponentialBackoff(startWaitTime, retryNumber, waitBackoff, getResult) {
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
    return new Promise((resolve) => setTimeout(resolve, millis));
}
