import {
    concat,
    init,
    reduce,
} from 'rambda'

// Join common end and start parts or just concatenate
export function shingle (a: string, b: string): string {
    const common = new RegExp(init(b) + '$')
    const start = a.replace(common, '')

    return concat(start, b)
}

// Join ngrams back together
export function ungram (slices) {
    return reduce(shingle, '', slices)
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
