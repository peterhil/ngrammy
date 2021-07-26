import { Description, Indexable, Ngram, NgramIndex, Position, Term } from './types';
export declare class Index {
    private terms;
    readonly _normalise: Function;
    readonly n: number;
    readonly sentinel: string;
    constructor(n?: number, sentinel?: string, normalise?: Function);
    static normalise(term: Term): Ngram;
    add(term: Term, key?: Indexable): void;
    all(): Object;
    has(term: Term): boolean;
    normalise(term: Term): Term;
    lengths(): Description;
    locations(term: Term): Description;
    search(term: Term): Indexable[];
    size(): number;
    _ends(): import("rambda").Dictionary<any>;
    _get(ngram: Ngram): Description;
    _getMany(ngrams: Ngram[]): Description[];
    _checkTermLength(term: Term): Term;
    _set(ngram: Ngram, value: Description): NgramIndex;
    _insert(ngram: Ngram, id: Indexable, pos: Position): NgramIndex;
}
