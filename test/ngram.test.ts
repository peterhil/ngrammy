import tap from 'tap'
import { ngrams } from '../src'

tap.test('ngrams work with bigrams', t => {
    const expected = ['ng', 'gr', 'ra', 'am']

    t.same(ngrams(2, 'ngram'), expected)
    t.end()
})
