import type { Handle } from '@sveltejs/kit';
import { isLang } from '$lib/i18n';

// Sets <html lang> per language route at prerender time.
export const handle: Handle = ({ event, resolve }) => {
	const lang = event.params.lang;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang && isLang(lang) ? lang : 'de')
	});
};
