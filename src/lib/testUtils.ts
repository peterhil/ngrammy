import { intersperse } from 'rambda'

const whitespace = [
    '\u0009', // tab
    '\u000a', // line feed
    '\u000b', // line tabulation
    '\u000c', // form feed
    '\u000d', // carriage return
    '\u0020', // space
    '\u0085', // next line (NEL) Note: \s on regexps does not include this
    '\u00a0', // no break space
    '\u1680', // ogham space mark
    '\u2000', // en quad
    '\u2001', // em quad
    '\u2002', // en space
    '\u2003', // em space
    '\u2004', // three-per-em space
    '\u2005', // four-per-em space
    '\u2006', // six-per-em space
    '\u2007', // figure space
    '\u2008', // punctuation space
    '\u2009', // thin space
    '\u200a', // hair space
    '\u2028', // line separator
    '\u2029', // paragraph separator
    '\u202f', // narrow no-break space
    '\u205f', // medium mathematical space
    '\u3000', // ideographic space
]

function randomWhitespaceChar(): string {
    const idx = Math.floor(Math.random() * whitespace.length)
    return whitespace[idx]
}

export function denormalise(words: string): string {
    return intersperse(
        randomWhitespaceChar(),
        words.split(' ')
    ).join('')
}
