/* eslint-env node */
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'all.js',
	output: {
		file: 'all.min.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		terser(),
	],
};
