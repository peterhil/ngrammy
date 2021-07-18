import tap from 'tap'

import { Index } from './search'

tap.test('index data structure', assert => {
    const index = new Index(3)
    index.add('alpha', 'a')

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
    index.add('alpha', 'a')
    index.add('aleph', 'b')

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
