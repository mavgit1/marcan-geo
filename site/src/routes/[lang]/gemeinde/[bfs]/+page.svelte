<script lang="ts">
	import { base } from '$app/paths';
	import { data as pub, cantonByCode } from '$lib/data';
	import { t, date } from '$lib/i18n';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));
	const m = $derived(data.m);
	const canton = $derived(cantonByCode(m.canton));
</script>

<svelte:head>
	<title>{m.name} · {tr.site}</title>
</svelte:head>

<p><a href="{base}/{lang}/kanton/{m.canton.toLowerCase()}/">← {canton?.name ?? m.canton}</a></p>
<h1>{m.name}</h1>

<p class="status"><span class="swatch {m.status}"></span>{tr.status[m.status]}</p>

<dl>
	<dt>{tr.policy}</dt>
	<dd><code>{m.policy || tr.noRecord}</code></dd>
	<dt>{tr.spf}</dt>
	<dd>{tr.spfValues[m.spf] ?? m.spf}</dd>
</dl>

<h2>{tr.history}</h2>
<ol class="history">
	{#each m.history as [i, s]}
		<li><span class="swatch {s}"></span>{date(lang, pub.scans[i])}: {tr.status[s]}</li>
	{/each}
</ol>

<p><a href="{base}/{lang}/guide/#{m.status}">{tr.howToImprove} →</a></p>

<style>
	.status {
		font-size: 1.3rem;
		font-weight: 600;
	}
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.4rem 1.2rem;
	}
	dt {
		color: var(--muted);
	}
	dd {
		margin: 0;
	}
	.history {
		list-style: none;
		padding: 0;
	}
</style>
