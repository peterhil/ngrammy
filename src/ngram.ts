export function ngram(n: number, input: string) {
    let slices: string[] = []
    let index: number = 0

    for (index = 0; index < input.length - n + 1; index++) {
        slices.push(input.slice(index, index + n))
    }

    return slices
}
