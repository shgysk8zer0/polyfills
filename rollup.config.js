import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const nr = nodeResolve();
const t = terser();
const cjs = commonjs();

export default [{
	input: 'assets/dedent.cjs',
	plugins: [nr, cjs],
	output: [{
		file: 'assets/dedent.js',
		format: 'esm',
	}]
}, {
	input: 'assets/url-pattern.cjs',
	plugins: [nr, cjs],
	output: [{
		file: 'assets/url-pattern.js',
		format: 'esm',
	}]
}, {
	// Browser bundle
	input: 'browser.js',
	plugins: [nr],
	output: [{
		file: 'browser.min.js',
		format: 'iife',
		plugins: [t],
		sourcemap: true,
	}, {
		file: 'all.min.js',
		format: 'iife',
		plugins: [t],
		sourcemap: true,
	}],
}, {
	// Node.js bundles
	input: 'node.js',
	plugins: [nr],
	output: [{
		file: 'node.min.js',
		format: 'iife',
		plugins: [t],
		sourcemap: true,
	}, {
		file: 'node.cjs',
		format: 'cjs',
		plugins: [t],
	}],
}];
