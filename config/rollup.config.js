import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

import { ROLLUP_GLOBALS } from './rollup.globals';

export default {
    external: Object.keys(ROLLUP_GLOBALS),
    plugins: [resolve(), sourcemaps()],
    onwarn: () => { return },
    output: {
        format: 'umd',
        name: 'scomith.ng-jwt-auth',
        globals: ROLLUP_GLOBALS,
        sourcemap: true,
        exports: 'named'
    }
}
