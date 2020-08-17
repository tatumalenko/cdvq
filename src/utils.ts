export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

export function splitByComma(s: string): string[] {
    return s.split(",");
}
export function parseEmailAddress(address: string): string {
    const ADDRESS_BRACKETS = [ "<", ">" ];
    const ADDRESS_REGEX = /<.*>/g;
    if (ADDRESS_BRACKETS.every((bracket) => address.includes(bracket))) {
        const match = address.match(ADDRESS_REGEX);
        if (match && match?.length > 0) {
            return match[0].replace(/<|>/g, "");
        }
        return address;
    }
    return address;

}
