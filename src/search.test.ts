import fc from 'fast-check'
import tap from 'tap'

import {
    filter,
    forEach,
    keys,
    map,
} from 'rambda'

import { Index, match } from './search'
import { denormalise } from './testUtils'

tap.test('Index.normalise', assert => {
    const term = '  Data\t structures\n '
    const expected = 'data structures'

    assert.same(
        expected,
        Index.normalise(term),
    )
    assert.end()
})

tap.test('Index.normalise fast check', assert => {
    fc.assert(
        fc.property(
            fc.lorem(4),
            (words: string) => {
                const expected = words
                const term = denormalise(words)

                assert.same(
                    expected,
                    Index.normalise(term),
                )
            }
        )
    )
    assert.end()
})

tap.test('index', assert => {
    const index = new Index(3, '•')
    index.add('Alpha', 'a')

    assert.same(
        {
            alp: {a: [0]},
            lph: {a: [1]},
            pha: {a: [2]},
            'ha•': {a: [3]},
        },
        index.all()
    )
    assert.end()
})

tap.test('index multiple items', assert => {
    const index = new Index(2, '_')
    index.add('Alpha', 'a')
    index.add('Aleph', 'b')

    assert.same(
        {
            al: {a: [0], b: [0]},
            ep: {b: [2]},
            ha: {a: [3]},
            le: {b: [1]},
            lp: {a: [1]},
            ph: {a: [2], b: [3]},
            a_: {a: [4]},
            h_: {b: [4]},
        },
        index.all()
    )
    assert.end()
})

tap.test('index with numeric ids', assert => {
    const index = new Index(2, '_')
    index.add('Alpha')
    index.add('Aleph')
    // TODO Remove and add items (with fast-check?)

    assert.same(
        {
            al: {0: [0], 1: [0]},
            ep: {1: [2]},
            ha: {0: [3]},
            le: {1: [1]},
            lp: {0: [1]},
            ph: {0: [2], 1: [3]},
            a_: {0: [4]},
            h_: {1: [4]},
        },
        index.all()
    )
    assert.end()
})

tap.test('index throws with too short terms', assert => {
    const index = new Index(3)
    const expectedErr = new RangeError('Term must be at least index length')
    index.add('Alpha')

    assert.throws(() => index.add('Al'), expectedErr)
    assert.throws(() => index.has('Al'), expectedErr)
    assert.throws(() => index.locations('Al'), expectedErr)
    assert.throws(() => index.search('Al'), expectedErr)
    assert.end()
})

tap.test('index with custom normalisation', assert => {
    const normalise = (term) => {
        return term.replace(/\s+/g, ' ')
            .trim()
            .toUpperCase()
    }
    const index = new Index(2, '$', normalise)

    index.add('Alpha', 'a')
    index.add('Aleph', 'b')
    index.add('Alpine', 'c')

    assert.same(['a', 'b', 'c'], index.search('al'))
    assert.same('ALPHA', index.normalise('Alpha'))
    assert.same(['A$', 'H$', 'E$'], keys(index._ends()))
    assert.end()
})

tap.test('has', assert => {
    const index = new Index(2)
    index.add('Alpha', 'a')
    index.add('Alpine', 'b')

    assert.doesNotThrow(() => {
        assert.ok(index.has('alpha'), 'should have alpha')
        assert.notOk(index.has('beta'), 'should not have beta')
        assert.notOk(index.has('halph'), 'should check the order of ngrams')
        assert.notOk(index.has('alp'), 'should use a sentinel')
    })
    assert.end()
})

tap.test('has fast check', assert => {
    const indexRange: [number, number] = [1, 4]
    const minLength = indexRange[1]
    fc.assert(
        fc.property(
            fc.integer(...indexRange),
            fc.array(
                fc.oneof(
                    fc.string({minLength}),
                    fc.fullUnicodeString({minLength}),
                ),
                4
            ),
            (n: number, terms: string[]) => {
                const index = new Index(n)

                forEach((term) => index.add(term), terms)

                forEach((term) => {
                    assert.ok(index.has(term), `should have '${term}'`)
                }, terms)
            }
        )
    )
    assert.end()
})

tap.test('has with repetitive strings', assert => {
    const index = new Index(2, '_')
    index.add('Ananas', 'a')
    index.add('Banana', 'b')
    index.add('Bananas', 'c')

    assert.same(
        {
            an: {a: [0, 2], b: [1, 3], c: [1, 3]},
            ba: {b: [0], c: [0]},
            na: {a: [1, 3], b: [2, 4], c: [2, 4]},
            as: {a: [4], c: [5]},
            a_: {b: [5]},
            s_: {a: [5], c: [6]},
        },
        index.all()
    )

    assert.doesNotThrow(() => {
        assert.ok(index.has('ananas'), 'should be found')
        assert.ok(index.has('banana'), 'should be found')
        assert.ok(index.has('bananas'), 'should be found')
        assert.notOk(index.has('ana'), 'should not be found')
        assert.notOk(index.has('anas'), 'should not be found')

    })
    assert.end()
})

tap.test('search', assert => {
    const index = new Index(2)
    index.add('Alpha', 'a')
    index.add('Alpine', 'b')

    assert.same(['a', 'b'], index.search('lp'), 'with gram')
    assert.same(['a', 'b'], index.search('alp'), 'with prefix')
    assert.same(['a'],      index.search('lph'), 'with infix')
    assert.same(['a'],      index.search('pha'), 'with suffix')
    assert.same([], index.search('nonexisting'), 'returns empty results')
    assert.end()
})

tap.test('search fast check', assert => {
    const minLength = 3
    const indexRange: [number, number] = [1, 4]
    const termsRange: [number, number] = [2, 8]

    fc.assert(
        fc.property(
            fc.integer(...indexRange),
            fc.array(
                fc.oneof(
                    fc.string({minLength}),
                    fc.fullUnicodeString({minLength}),
                ),
                ...termsRange,
            ),
            (n: number, termsIn: string[]) => {
                const index = new Index(n)
                const termsCleaned = map(Index.normalise, termsIn)
                const terms = filter(term => n <= term.length, termsCleaned)

                forEach((term, i) => index.add(term, i), terms)

                forEach((term) => {
                    assert.ok(
                        index.search(term).length > 0,
                        'should have results from index' +
                        `(${n}) with '${term}' from terms ['${terms.join("', '")}']`)
                }, terms)
            }
        )
    )
    assert.end()
})

tap.test('locations', assert => {
    const index = new Index(2)
    index.add('ananas', 'a')
    index.add('banana', 'b')
    index.add('cancan', 'c')
    index.add('kanervana', 'k')
    index.add('Anna', 'n')
    index.add('globalisation', 'g')

    assert.doesNotThrow(() => {
        assert.same(
            {
                a: [0, 2],
                b: [1, 3],
                k: [6]
            },
            index.locations('ana'), 'with infix')
        assert.same(
            {c: [0, 3]},
            index.locations('can'), 'with repeating term')
        assert.same(
            {g: [3]},
            index.locations('balisa'), 'with multiple ngrams')
    })
    assert.end()
})

tap.test('lengths', assert => {
    const index = new Index(2)

    assert.doesNotThrow(() => {
        index.add('Alpha', 'a')
        index.add('Alpine', 'b')
        index.add('Beta', 'c')
        assert.same({a: 5, b: 6, c: 4}, index.lengths())
    })
    assert.end()
})

tap.test('match', assert => {
    const d1 = {a: [0, 3], b: [1], c: [2, 4]}
    const d2 = {a: [1, 4], b: [2], c: [3, 5]}
    const d3 = {a: [2], b: [], c: [6]}

    assert.same({a: [0, 3], b: [1], c: [2, 4]},
                match(d1, d2, 0))
    assert.same({a: [0], b: [], c: [4]},
                match(d1, d3, 1))
    assert.end()
})

tap.test('size', assert => {
    const index = new Index(2)

    assert.doesNotThrow(() => {
        assert.equal(index.size(), 0)
        index.add('Alpha', 'a')
        assert.equal(index.size(), 1)
        index.add('Alpine', 'b')
        assert.equal(index.size(), 2)
        index.add('Beta', 'c')
        assert.equal(3, index.size())
    })
    assert.end()
})
