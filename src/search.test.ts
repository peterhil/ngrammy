import tap from 'tap'

import { Index } from './search'

tap.test('Index.normalise', assert => {
    const term = '  Data\t structures\n '
    const expected = 'data structures'

    assert.same(
        Index.normalise(term),
        expected,
    )
    assert.end()
})

tap.test('index data structure', assert => {
    const index = new Index(3)
    index.add('Alpha', 'a')

    assert.same(
        {
            alp: {a: 0},
            lph: {a: 1},
            pha: {a: 2},
        },
        index.all()
    )
    assert.end()
})

tap.test('index multiple items', assert => {
    const index = new Index(2)
    index.add('Alpha', 'a')
    index.add('Aleph', 'b')

    assert.same(
        {
            al: {a: 0, b: 0},
            ep: {b: 2},
            ha: {a: 3},
            le: {b: 1},
            lp: {a: 1},
            ph: {a: 2, b: 3},
        },
        index.all()
    )
    assert.end()
})

tap.test('index has term', assert => {
    const index = new Index(2)
    index.add('Alpha', 'a')
    index.add('Alpine', 'b')

    assert.doesNotThrow(() => {
        assert.ok(index.has('alpha'))
        assert.notOk(index.has('beta'), 'should not have beta')
        assert.notOk(index.has('halph'), 'should check the order of ngrams')
    })
    assert.end()
})
