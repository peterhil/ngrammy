// Iterable helpers

// Invert an iterable’s properties and values
export function invert(iter) {
    const inverted = {}
    // const keys = keys(obj)

    for (let key in iter) {
        inverted[iter[key]] = key
    }

    return inverted
}
