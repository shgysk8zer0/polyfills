import { ignoreFile } from '@shgysk8zer0/eslint-config/ignoreFile.js';
import browser from '@shgysk8zer0/eslint-config/browser.js';

export default [
	ignoreFile,
	browser({
		ignores: ['**/*.min.js', '**/*.cjs', 'assets/dedent.js','assets/url-pattern.js'],
	}),
];
