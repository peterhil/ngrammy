import { Description, Indexable, Ngram, Term } from './commonTypes';
export declare class Index {
    private terms;
    private readonly _normalise;
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
    private _ends;
    private _get;
    private _getMany;
    private _checkTermLength;
    private _set;
    private _insert;
}
