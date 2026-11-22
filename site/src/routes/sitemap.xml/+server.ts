// Every page in every language, with its language alternates.
import { data, latest } from '$lib/data';
import { langs } from '$lib/i18n';
import { SITE } from '$lib/site';

export const prerender = true;

export const GET = () => {
	const paths = ['', 'guide/', 'method/', ...data.cantons.map((c) => `kanton/${c.code.toLowerCase()}/`), ...(data.municipalities ?? []).map((m) => `gemeinde/${m.bfs}/`)];
	const lastmod = latest(data.scans);
	const urls = paths.flatMap((p) =>
		langs.map((l) => {
			const alt = langs.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${SITE}/${a}/${p}"/>`).join('');
			return `<url><loc>${SITE}/${l}/${p}</loc><lastmod>${lastmod}</lastmod>${alt}</url>`;
		})
	);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
	return new Response(xml, { headers: { 'content-type': 'application/xml' } });
};
