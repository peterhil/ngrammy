import fc from 'fast-check'
import tap from 'tap'
import { init, tail, uniq } from 'rambda'

import {
    ngram,
    shingle,
    ungram,
} from '../src/ngram'

// Shingle

tap.test('shingle', t => {
    const expected = 'abcdefg'

    t.same(shingle('abcdef', 'efg'), expected)
    t.end()
})

tap.test('shingle fast check', assert => {
    assert.doesNotThrow(() => {
        fc.assert(
            fc.property(
                fc.string({minLength: 2}),
                (
                    input
                ) => {
                    // TODO Check repeating characters!
                    const word: string = uniq(input.split('')).join('')

                    assert.same(
                        shingle(init(word), tail(word)),
                        word
                    )
                }))
    })
    assert.end()
})

// Ungram

tap.test('ungram', t => {
    const expected = 'ngram'

    t.same(ungram(['ngr', 'gra', 'ram']), expected)
    t.end()
})

// Ngram

tap.test('ngram works with unigrams', t => {
    const expected = ['n', 'g', 'r', 'a', 'm']

    t.same(ngram(1, 'ngram'), expected)
    t.end()
})

tap.test('ngram works with bigrams', t => {
    const expected = ['ng', 'gr', 'ra', 'am']

    t.same(ngram(2, 'ngram'), expected)
    t.end()
})

tap.test('ngram works with trigrams', t => {
    const expected = [
        'ngra',
        'gram',
    ]

    t.same(ngram(4, 'ngram'), expected)
    t.end()
})

tap.test('ngram works when n is word length', t => {
    const expected = ['ngram']

    t.same(ngram(5, 'ngram'), expected)
    t.end()
})

tap.skip('ngram fast check', assert => {
    assert.doesNotThrow(() => {
        fc.assert(
            fc.property(
                fc.nat(5),
                fc.string({minLength: 3}),
                (
                    n: number,
                    word: string
                ) => {
                    console.log(`ngram word: '${word}'`)
                    assert.same(ungram(ngram(n, word)), word)
                }
            )
        )
    })
    assert.end()
})
