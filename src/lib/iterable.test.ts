import tap from 'tap'

import { invert } from './iterable'

tap.test('invert works with an object', assert => {
    const expected = {a: 0, b: 1, c: 2}

    assert.same(
        invert({0: 'a', 1: 'b', 2: 'c'}),
        expected,
    )
    assert.end()
})

tap.test('invert works with an array', assert => {
    const expected = {a: 0, b: 1, c: 2}

    assert.same(
        invert(['a', 'b', 'c']),
        expected,
    )
    assert.end()
})
