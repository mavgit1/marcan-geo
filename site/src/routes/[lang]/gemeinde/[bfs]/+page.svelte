<script lang="ts">
	import { base } from '$app/paths';
	import { data as pub, latest, enforcing, cantonByCode } from '$lib/data';
	import { t, date, pct, cantonName } from '$lib/i18n';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));
	const m = $derived(data.m);
	const canton = $derived(cantonByCode(m.canton));
	const mail = $derived(m.domains[0]);
	const others = $derived(m.domains.slice(1));
</script>

<svelte:head>
	<title>{m.name} · {tr.site}</title>
</svelte:head>

<div class="text">
	<p><a href="{base}/{lang}/kanton/{m.canton.toLowerCase()}/">← {cantonName(lang, m.canton)}</a></p>
	<p class="kicker">{tr.municipality} · {tr.scanOf(date(lang, latest(pub.scans)))}</p>
	<h1>{m.name}</h1>

	<p class="status"><span class="swatch {m.status}"></span>{tr.status[m.status]}</p>

	{#if mail}
		<p class="lead">
			{tr.sendsFrom(m.name, mail.domain)}
			{#if mail.policy}<code>{mail.policy}</code>:{/if}
			{tr.explain[mail.status]}
		</p>
	{:else}
		<p class="lead">{tr.explain.unknown}</p>
	{/if}

	{#if others.length}
		<h2 class="chart-title">{tr.otherDomains}</h2>
		<ul class="domains">
			{#each others as d}
				<li>
					<code>{d.domain}</code>
					<span class="muted"><span class="swatch {d.status}"></span>{tr.status[d.status]}{#if d.policy}{' · '}<code>{d.policy}</code>{/if}</span>
				</li>
			{/each}
		</ul>
		<p class="source">{tr.weakestNote}</p>
	{/if}

	{#if canton}
		<p class="context">
			<a href="{base}/{lang}/kanton/{m.canton.toLowerCase()}/">{tr.cantonContext(cantonName(lang, m.canton), pct(lang, enforcing(latest(canton.series))))}</a>
		</p>
	{/if}

	<p><a href="{base}/{lang}/guide/#{m.status}">{tr.howToImprove} →</a></p>

	<details>
		<summary>{tr.techDetails}</summary>
		<dl>
			<dt>{tr.spf}</dt>
			<dd>{tr.spfValues[m.spf] ?? m.spf}</dd>
			<dt>{tr.history}</dt>
			<dd>
				{#each m.history as [i, s]}
					<div><span class="swatch {s}"></span>{date(lang, pub.scans[i])}: {tr.status[s]}</div>
				{/each}
			</dd>
		</dl>
	</details>
</div>

<style>
	.status {
		font-size: 1.15rem;
		font-weight: 650;
		margin: 0.2rem 0 0.6rem;
	}
	.lead {
		font-family: var(--serif);
		font-size: 1.15rem;
		line-height: 1.5;
	}
	.domains {
		list-style: none;
		padding: 0;
		margin: 0.4rem 0 0;
	}
	.domains li {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1rem;
		padding: 0.35rem 0;
		border-bottom: 1px solid var(--line);
	}
	.context {
		margin-top: 1.6rem;
	}
	details {
		margin-top: 2rem;
		font-size: 0.94rem;
	}
	summary {
		cursor: pointer;
		color: var(--muted);
	}
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.4rem 1.2rem;
		margin-top: 0.8rem;
	}
	dt {
		color: var(--muted);
	}
	dd {
		margin: 0;
	}
</style>
