import {
    includes,
    intersection,
    isEmpty,
    keys,
    not,
    values,
} from 'rambda'

import { ngram } from './ngram'

type Ngram = Lowercase<string>
type Position = string // TODO Change to number
type Query = string
type Term = Lowercase<string>

type Indexable = string | number // TODO Add '| symbol' or use Maps on every level?
type Description = { [Property in keyof Indexable]?: Position }
type NgramIndex = Map<Ngram, Description>

const empty: Description = {}

export class Index {
    private terms: NgramIndex
    readonly n: number
    readonly sentinel: string

    constructor (n: number = 2, sentinel: string = '\n') {
        this.n = n
        this.sentinel = sentinel
        this.terms = new Map() // TODO Use WeakMap?
    }

    static normalise (term): Ngram {
        return term
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()
    }

    add (term, key?: Indexable) {
        const ngrams = ngram(this.n, this.normalise(term))
        const id: Indexable = key ?? this.terms.size.toString() // TODO Test numerical indices

        for (let pos in ngrams) {
            this._insert(ngrams[pos], id, pos)
        }
    }

    all () {
        return Object.fromEntries(this.terms.entries())
    }

    has (term) {
        const ngrams = ngram(this.n, this.normalise(term))

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

    normalise (term: Query): Term {
        return Index.normalise(term) + this.sentinel
    }

    _get (ngram: Ngram): Description {
        return this.terms.get(ngram) ?? empty
    }

    _set (ngram: Ngram, value: Description): NgramIndex {
        return this.terms.set(ngram, value)
    }

    _insert (ngram: Ngram, id: Indexable, pos: Position): NgramIndex {
        const existing = this._get(ngram)

        return this._set(ngram, {...existing, [id]: pos} as Description)
    }
}
