module.exports = {
    entryPoints: [
        'src/commonTypes.ts',
        'src/index.ts',
        'src/ngram.ts',
        'src/search.ts',
    ],
    out: 'docs',
    // hideGenerator: true,
    // highlightTheme: 'monokai',
    includeVersion: true,
    markdownItOptions: {
        baseUrl: 'https://peterhil.github.io/ngrammy/',
    },
    name: 'Ngrammy',
    readme: 'README.md',
    theme: 'default',
    // toc: [
    //     'Index',
    //     'ngram',
    //     'match',
    // ],
}
