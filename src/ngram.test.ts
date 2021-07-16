import tap from 'tap'
import {
    ngram,
    shingle,
    ungram,
} from '../src/ngram'

tap.test('shingle', t => {
    const expected = 'flower'

    t.same(shingle('flowe', 'lower'), expected)
    t.end()
})

tap.test('ungram', t => {
    const expected = 'ngram'

    t.same(ungram(['ngr', 'gra', 'ram']), expected)
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
