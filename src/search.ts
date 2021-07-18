import {
    includes,
    intersection,
    isEmpty,
    keys,
    not,
    values,
} from 'rambda'

import { ngram } from './ngram'

type Description = { [id: string]: string }
type Indexable = string | number | symbol
type Ngram = Lowercase<string>
type NgramIndex = Map<Indexable, Description>

export class Index {
    private terms: NgramIndex

    constructor (private n: number = 2) {
        this.n = n
        this.terms = new Map() // TODO Use WeakMap?
    }

    static normalise (term): Ngram {
        return term
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()
    }

    add (term, key?: Indexable) {
        const ngrams = ngram(this.n, Index.normalise(term))
        const id = key ?? this.terms.size // TODO Test numerical indices

        for (let pos in ngrams) {
            this._insert(ngrams[pos], id, pos)
        }
    }

    all () {
        return Object.fromEntries(this.terms.entries())
    }

    has (term) {
        const ngrams = ngram(this.n, Index.normalise(term))

        let pos: number = -1
        let ng: string
        let entry: Description
        let candidates

        do {
            pos++
            ng = ngrams[pos]
            entry = this.terms.get(ng) ?? {}
            candidates = (candidates
                ? intersection(candidates, keys(entry))
                : keys(entry)) as Indexable[]
        } while (
            ng
                && not(isEmpty(entry))
                && not(isEmpty(candidates))
                && includes(pos.toString(), values(entry))
        )

        return pos === ngrams.length
    }

    _get (ngram: Ngram) {
        return this.terms.get(ngram)
    }

    _set (ngram: Ngram, value: Description) {
        return this.terms.set(ngram, value)
    }

    _insert (ngram: Ngram, id: Indexable, pos) {
        const existing = this._get(ngram)

        if (existing) {
            this._set(ngram, {[id]: pos, ...existing})
        } else {
            this._set(ngram, {[id]: pos})
        }
    }
}
