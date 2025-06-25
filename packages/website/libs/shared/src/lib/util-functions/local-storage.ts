export function getFromLocalStorage(key: string) {
    return localStorage.getItem(key);
}

export function getParsedFromLocalStorage(key: string) {
    return JSON.parse(getFromLocalStorage(key));
}

export function setToLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
}
