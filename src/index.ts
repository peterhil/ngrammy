export function ngrams(n: number, input: string) {
    let ngrams: string[] = []
    let index: number = 0

    for (index = 0; index < input.length - n + 1; index++) {
        ngrams.push(input.slice(index, index + n))
    }

    return ngrams
}

export default {
    ngrams,
}
