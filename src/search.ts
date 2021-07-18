import { ngram } from './ngram'

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

        for (let pos in ngrams) {
            let value = ngrams[pos]
            let existing = this.terms.get(value)

            if (existing) {
                this.terms.set(value, {[id]: pos, ...existing})
            } else {
                this.terms.set(value, {[id]: pos})
            }
        }
    }

    all () {
        return Object.fromEntries(this.terms.entries())
    }
}
