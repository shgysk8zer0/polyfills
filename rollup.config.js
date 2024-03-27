/* eslint-env node */
import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import nodeResolve from '@rollup/plugin-node-resolve';


export default getConfig('./all.js', {
	sourcemap: true,
	minify: true,
	format: 'iife',
	plugins: [nodeResolve()],
});
