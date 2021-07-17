import tap from 'tap'

import { index } from './search'

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
