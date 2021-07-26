import tap from 'tap'

import { match } from './utils'

tap.test('match', assert => {
    const d1 = {a: [0, 3], b: [1], c: [2, 4]}
    const d2 = {a: [1, 4], b: [2], c: [3, 5]}
    const d3 = {a: [2], b: [], c: [6]}

    assert.same({a: [0, 3], b: [1], c: [2, 4]},
                match(d1, d2, 0))
    assert.same({a: [0], b: [], c: [4]},
                match(d1, d3, 1))
    assert.end()
})
