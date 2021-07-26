import { match, positionsAt } from './utils';
import { denormalise } from './testUtils';
declare const _default: {
    denormalise: typeof denormalise;
    ids: (obj: Object) => (string | number | symbol)[];
    match: typeof match;
    nonEmpty: <T>(x: T) => boolean;
    positionsAt: typeof positionsAt;
};
export default _default;
