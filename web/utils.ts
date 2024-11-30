// Unsafe password hashing function that is also for some reason
// done in frontend code
export const hashPassword = (password: string) => {
    const encoder = new TextEncoder();
    const passwordArray = encoder.encode(password);

    const invertedArray = new Uint8Array(passwordArray.length);

    for (let i = 0; i < passwordArray.length; i++) {
        invertedArray[i] = ~passwordArray[i];
    }

    const base64String = btoa(String.fromCharCode(...invertedArray));

    return base64String;
};

export const formatMessage = (raw: any) => {
    return `${raw.username}: ${raw.message}`;
}