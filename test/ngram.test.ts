import assert from 'assert'
import { ngrams } from '../src'

describe('ngrams', () => {
    it('works with bigrams', () => {
        const expected = ['ng', 'gr', 'ra', 'am']
        assert.deepStrictEqual(ngrams(2, 'ngram'), expected)
    })
})
