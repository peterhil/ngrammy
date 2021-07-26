import {
    add,
    defaultTo,
    filter,
    flatten,
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
    splitAt,
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

/**
 * Unicode capable {@link https://en.wikipedia.org/wiki/N-gram|N-gram}
 * search index for writing custom {@link
 * https://en.wikipedia.org/wiki/Autocomplete|autocompletions}
 */
export class Index {
    private terms: NgramIndex
    private readonly _normalise: Function

    /**
     * n-gram width
     */
    readonly n: number

    /**
     * sentinel character
     */
    readonly sentinel: string

    /**
     * @param n
     * n-gram width
     *
     * @param sentinel
     * {@link https://en.wikipedia.org/wiki/Sentinel_value|sentinel} character
     *
     * @param normalise
     * normalises search terms, defaults to static {@link Index.normalise}
     */
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

    /**
     * Collapse and trim whitespace, then lowercase the input
     */
    static normalise (term: Term): Ngram {
        return term
            .replace(/[\s\u0085]+/ug, ' ')
            .trim()
            .toLowerCase()
    }

    /**
     * Add a term into index by key
     *
     * @remarks It is recommended to use strings as keys, as currently
     * using numbers might be slow.
     *
     * @throws RangeError if term is shorter than {@link n}
     */
    add (term: Term, key?: Indexable) {
        const normalised = this.normalise(term) + this.sentinel
        const ngrams: Ngram[] = ngram(this.n, normalised)
        const id: Indexable = key ?? this.size()

        for (const pos in ngrams) {
            this._insert(ngrams[pos], id, parseInt(pos))
        }
    }

    /**
     * Returns whole index as an object
     */
    all (): Object {
        return Object.fromEntries(this.terms.entries())
    }

    /**
     * Does the index has term?
     */
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

    /**
     * Normalise a term
     *
     * @throws RangeError if term is shorter than {@link n}
     */
    normalise (term: Term): Term {
        // TODO Allow shorter terms? This requires indexing shorter ngrams also.
        return this._checkTermLength(this._normalise(term))
    }

    /**
     * Lengths of all the terms in the index
     */
    lengths (): Description {
        const descriptions: Description[] = values(this._ends())
        const lengthFromPositions = pipe(last, add(1))  // get length from last position
        const lengths: Description = map(
            lengthFromPositions,
            mergeAll(descriptions),
        )

        return lengths
    }

    /**
     * Search by term and return locations where this term occurs
     */
    locations (term: Term): Description {
        const normalised = this.normalise(term)
        const ngrams: Ngram[] = ngram(this.n, normalised)
        const matches: Description[] = this._getMany(ngrams)

        if (isEmpty(matches)) return empty

        const [first, rest] = splitAt(1, matches)
        const found: Description = reduce(match, first[0], rest)
        const filtered: Description = filter(nonEmpty, Object.freeze(found))

        return filtered
    }

    /**
     * Search by term and return indices of matching terms
     */
    search (term: Term): Indexable[] {
        return ids(this.locations(term))
    }

    /**
     * Size of the index (number of terms in the index)
     */
    size (): number {
        return ids(this.lengths()).length
    }

    private _ends () {
        const isSentinel = (_: any, ng: Ngram): boolean => {
            return last(ng) === this.sentinel
        }

        return filter(isSentinel, this.all())
    }

    private _get (ngram: Ngram): Description {
        return this.terms.get(ngram) ?? empty
    }

    private _getMany (ngrams: Ngram[]): Description[] {
        const getTerm = (ng: Ngram): Description => this._get(ng)
        const matches: Description[] = map(getTerm, ngrams) as Description[]

        return filter(nonEmpty, matches)
    }

    private _checkTermLength (term: Term): Term {
        if (term.length < this.n) {
            throw new RangeError('Term must be at least index length')
        }

        return term
    }

    private _set (ngram: Ngram, value: Description): NgramIndex {
        return this.terms.set(ngram, value)
    }

    private _insert (ngram: Ngram, id: Indexable, pos: Position): NgramIndex {
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
