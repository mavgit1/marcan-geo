<script lang="ts">
	import Meta from '$lib/Meta.svelte';
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
	// Status at every scan: history lists only the changes.
	const statusAt = (i: number) => m.history.filter(([at]) => at <= i).at(-1)?.[1];
	// Lower is better; unknown is not compared.
	const RANK: Record<string, number> = { blocked: 0, filtered: 1, monitoring: 2, none: 3 };
	const change = (i: number) => {
		const [a, b] = [statusAt(i - 1), statusAt(i)];
		if (i === 0 || !a || !b || !(a in RANK) || !(b in RANK) || a === b) return '';
		return RANK[b] < RANK[a] ? tr.better : tr.worse;
	};
	// Mail servers as host names, without priority and trailing dot.
	const mxText = (mx: string[]) =>
		mx.length === 1 && mx[0].trim().startsWith('0 .')
			? tr.nullMx
			: mx.map((r) => r.split(' ').pop()!.replace(/\.$/, '')).join(', ') || tr.noMx;
	// The domain that decides the rating, if exactly one has the final status.
	const deciding = $derived(m.domains.filter((d) => d.status === m.status).length === 1 ? m.domains.find((d) => d.status === m.status) : undefined);
</script>

<Meta title="{m.name}: {tr.status[m.status]} · {tr.site}" description="{mail ? tr.sendsFrom(m.name, mail.domain) : ''} {tr.status[m.status]}. {tr.explain[m.status]}" />

<div class="text">
	<p><a href="{base}/{lang}/kanton/{m.canton.toLowerCase()}/">← {cantonName(lang, m.canton)}</a></p>
	<p class="kicker">{tr.municipality} · {tr.scanOf(date(lang, latest(pub.scans)))}</p>
	<h1>{m.name}</h1>

	<p class="status"><span class="swatch {m.status}"></span>{tr.status[m.status]}</p>
	{#if others.length && deciding}
		<p class="decides">{tr.deciding}: <code>{deciding.domain}</code></p>
	{/if}

	{#if mail}
		<p class="lead">
			{tr.sendsFrom(m.name, mail.domain)}
			{#if mail.status === 'none' && mail.policy === 'p=none'}
				{tr.noRua}
			{:else}
				{#if mail.policy}<code>{mail.policy}</code>:{/if}
				{tr.explain[mail.status]}
			{/if}
		</p>
		{#if mail.inherited}
			<p class="muted">{tr.inherited(mail.inherited)}</p>
		{/if}
	{:else}
		<p class="lead">{tr.explain.unknown}</p>
	{/if}

	<h2 class="chart-title">{tr.history}</h2>
	<ol class="timeline">
		{#each pub.scans as scan, i}
			{@const s = statusAt(i)}
			{#if s}
				<li>
					<span class="when">{date(lang, scan)}</span>
					<span><span class="swatch {s}"></span>{tr.status[s]}</span>
					{#if change(i)}<span class="chg" class:up={change(i) === tr.better}>{change(i)}</span>{/if}
				</li>
			{/if}
		{/each}
	</ol>

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
		{#each data.details as d}
			<dl class="rec">
				<dt class="dom">{d.domain}</dt>
				<dd class="dom"></dd>
				<dt>DMARC</dt>
				<dd>
					{d.dmarc.join(' ') || tr.noRecord}
					{#if d.dmarc.length && d.dmarc_at !== `_dmarc.${d.domain}`}<span class="muted">({tr.inheritedFrom} {d.dmarc_at.slice(7)})</span>{/if}
				</dd>
				<dt>MX</dt>
				<dd>{mxText(d.mx)}</dd>
				<dt>SPF</dt>
				<dd>{d.spf.join(' ') || tr.noRecord}</dd>
			</dl>
		{/each}
		<p class="note">{tr.queried(date(lang, latest(pub.scans)))} {tr.dkimNote}</p>
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
	.decides {
		font-size: 0.94rem;
		color: var(--muted);
		margin: -0.3rem 0 0.6rem;
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
	.rec {
		grid-template-columns: 3.5rem 1fr;
		gap: 0.15rem 0.8rem;
		margin: 1rem 0 0;
	}
	.rec dd {
		font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
		font-size: 0.82rem;
		overflow-wrap: anywhere;
	}
	.rec dt.dom {
		grid-column: 1 / -1;
		color: var(--fg);
		font-weight: 650;
	}
	.rec dd.dom {
		display: none;
	}
	.rec .muted {
		font-family: inherit;
	}
	.timeline {
		list-style: none;
		padding: 0;
		margin: 0 0 1.6rem;
	}
	.timeline li {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1rem;
		padding: 0.3rem 0;
		border-bottom: 1px solid var(--line);
	}
	.when {
		min-width: 11rem;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.chg {
		font-size: 0.85rem;
		color: var(--muted);
	}
	.chg.up {
		color: var(--fg);
		font-weight: 650;
	}
	.note {
		font-size: 0.85rem;
		color: var(--muted);
		margin: 0.8rem 0 0;
	}
	.small {
		font-size: 0.85rem;
	}
	dd {
		margin: 0;
	}
</style>
