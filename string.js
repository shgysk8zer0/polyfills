import dedent from './assets/dedent.js';

if (! (String.dedent instanceof Function)) {
	String.dedent = dedent;
}
