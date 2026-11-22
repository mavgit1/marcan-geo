import { SITE } from '$lib/site';

export const prerender = true;

export const GET = () =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { 'content-type': 'text/plain' } });
