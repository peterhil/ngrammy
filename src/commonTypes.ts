export type EmptyDescription = {}

export type Ngram = string
export type Position = number
export type Term = string

export type Indexable = string | number | symbol

export type Description = Map<Indexable, Position[]> | EmptyDescription
export type StringDescription = Record<string, Position[]>
export type NgramIndex = Map<Ngram, Description>
