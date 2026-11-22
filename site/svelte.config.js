import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ strict: true }),
		// GitHub Pages serves the project under /marcan-geo; the workflow sets it.
		paths: { base: process.env.BASE_PATH ?? '' },
		prerender: {
			handleHttpError: 'fail',
			handleMissingId: 'fail',
			// Municipality pages exist only at export level 1; any other
			// unseen route is a mistake.
			handleUnseenRoutes: ({ routes }) => {
				const unexpected = routes.filter((r) => r !== '/[lang]/gemeinde/[bfs]');
				if (unexpected.length) throw new Error(`routes not prerendered: ${unexpected.join(', ')}`);
			}
		},
		// GitHub Pages cannot send headers, so the policy goes into a meta tag
		// with hashes for SvelteKit's own inline scripts. No external origins.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				// Plus the one fixed style attribute of SvelteKit's screen-reader
				// route announcer (generated root.svelte), allowed by its hash only.
				'style-src': ['self', 'unsafe-hashes', 'sha256-S8qMpvofolR8Mpjy4kQvEm7m1q8clzU4dfDH0AmvZjo='],
				'img-src': ['self', 'data:'],
				'font-src': ['self'],
				'connect-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['none']
			}
		}
	}
};

export default config;
