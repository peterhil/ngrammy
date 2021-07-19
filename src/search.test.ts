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
