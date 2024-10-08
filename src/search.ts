import {
    filter,
    filterObject,
    flatten,
    forEach,
    forEachIndexed,
    includes,
    intersection,
    isEmpty,
    last,
    map,
    mergeAll,
    not,
    pick,
    reduce,
    splitAt,
    values,
} from 'rambdax'

import { empty, ids, lengthFromPositions, match, nonEmpty } from './utils/helpers'
import { ngram } from './ngram'

import type {
    Description,
    Indexable,
    Lengths,
    Locations,
    Ngram,
    NgramIndex,
    NormaliseFunction,
    Position,
    StringDescription,
    Term,
    Terms,
} from './commonTypes'

/**
 * Unicode capable {@link https://en.wikipedia.org/wiki/N-gram|N-gram}
 * search index for writing custom {@link
 * https://en.wikipedia.org/wiki/Autocomplete|autocompletions}
 */
export class Index {
    private terms: NgramIndex
    private readonly _normalise: NormaliseFunction

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
     * @param sentinel {@link https://en.wikipedia.org/wiki/Sentinel_value|sentinel}
     * character – added to term on {@link add} and {@link has} to
     * ensure that whole terms on index are checked.
     *
     * @param normalise
     * normalises search terms, defaults to **static** Index.normalise
     */
    constructor (
        n: number = 2,
        sentinel: string = '\n',
        normalise: NormaliseFunction = Index.normalise,
    ) {
        this.n = n
        this.sentinel = sentinel
        this.terms = {}
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
     * Create index from terms
     *
     * Terms can be an array of terms or an object mapping ids to terms
     */
    static from (
        terms: Terms,
        ...args: [number?, string?, NormaliseFunction?]
    ) {
        const index: NgramIndex = {}
        const self = new this(...args)

        const updater = ([id, term]: [Indexable, Term]) => {
            const normalised = self.normalise(term) + self.sentinel
            const ngrams: Ngram[] = ngram(self.n, normalised)

            forEachIndexed((ngram, pos) => {
                index[ngram] = this.updateDescription(index[ngram], id, pos)
            }, ngrams)
        }

        forEach(updater, Object.entries(terms))
        self.terms = index

        return self
    }

    static updateDescription (
        description: StringDescription,
        id: Indexable,
        pos: Position)
    {
        const sid: string = id.toString()

        return description
            ? (description[sid]
                ? { ...description, ...{[sid]: [...description[sid], pos]} }
                : { ...description, ...{[sid]: [pos]} })
            : {[sid]: [pos]}
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

        forEachIndexed((ngram, pos) => {
            this._insert(ngram, id, pos)
        }, ngrams)
    }

    /**
     * Returns whole index as an object
     */
    all (): object {
        return this.terms
    }

    /**
     * Does the index has term?
     *
     * @throws RangeError if term is shorter than {@link n}
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
            entry = this.terms[ng] ?? {}
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
     * Calls the normalisation function given on {@link constructor},
     * and checks that term length is at least {@link n| index length}.
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
    lengths (): Lengths {
        const descriptions: Description[] = this._ends()
        const lengths: Lengths = map(
            lengthFromPositions,
            mergeAll(descriptions),
        )

        return lengths
    }

    /**
     * Search by term and return locations where this term occurs
     *
     * @throws RangeError if term is shorter than {@link n}
     */
    locations (term: Term): Locations {
        const normalised = this.normalise(term)
        const ngrams: Ngram[] = ngram(this.n, normalised)
        const matches: Description[] = this._getMany(ngrams)

        if (isEmpty(matches)) return empty

        const [first, rest] = splitAt(1, matches)
        const found: Description = reduce(match, first[0], rest)
        const filtered: Locations = filter(nonEmpty, Object.freeze(found))

        return filtered
    }

    /**
     * Search by term and return indices of matching terms
     *
     * @throws RangeError if term is shorter than {@link n}
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

    private _ends (): Description[] {
        const isSentinel = (_, ng: Ngram): boolean => {
            return last(ng) === this.sentinel
        }

        return values(filterObject(isSentinel, this.all()))
    }

    private _get (ngram: Ngram): Description {
        return this.terms[ngram] ?? empty
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

    private _insert (ngram: Ngram, id: Indexable, pos: Position) {
        this.terms[ngram] = Index.updateDescription(
            this.terms[ngram],
            id,
            pos,
        )
    }
}
