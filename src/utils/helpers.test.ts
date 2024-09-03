import tap from 'tap'

import {
    ids,
    lengthFromPositions,
    match,
    nonEmpty,
} from './helpers'

tap.test('utils ids', assert => {
    assert.same(['a', 'b', 'c'], ids({a: [], b: [], c: []}))
    assert.same([], ids({}))
    assert.end()
})

tap.test('utils lengthFromPositions', assert => {
    assert.same(lengthFromPositions([]), 0)
    assert.same(lengthFromPositions([0]), 1)
    assert.same(lengthFromPositions([0, 1]), 2)
    assert.end()
})

tap.test('utils nonEmpty', assert => {
    assert.ok(nonEmpty({a: []}))
    assert.notOk(nonEmpty({}))
    assert.end()
})

tap.test('utils match', assert => {
    const d1 = {a: [0, 3], b: [1], c: [2, 4]}
    const d2 = {a: [1, 4], b: [2], c: [3, 5]}
    const d3 = {a: [2], b: [], c: [6]}

    assert.same(
        {a: [0, 3], b: [1], c: [2, 4]},
        match(d1, d2),
    )
    assert.same(
        {a: [0], b: [], c: [4]},
        match(d1, d3, 1),
    )
    assert.end()
})
