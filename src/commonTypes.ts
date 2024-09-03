export type EmptyDescription = {}

export type Ngram = string
export type Position = number
export type Term = string

export type NormaliseFunction = (term: Term) => Ngram

export type Indexable = string | number | symbol

export type Terms = Term[] | Record<Indexable, Term>
export type Description = Record<Indexable, Position[]> | EmptyDescription
export type StringDescription = Record<string, Position[]>
export type NgramIndex = Record<Ngram, Description>
