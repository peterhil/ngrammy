import {
    drop,
    head,
    range,
    reduce,
    tail,
    take,
    takeLast,
} from 'rambda'

/**
 * Join common end and start parts or just concatenate – link shingling of roof tiles
 */
export function shingle (a: string, b: string): string {
    let common = Math.min(a.length, b.length)

    do { common-- } while (takeLast(common, a) !== take(common, b))

    return a + drop(common, b)
}

/**
 * Join ngrams back together
 */
export function ungram (slices: string[]): string {
    return reduce(shingle, head(slices) || '', tail(slices))
}

/**
 * Get ngrams of length n from input
 * @see: {@link https://en.wikipedia.org/wiki/N-gram|N-gram} at Wikipedia
 */
export function ngram(n: number, input: string) {
    const slices: string[] = []

    for (const index of range(0, input.length - n + 1)) {
        slices.push(input.slice(index, index + n))
    }

    return slices
}

/**
 * Get bigrams from input
 */
export function bigram (input: string) {
    return ngram(2, input)
}

/**
 * Get trigrams from input
 */
export function trigram (input: string) {
    return ngram(3, input)
}
