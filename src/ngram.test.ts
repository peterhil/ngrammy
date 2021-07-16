import tap from 'tap'
import { ngram } from '../src/ngram'

tap.test('ngram work with bigrams', t => {
    const expected = ['ng', 'gr', 'ra', 'am']

    t.same(ngram(2, 'ngram'), expected)
    t.end()
})

tap.test('ngram work with trigrams', t => {
    const expected = ['ngr', 'gra', 'ram']

    t.same(ngram(3, 'ngram'), expected)
    t.end()
})

tap.test('ngram work when n is same as word length', t => {
    const expected = ['ngram']

    t.same(ngram(5, 'ngram'), expected)
    t.end()
})
