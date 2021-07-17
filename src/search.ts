import { invert } from './lib/iterable'
import { ngram } from './ngram'

export function index (terms: string[], n: number = 2) {
    return invert(ngram(n, terms[0]))
}
