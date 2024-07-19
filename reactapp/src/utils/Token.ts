export interface Token {
    expiration: number;
    issued_at: string;
    token: string;
}

export function getFlyNowTokenFromStorage(): Token | undefined {
    let token = localStorage.getItem("flynow_token");
    let expiration = localStorage.getItem("flynow_token_expiration");
    let issuedAt = localStorage.getItem("flynow_token_issuedAt");
    if (token && expiration && issuedAt)
        return {
            token: token,
            expiration: Number.parseInt(expiration),
            issued_at: issuedAt,
        };
    return undefined;
}

export function saveFlyNowTokenToStorage(tokenObject: Token) {
    if (tokenObject) {
        localStorage.setItem("flynow_token", "Bearer " + tokenObject.token);
        localStorage.setItem("flynow_token_expiration", tokenObject.expiration.toString());
        localStorage.setItem("flynow_token_issuedAt", tokenObject.issued_at);
    }
}

export function removeFlyNowTokenFromStorage() {
    localStorage.removeItem("flynow_token");
    localStorage.removeItem("flynow_token_expiration");
    localStorage.removeItem("flynow_token_issuedAt");
}

export const checkIfExpired = (jwt: Token) => {
    const issuedAt = new Date(jwt.issued_at);
    const expirationTime = new Date(issuedAt).getTime() + jwt.expiration * 1000;
    const currentTime = new Date().getTime();
    return currentTime >= expirationTime;
};
