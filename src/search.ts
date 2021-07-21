import {
    add,
    filter,
    flatten,
    includes,
    intersection,
    isEmpty,
    keys,
    last,
    map,
    mergeAll,
    not,
    pick,
    pipe,
    values,
} from 'rambda'

import { ngram } from './ngram'

const empty = {}
const ids = keys

type Ngram = Lowercase<string>
type Position = number
type Query = string
type Term = Lowercase<string>

type Indexable = string | number // TODO Add '| symbol' or use Maps on every level?
type Description = Map<Indexable, Position[]> | typeof empty
type NgramIndex = Map<Ngram, Description>

export class Index {
    private terms: NgramIndex
    readonly n: number
    readonly sentinel: string

    constructor (n: number = 2, sentinel: string = '\n') {
        this.n = n
        this.sentinel = sentinel
        this.terms = new Map() // TODO Use WeakMap?
    }

    static normalise (term: Query): Ngram {
        return term
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()
    }

    add (term: Query, key?: Indexable) {
        const ngrams = ngram(this.n, this.normalise(term))
        const id: Indexable = key ?? this.size()

        for (let pos in ngrams) {
            this._insert(ngrams[pos], id, parseInt(pos))
        }
    }

    all () {
        return Object.fromEntries(this.terms.entries())
    }

    has (term: Query) {
        const ngrams = ngram(this.n, this.normalise(term))

        let pos: number = -1
        let ng: string
        let entry: Description
        let candidates
        let positions: Position[]

        do {
            pos++
            ng = ngrams[pos]
            entry = this.terms.get(ng) ?? {}
            candidates = (candidates
                ? intersection(candidates, ids(entry))
                : ids(entry)) as Indexable[]
            positions = flatten(values(pick(candidates, entry))) as Position[]
        } while (
            ng
                && not(isEmpty(entry))
                && not(isEmpty(candidates))
                && includes(pos, positions)
        )

        return pos === ngrams.length
    }

    normalise (term: Query): Term {
        return Index.normalise(term) + this.sentinel
    }

    lengths () {
        const isSentinel = (_, ng: Ngram): boolean => {
            return last(ng) === this.sentinel
        }

        const ends = filter(isSentinel, this.all())
        const descriptions = values(ends)
        const lengths = map(
            pipe(last, add(1)),  // get length from last position
            mergeAll(descriptions)
        )

        return lengths
    }

    size () {
        return ids(this.lengths()).length
    }

    _get (ngram: Ngram): Description | undefined {
        return this.terms.get(ngram)
    }

    _set (ngram: Ngram, value: Description): NgramIndex {
        return this.terms.set(ngram, value)
    }

    _insert (ngram: Ngram, id: Indexable, pos: Position): NgramIndex {
        const existing: Description = this._get(ngram) ?? {}
        const oldPositions: Position[] = existing[id] ?? []

        const updated: Description = {[id]: [...oldPositions, pos]}
        const value: Description = {...existing, ...updated}

        return this._set(ngram, value)
    }
}
