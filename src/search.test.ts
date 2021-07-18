import tap from 'tap'

import { Index } from './search'

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
