import { invert } from './lib/iterable'
import { ngram } from './ngram'

export function index (terms: string[], n: number = 2) {
    return invert(ngram(n, terms[0]))
}

type indexable = string | number | symbol

type positions = {
    [id: string]: string,
}

export class Index {
    private terms: Map<indexable, positions>

    constructor (private n: number = 2) {
        this.n = n
        this.terms = new Map() // TODO Use WeakMap?
    }

    add (term, key?: indexable) {
        const id = key ?? this.terms.size
        const ngrams = ngram(this.n, term)

        for (let idx in ngrams) {
            this.terms.set(ngrams[idx], {[id]: idx})
        }
    }

    all () {
        return Object.fromEntries(this.terms.entries())
    }
}
