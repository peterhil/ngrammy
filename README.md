# Ngrammy

Ngrammy is a [n-gram] based [search index] library for writing custom
[autocompletions]. Ngrammy is written in Typescript, fully tested and
Unicode capable!

## Installation

Install Ngrammy with:

    pnpm install ngrammy

There are various other scripts for development:

    pnpm run dev      # watch sources
    pnpm run build    # build project
    pnpm run test     # run tests with tap
    pnpm run coverage -- --browser  # generate code coverage report
    pnpm run doc      # generate documentation
    pnpm run lint     # run eslint
    pnpm run analyze  # run size-limit --why
    pnpm run size     # run size-limit

## Documentation

See library [documentation] and especially:

* [Index class]
* [ngrams module]

## Rationale and features

Many [libraries for ngrams] only support Basic Latin (ASCII) character
set — Ngrammy on the other hand:

### Has full Unicode support

* supports full Unicode character set
* considers accented characters to be different from unaccented characters
* is tested with Quickcheck style [fast-check] using [Node Tap]

### Collapses and trims all whitespace when doing normalisation of search terms

Ngrammy supports all [Unicode whitespace characters] when doing
normalisation, including [EBCDIC New Line] which gets mapped to
Unicode as `\x0085` ([NEL]), and has caused considerable [trouble with
XML] parsing.

### Allows custom normalisation function and sentinels

See [Index class] constructor documentation.

**Possible use cases for customisations:**

* Index only terms that match some regexp from a larger text
* Support multiline search terms (use a different sentinel than the default)
* Index binary data

[Index class]: https://peterhil.github.io/ngrammy/classes/search.Index.html
[documentation]: https://peterhil.github.io/ngrammy/
[ngrams module]: https://peterhil.github.io/ngrammy/modules/ngram.html

[EBCDIC New Line]: https://en.wikipedia.org/wiki/EBCDIC#NL
[NEL]: https://en.wikipedia.org/wiki/Newline#Unicode
[Unicode whitespace characters]: https://en.wikipedia.org/wiki/Whitespace_character#Unicode
[autocompletions]: https://en.wikipedia.org/wiki/Autocomplete
[n-gram]: https://en.wikipedia.org/wiki/N-gram
[search index]: https://en.wikipedia.org/wiki/Search_engine_indexing#Index_data_structures
[trouble with XML]: https://www.w3.org/TR/newline/

[Node Tap]: https://node-tap.org/
[fast-check]: https://dubzzz.github.io/fast-check.github.com/
[libraries for ngrams]: https://www.npmjs.com/search?q=ngram
