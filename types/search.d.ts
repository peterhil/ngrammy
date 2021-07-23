declare type EmptyDescription = {};
declare type NormalisedString = string;
declare type Position = number;
declare type Query = string;
declare type Indexable = string | number | symbol;
declare type Ngram = NormalisedString;
declare type Term = NormalisedString;
declare type Description = Map<Indexable, Position[]> | EmptyDescription;
declare type NgramIndex = Map<Ngram, Description>;
export declare class Index {
    private terms;
    readonly _normalise: Function;
    readonly n: number;
    readonly sentinel: string;
    constructor(n?: number, sentinel?: string, normalise?: Function);
    static normalise(term: Query): Ngram;
    add(term: Query, key?: Indexable): void;
    all(): Object;
    has(term: Query): boolean;
    normalise(term: Query): Term;
    lengths(): Description;
    locations(term: Query): Description;
    search(term: Query): Indexable[];
    size(): number;
    _ends(): import("rambda").Dictionary<any>;
    _get(ngram: Ngram): Description;
    _getMany(ngrams: Ngram[]): Description[];
    _set(ngram: Ngram, value: Description): NgramIndex;
    _insert(ngram: Ngram, id: Indexable, pos: Position): NgramIndex;
}
export {};
