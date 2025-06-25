import * as lzma from 'lzma-native';

export async function compress(s: string) {
    return ((await lzma.compress(s)) as unknown) as string;
}

export async function decompress(s: string) {
    return ((await lzma.decompress(s)) as unknown) as string;
}
