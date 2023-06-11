/* eslint-env node */
import { getConfig } from '@shgysk8zer0/js-utils/rollup';

export default getConfig('./all.js', {
	sourcemap: true,
	minify: true,
	format: 'iife',
});
