import {
    complement,
    intersection,
    isEmpty,
    keys,
    map,
    propOr,
    subtract,
    zipObj,
} from 'rambdax'

import type {
    Description,
    Indexable,
    Position,
    StringDescription,
} from '../commonTypes'

export const empty: Description = Object.freeze({}) as Description

export const nil: Position[] = []

export const ids = (obj: object): Indexable[] => keys(obj)

/**
 * Rambda’s {@link https://selfrefactor.github.io/rambdax/#/?id=isempty|isEmpty} complemented (negated).
 * @returns true for non-empty things.
 */
export const nonEmpty = complement(isEmpty)

export function positionsAt (id: string, description: Description): Position[] {
    return propOr(nil, id, description as StringDescription)
}

/**
 * Compare two descriptions and return common ids and positions.
 * This is used to check if candidate ngrams continue to match at a later position.
 */
export function match (
    candidates: Description,
    match: Description,
    pos: Position = 0
): Description {
    const common = intersection(ids(candidates), ids(match)) as string[]
    const positions = map(
        (id) => {
            const init: Position[] = positionsAt(id, candidates)
            const next: Position[] = positionsAt(id, match)
            const subtracted: Position[] = map(n => subtract(n, pos + 1), next)

            return intersection(init, subtracted)
        },
        common
    )

    return zipObj(common, positions)
}
