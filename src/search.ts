import {
    add,
    defaultTo,
    filter,
    flatten,
    head,
    includes,
    intersection,
    isEmpty,
    last,
    map,
    mergeAll,
    not,
    pick,
    pipe,
    reduce,
    tail,
    values,
} from 'rambda'

import { ids, match, nonEmpty } from './lib/utils'
import { ngram } from './ngram'
import {
    Description,
    Indexable,
    Ngram,
    NgramIndex,
    Position,
    Term,
    empty,
} from './types'

export class Index {
    private terms: NgramIndex
    readonly _normalise: Function
    readonly n: number
    readonly sentinel: string

    constructor (
        n: number = 2,
        sentinel: string = '\n',
        normalise: Function = Index.normalise,
    ) {
        this.n = n
        this.sentinel = sentinel
        this.terms = new Map() // TODO Use WeakMap?
        this._normalise = normalise
    }

    static normalise (term: Term): Ngram {
        return term
            .replace(/[\s\u0085]+/ug, ' ')
            .trim()
            .toLowerCase()
    }

    add (term: Term, key?: Indexable) {
        const normalised = this.normalise(term) + this.sentinel
        const ngrams: Ngram[] = ngram(this.n, normalised)
        const id: Indexable = key ?? this.size()

        for (const pos in ngrams) {
            this._insert(ngrams[pos], id, parseInt(pos))
        }
    }

    all (): Object {
        return Object.fromEntries(this.terms.entries())
    }

    has (term: Term) {
        const normalised = this.normalise(term) + this.sentinel
        const ngrams: Ngram[] = ngram(this.n, normalised)

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

    normalise (term: Term): Term {
        // TODO Allow shorter terms? This requires indexing shorter ngrams also.
        return this._checkTermLength(this._normalise(term))
    }

    lengths (): Description {
        const descriptions: Description[] = values(this._ends())
        const lengthFromPositions = pipe(last, add(1))  // get length from last position
        const lengths: Description = map(
            lengthFromPositions,
            mergeAll(descriptions),
        )

        return lengths
    }

    locations (term: Term): Description {
        const normalised = this.normalise(term)
        const ngrams: Ngram[] = ngram(this.n, normalised)
        const matches: Description[] = this._getMany(ngrams)

        if (isEmpty(matches)) return empty

        const found: Description = reduce(
            match,
            head(matches) ?? empty,
            tail(matches) ?? empty,
        )
        const filtered: Description = filter(nonEmpty, Object.freeze(found))

        return filtered
    }

    search (term: Term): Indexable[] {
        return ids(this.locations(term))
    }

    size (): number {
        return ids(this.lengths()).length
    }

    _ends () {
        const isSentinel = (_: any, ng: Ngram): boolean => {
            return last(ng) === this.sentinel
        }

        return filter(isSentinel, this.all())
    }

    _get (ngram: Ngram): Description {
        return this.terms.get(ngram) ?? empty
    }

    _getMany (ngrams: Ngram[]): Description[] {
        const getTerm = (ng: Ngram): Description => this._get(ng)
        const matches: Description[] = defaultTo([], map(getTerm, ngrams)) as Description[]

        return matches
    }

    _checkTermLength (term: Term): Term {
        if (term.length < this.n) {
            throw new RangeError('Term must be at least index length')
        }

        return term
    }

    _set (ngram: Ngram, value: Description): NgramIndex {
        return this.terms.set(ngram, value)
    }

    _insert (ngram: Ngram, id: Indexable, pos: Position): NgramIndex {
        const existing: Description = this._get(ngram)
        const oldPositions: Position[] = defaultTo(
            [],
            existing[id as keyof Description]
        )

        const updated: Description = {[id]: [...oldPositions, pos]}
        const value: Description = {...existing, ...updated}

        return this._set(ngram, value)
    }
}
