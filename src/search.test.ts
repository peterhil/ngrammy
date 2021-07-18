import tap from 'tap'

import { Index, index } from './search'

tap.test('index data structure with single item', assert => {
    assert.same(
        {
            alp: 0,
            lph: 1,
            pha: 2,
        },
        index(['alpha'], 3),
    )
    assert.end()
})

tap.test('index class add', assert => {
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
