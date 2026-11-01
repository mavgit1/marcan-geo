import { error } from '@sveltejs/kit';
import { langs } from '$lib/i18n';
import { data } from '$lib/data';
import type { EntryGenerator, PageLoad } from './$types';

// Only generated when the export includes municipalities (level 1).
export const entries: EntryGenerator = () =>
	langs.flatMap((lang) => (data.municipalities ?? []).map((m) => ({ lang, bfs: String(m.bfs) })));

export const load: PageLoad = ({ params }) => {
	const m = data.municipalities?.find((x) => String(x.bfs) === params.bfs);
	if (!m) error(404);
	return { m };
};
