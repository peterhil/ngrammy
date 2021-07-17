import {
    drop,
    head,
    reduce,
    tail,
    take,
    takeLast,
} from 'rambda'

// Join common end and start parts or just concatenate
export function shingle (a: string, b: string): string {
    let common = Math.min(a.length, b.length)
    do { common-- } while (takeLast(common, a) !== take(common, b))

    return a + drop(common, b)
}

// Join ngrams back together
export function ungram (slices: string[]): string | undefined {
    if (slices.length === 0) return ''

    return reduce(shingle, head(slices) || '', tail(slices))
}

// Get ngrams of length n from input
export function ngram(n: number, input: string) {
    let slices: string[] = []
    let index: number = 0

    for (index = 0; index < input.length - n + 1; index++) {
        slices.push(input.slice(index, index + n))
    }

    return slices
}
