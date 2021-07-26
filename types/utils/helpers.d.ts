import { Description, Indexable, Position } from '../commonTypes';
export declare const ids: (obj: Object) => Indexable[];
export declare const nonEmpty: <T>(x: T) => boolean;
export declare function positionsAt(id: string, description: Description): Position[];
export declare function match(candidates: Description, match: Description, pos?: Position): Description;
