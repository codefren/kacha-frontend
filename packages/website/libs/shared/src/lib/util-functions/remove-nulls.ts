export function removeNulls(plain: any) {
    Object.keys(plain).forEach(key => {
        if (plain[key] && typeof plain[key] === 'object') {
            removeNulls(plain[key]);
        } else if (plain[key] === null) {
            delete plain[key];
        }
    });
    return plain;
}
