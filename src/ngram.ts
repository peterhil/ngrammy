import {
    head,
    last,
    lastIndexOf,
    reduce,
    splitAt,
    tail,
} from 'rambda'

// Join common end and start parts or just concatenate
export function shingle (a: string, b: string): string {
    const af = lastIndexOf(head(b), a?.split('') || '')
    const bf = b.indexOf(last(a)) + 1

    if (af === -1) return a + b
    if (bf === -1) return a + b

    const [_, tailA] = splitAt(af, a)
    const [initB, tailB] = splitAt(bf, b)

    const result = (tailA === initB
        ? a + tailB
        : a + b)

    return result
}

// Join ngrams back together
export function ungram (slices: string[]): string | undefined {
    if (slices.length === 0) return ''

    const joined = reduce(shingle, head(slices) || '', tail(slices))

    return joined
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
