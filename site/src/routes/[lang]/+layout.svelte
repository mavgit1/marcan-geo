<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { langs, langNames, t } from '$lib/i18n';
	import { data as pub, latest } from '$lib/data';
	import { date } from '$lib/i18n';
	import { SITE } from '$lib/site';

	let { data, children } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));

	// Same page in another language.
	const switchTo = (l: string) => page.url.pathname.replace(`${base}/${lang}/`, `${base}/${l}/`);
	const here = (p: string) => page.url.pathname === `${base}/${lang}/${p}`;
	// The byline names Marcan once; that word becomes the link.
	const byline = $derived(tr.footerBuilt.split(/Marcan(.*)/s));
	// This page's path below the language, for canonical and alternate links.
	const rest = $derived(page.url.pathname.slice(`${base}/${lang}/`.length));
	const ogLocale = { de: 'de_CH', fr: 'fr_CH', it: 'it_CH', en: 'en_GB' };
</script>

<svelte:head>
	<link rel="canonical" href="{SITE}/{lang}/{rest}" />
	{#each langs as l}
		<link rel="alternate" hreflang={l} href="{SITE}/{l}/{rest}" />
	{/each}
	<link rel="alternate" hreflang="x-default" href="{SITE}/de/{rest}" />
	<meta property="og:site_name" content={tr.site} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={ogLocale[lang]} />
	<meta property="og:url" content="{SITE}/{lang}/{rest}" />
</svelte:head>

<header class="top">
	<div class="wrap bar">
		<a class="brand" href="{base}/{lang}/">{tr.site}</a>
		<nav aria-label={tr.nav.overview}>
			<a href="{base}/{lang}/" aria-current={here('') ? 'page' : undefined}>{tr.nav.overview}</a>
			<a href="{base}/{lang}/guide/" aria-current={here('guide/') ? 'page' : undefined}>{tr.nav.guide}</a>
			<a href="{base}/{lang}/method/" aria-current={here('method/') ? 'page' : undefined}>{tr.nav.method}</a>
		</nav>
		<ul class="langs">
			{#each langs as l}
				<li><a href={switchTo(l)} hreflang={l} lang={l} aria-current={l === lang ? 'true' : undefined} title={langNames[l]}>{l.toUpperCase()}</a></li>
			{/each}
		</ul>
	</div>
</header>

<main class="wrap">
	{@render children()}
</main>

<footer class="wrap foot muted">
	<p>{tr.scanOf(date(lang, latest(pub.scans)))} · {tr.footerData}</p>
	<p>{byline[0]}<a href="https://marcan.kaitiaki.tech/" rel="noopener">Marcan</a>{byline[1]}</p>
	<p>
		<a href="{base}/{lang}/method/">{tr.nav.method}</a> ·
		<a href="https://github.com/mavgit1/marcan-geo" rel="noopener">Code</a> ·
		<a href="{base}/{lang}/method/#corrections">{tr.footerCorrections}</a>
	</p>
</footer>

<style>
	.top {
		border-bottom: 1px solid var(--line);
		margin-bottom: 1.5rem;
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.5rem;
		padding-top: 0.8rem;
		padding-bottom: 0.8rem;
	}
	.brand {
		font-weight: 700;
		color: var(--fg);
		text-decoration: none;
		margin-right: auto;
	}
	nav {
		display: flex;
		gap: 1.1rem;
	}
	nav a,
	.langs a {
		color: var(--muted);
		text-decoration: none;
	}
	nav a[aria-current],
	.langs a[aria-current] {
		color: var(--fg);
		font-weight: 600;
	}
	nav a:hover,
	.langs a:hover {
		color: var(--fg);
	}
	.langs {
		list-style: none;
		display: flex;
		gap: 0.6rem;
		padding: 0;
		margin: 0;
		font-size: 0.9rem;
	}
	.foot {
		border-top: 1px solid var(--line);
		margin-top: 3rem;
		padding-top: 1rem;
		padding-bottom: 2rem;
		font-size: 0.88rem;
	}
	.foot p {
		margin: 0.3rem 0;
		max-width: none;
	}
</style>
