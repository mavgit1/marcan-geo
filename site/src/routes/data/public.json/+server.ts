// The published data file, downloadable as is.
import { data } from '$lib/data';

export const prerender = true;

export const GET = () => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
