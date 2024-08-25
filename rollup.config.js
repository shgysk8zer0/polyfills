import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [{
	input: 'assets/dedent.cjs',
	plugins: [nodeResolve(), commonjs()],
	output: [{
		file: 'assets/dedent.js',
		format: 'esm',
	}]
}, {
	input: 'assets/url-pattern.cjs',
	plugins: [nodeResolve(), commonjs()],
	output: [{
		file: 'assets/url-pattern.js',
		format: 'esm',
	}]
}, {
	// Browser bundle
	input: 'all.js',
	plugins: [nodeResolve()],
	output: [{
		file: 'all.min.js',
		format: 'iife',
		plugins: [terser()],
		sourcemap: true,
	}],
}, {
	// Node.js bundles
	input: 'node.js',
	plugins: [nodeResolve()],
	output: [{
		file: 'node.min.js',
		format: 'iife',
		plugins: [terser()],
		sourcemap: true,
	}],
}];
