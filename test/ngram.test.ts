import { ngrams } from '../src'

describe('ngrams', () => {
    it('works with bigrams', () => {
        const expected = ['ng', 'gr', 'ra', 'am']
        expect(ngrams(2, 'ngram')).toEqual(expected)
    })
})
