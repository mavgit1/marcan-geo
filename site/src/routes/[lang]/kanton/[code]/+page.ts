import { error } from '@sveltejs/kit';
import { langs } from '$lib/i18n';
import { data, cantonByCode } from '$lib/data';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	langs.flatMap((lang) => data.cantons.map((c) => ({ lang, code: c.code.toLowerCase() })));

export const load: PageLoad = async ({ params }) => {
	const canton = cantonByCode(params.code);
	if (!canton) error(404);
	return {
		canton,
		muniPaths:
			data.level >= 1 ? ((await import('$lib/geo/municipalities.json')).default as Record<string, string>) : null
	};
};
