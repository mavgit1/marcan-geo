import { data } from '$lib/data';
import { langs } from '$lib/i18n';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

// Municipality shapes are only fetched when the export includes municipalities.
export const load: PageLoad = async () => ({
	muniPaths:
		data.level >= 1 ? ((await import('$lib/geo/municipalities.json')).default as Record<string, string>) : null
});
