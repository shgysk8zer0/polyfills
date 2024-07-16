import dedent from './node_modules/string-dedent/dist/dedent.mjs';

if (! (String.dedent instanceof Function)) {
	String.dedent = dedent;
}
