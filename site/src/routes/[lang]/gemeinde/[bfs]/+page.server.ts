// The records behind this municipality's rating. Loaded on the server only,
// so each prerendered page carries its own records and nothing else; the
// file exists only at export level 1.
import type { PageServerLoad } from './$types';

export interface Detail {
	domain: string;
	mx: string[];
	spf: string[];
	dmarc: string[];
	dmarc_at: string;
}

const files = import.meta.glob<Record<string, Detail[]>>('$lib/data/details.json', { eager: true, import: 'default' });
const details = Object.values(files)[0] ?? {};

export const load: PageServerLoad = ({ params }) => ({ details: details[params.bfs] ?? [] });
