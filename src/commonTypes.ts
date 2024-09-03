export interface Dictionary<T> {[index: string]: T}

export type Ngram = string
export type Position = number
export type Term = string

export type NormaliseFunction = (term: Term) => Ngram

export type Indexable = string | number | symbol

export type Description = Record<Indexable, Position[]>
export type Positions = Dictionary<Position>
export type Locations = Dictionary<Position[]>
export type StringDescription = Record<string, Position[]>
export type Terms = Term[] | Record<Indexable, Term>

export type NgramIndex = Record<Ngram, Description>
