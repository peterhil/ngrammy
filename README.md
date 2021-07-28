<span><img alt="ci status" src="https://github.com/peterhil/ngrammy/workflows/CI/badge.svg"></span>
<span><img alt="docs status" src="https://github.com/peterhil/ngrammy/workflows/Docs/badge.svg"></span>
<span><img alt="size status" src="https://github.com/peterhil/ngrammy/workflows/size/badge.svg"></span>

# Ngrammy

Ngrammy is an Unicode capable [n-gram] based [search index] library
for writing custom [autocompletions]. It is a small (< 10kb)
Typescript library with full test coverage and
[Rambda](https://selfrefactor.github.io/rambda/#/) as the only
dependency.

## Documentation

See library [documentation] and especially:

* [Index class]
* [ngrams module]

## Example usage

I wrote this library for making a fast category search with
autocomplete for my browser extension called
[Spellbook](https://github.com/peterhil/spellbook) so here is a
related example:

```javascript
import ngrammy from 'ngrammy'
import { flatten, pick, pipe, values } from 'rambda'
import { writable } from 'svelte/store'
import { flattenTree } from '../api/categories'
import { isCategory } from '../api/helpers'

const allCategories = writable({})

// 1. Create an index of bigrams with newline as the sentinel
//
// The default normalisation function (3rd parameter) will collapse
// all whitespace into single space characters, so newline is a
// safe (and default) choice for sentinel.
const index = new ngrammy.Index(2, '\n')

function prepareIndex () {
    if (index.size() > 0) {
        console.debug('index exists already')
    } else {
        console.debug('preparing index')
        browser.bookmarks.getTree().then((bookmarks) => {
            const filterCategories = pipe(flattenTree, filter(isCategory))
            const categories = filterCategories(bookmarks)

            // 2. Add terms to index
            for (category of categories) {
                index.add(category.title, category.id)
                allCategories[category.id] = category
            }
        })
    }
}

function categorySearch (query) {
    // 3. Search the index (index.locations would also return positions)
    const ids = index.search(query)

    const result = pick(ids, allCategories) // allCategories is an object
    const sorted = sortByTitleCaseInsensitive(values(result))

    return sorted
}
```

See [search tests](src/search.test.ts) for more examples. Especially
tests for [search](src/search.test.ts#L201) and
[locations](src/search.test.ts#L252) are instructive.

## Installation

Install Ngrammy with:

```
pnpm install ngrammy
```

There are various other scripts for development:

```
pnpm dev      # watch sources
pnpm build    # build project
pnpm test     # run tests with tap
pnpm coverage -- --browser  # generate code coverage report
pnpm doc      # generate documentation
pnpm lint     # run eslint
pnpm analyze  # run size-limit --why
pnpm size     # run size-limit
```

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
