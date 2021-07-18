import { all } from 'rambda'

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
            this._insert(ngrams[pos], id, pos)
        }
    }

    all () {
        return Object.fromEntries(this.terms.entries())
    }

    has (term) {
        const ngrams = ngram(this.n, term)

        return all((ng) => this.terms.has(ng), ngrams)
    }

    _get (ngram) {
        return this.terms.get(ngram)
    }

    _set (ngram, value) {
        return this.terms.set(ngram, value)
    }

    _insert (ngram, id, pos) {
        const existing = this._get(ngram)

        if (existing) {
            this._set(ngram, {[id]: pos, ...existing})
        } else {
            this._set(ngram, {[id]: pos})
        }
    }
}
