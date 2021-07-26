import fc from 'fast-check'
import tap from 'tap'
import { init, tail } from 'rambda'

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

tap.test('shingle with repeating characters', t => {
    const expected = 'ananas'

    t.same(shingle('anana', 'nanas'), expected)
    t.end()
})

tap.test('shingle fast check', assert => {
    const minLength = 2
    assert.doesNotThrow(() => {
        fc.assert(
            fc.property(
                fc.oneof(
                    fc.string({minLength}),
                    fc.fullUnicodeString({minLength}),
                ),
                (
                    word
                ) => {
                    assert.same(
                        shingle(init(word), tail(word)),
                        word,
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

tap.test('ungram with empty slices', t => {
    const expected = ''

    t.same(ungram([]), expected)
    t.end()
})

tap.test('ungram fast check', assert => {
    const minLength = 2
    assert.doesNotThrow(() => {
        fc.assert(
            fc.property(
                fc.oneof(
                    fc.string({minLength}),
                    fc.fullUnicodeString({minLength}),
                ),
                (
                    word
                ) => {
                    assert.same(
                        ungram(ngram(2, word)),
                        word,
                    )
                }))
    })
    assert.end()
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
    const expected = ['ngr', 'gra', 'ram']

    t.same(ngram(3, 'ngram'), expected)
    t.end()
})

tap.test('ngram works when n is word length', t => {
    const expected = ['ngram']

    t.same(ngram(5, 'ngram'), expected)
    t.end()
})

tap.test('ngram works with Unicode characters', t => {
    const expected = ['桜前', '前線']

    t.same(ngram(2, '桜前線'), expected)
    t.end()
})

tap.test('ngram fast check', assert => {
    const minLength = 6
    assert.doesNotThrow(() => {
        fc.assert(
            fc.property(
                fc.integer(1, minLength - 1),
                fc.oneof(
                    fc.string({minLength}),
                    fc.fullUnicodeString({minLength}),
                ),
                (
                    n: number,
                    word: string
                ) => {
                    assert.same(
                        ungram(ngram(n, word)),
                        word,
                    )
                }
            )
        )
    })
    assert.end()
})
