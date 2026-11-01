<script lang="ts">
	import { base } from '$app/paths';
	import Map, { type Shape } from '$lib/Map.svelte';
	import StatusBar from '$lib/StatusBar.svelte';
	import RankedBars from '$lib/RankedBars.svelte';
	import ShareLegend from '$lib/ShareLegend.svelte';
	import Trend from '$lib/Trend.svelte';
	import { data as pub, latest, enforcing, known, STATUSES } from '$lib/data';
	import { shareVar, statusVar } from '$lib/colors';
	import { t, pct, date, cantonName } from '$lib/i18n';
	import { ISSUES, MARCAN } from '$lib/content';
	import cantonPaths from '$lib/geo/cantons.json';
	import geo from '$lib/geo/base.json';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));

	const now = latest(pub.national);
	const total = now.reduce((a, b) => a + b, 0);
	const share = enforcing(now);
	const scanDate = latest(pub.scans);
	const cantonByNr = new globalThis.Map(pub.cantons.map((c) => [String(c.nr), c]));
	const munis = pub.municipalities ?? [];
	const muniByBfs = new globalThis.Map(munis.map((m) => [String(m.bfs), m]));

	// Extremes for the intro, among cantons with enough municipalities to compare.
	const comparable = pub.cantons
		.filter((c) => known(latest(c.series)) >= 10)
		.sort((a, b) => enforcing(latest(b.series)) - enforcing(latest(a.series)));
	const top = comparable[0];
	const bottom = comparable[comparable.length - 1];

	// Table: share first after the name, so it stays visible on phones.
	const sorted = [...pub.cantons].sort((a, b) => enforcing(latest(b.series)) - enforcing(latest(a.series)));

	let hover: string | null = $state(null);

	const shapes: Shape[] = $derived.by(() => {
		if (data.muniPaths) {
			return munis.map((m) => ({
				id: String(m.bfs),
				d: data.muniPaths![String(m.bfs)] ?? '',
				fill: statusVar[m.status],
				title: `${m.name}: ${tr.status[m.status]}`,
				href: `${base}/${lang}/gemeinde/${m.bfs}/`
			}));
		}
		return pub.cantons.map((c) => {
			const s = enforcing(latest(c.series));
			return {
				id: String(c.nr),
				d: (cantonPaths as Record<string, string>)[String(c.nr)],
				fill: shareVar(s),
				title: `${cantonName(lang, c.code)}: ${pct(lang, s)} ${tr.enforcing.toLowerCase()}`,
				href: `${base}/${lang}/kanton/${c.code.toLowerCase()}/`
			};
		});
	});

	const labels = $derived(
		data.muniPaths
			? []
			: Object.entries(geo.labels as Record<string, number[]>).map(([nr, [x, y]]) => ({
					x,
					y,
					text: cantonByNr.get(nr)?.code ?? ''
				}))
	);

	const hovered = $derived.by(() => {
		if (!hover) return null;
		if (data.muniPaths) {
			const m = muniByBfs.get(hover);
			return m ? { title: `${m.name} (${m.canton})`, sub: `${tr.status[m.status]} · ${m.domains.map((d) => d.domain).join(', ')}` } : null;
		}
		const c = cantonByNr.get(hover);
		return c ? { title: cantonName(lang, c.code), counts: latest(c.series) } : null;
	});
</script>

<svelte:head>
	<title>{tr.site}</title>
	<meta name="description" content={tr.tagline} />
</svelte:head>

<header class="intro">
	<p class="kicker">{tr.kicker(date(lang, scanDate))}</p>
	<h1>{tr.title(share)}</h1>
	<p class="dek">
		{tr.dek(
			cantonName(lang, top.code),
			pct(lang, enforcing(latest(top.series))),
			cantonName(lang, bottom.code),
			pct(lang, enforcing(latest(bottom.series))),
			pct(lang, now[2] / known(now))
		)}
	</p>
</header>

<section class="national">
	<StatusBar counts={now} {lang} />
	<p class="small muted">{tr.headlineSub(known(now), total)}. {tr.unknownNote(now[4])}</p>
</section>

<section class="map-grid">
	<div>
		<p class="kicker">{data.muniPaths ? tr.mapTitle : tr.mapLocator}</p>
		<div class="map-box">
			<Map {shapes} {labels} label={tr.mapTitle} selected={hover} onhover={(id) => (hover = id)} />
		</div>
		<div class="under-map">
			{#if data.muniPaths}
				<ul class="status-key">
					{#each STATUSES as s}
						<li><span class="swatch {s}"></span>{tr.status[s]}</li>
					{/each}
				</ul>
			{:else}
				<ShareLegend {lang} title={tr.legendShare} average={share} averageLabel={tr.average(pct(lang, share))} />
			{/if}
			{#if hovered}
				<div class="card hover-card">
					<strong>{hovered.title}</strong>
					{#if 'counts' in hovered && hovered.counts}
						<p class="muted small">{pct(lang, enforcing(hovered.counts))} {tr.enforcing.toLowerCase()}</p>
						<StatusBar counts={hovered.counts} {lang} legend={false} />
					{:else if 'sub' in hovered}
						<p class="small">{hovered.sub}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<aside class="card about">
		<h2>{tr.aboutTitle}</h2>
		<p class="small">{tr.aboutBody(date(lang, scanDate), total)}</p>
		<p class="small">{tr.firstStep(now[2], pct(lang, now[2] / known(now)))} <a href="{base}/{lang}/guide/">{tr.howToImprove}</a></p>
		{#if !data.muniPaths}
			<p class="small muted">{tr.cantonDetailLater}</p>
		{/if}
		<p class="small">
			<a href="{base}/{lang}/method/">{tr.aboutMethod}</a> ·
			<a href={ISSUES} rel="noopener">{tr.footerCorrections}</a>
		</p>
		<p class="small muted">{tr.footerBuilt} <a href={MARCAN} rel="noopener">Marcan</a></p>
	</aside>
</section>

<section>
	<p class="kicker">{tr.byCanton}</p>
	<h2>{tr.rankTitle}</h2>
	<p class="small muted sub">{tr.rankSub}</p>
	<RankedBars cantons={pub.cantons} national={now} {lang} />
</section>


<section>
	<p class="kicker">{tr.trendTitle}</p>
	<h2>{tr.enforcing}</h2>
	<Trend series={pub.national} scans={pub.scans} {lang} />
</section>

<details class="table-view">
	<summary>{tr.tableView}</summary>
	<div class="table-scroll">
		<table>
			<thead>
				<tr>
					<th>{tr.canton}</th>
					<th class="num">{tr.enforcing}</th>
					<th class="num">{tr.municipalities}</th>
					{#each STATUSES as s}
						<th class="num"><span class="swatch {s}"></span><span class="sr-only">{tr.status[s]}</span></th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each sorted as c}
					{@const n = latest(c.series)}
					<tr>
						<td><a href="{base}/{lang}/kanton/{c.code.toLowerCase()}/">{cantonName(lang, c.code)}</a></td>
						<td class="num"><strong>{pct(lang, enforcing(n))}</strong></td>
						<td class="num">{n.reduce((a, b) => a + b, 0)}</td>
						{#each n as v}
							<td class="num">{v}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="small muted">{tr.scanOf(date(lang, scanDate))}</p>
</details>

<style>
	.intro {
		margin-bottom: 1.2rem;
	}
	.intro h1 {
		margin: 0.35rem 0 0.7rem;
	}
	.dek {
		margin: 0;
	}
	.national {
		max-width: 46rem;
	}
	section {
		margin: 2.4rem 0 1rem;
	}
	section h2 {
		margin: 0.25rem 0 0.3rem;
		font-family: var(--serif);
		font-size: 1.45rem;
	}
	.sub {
		margin: 0 0 0.9rem;
	}
	.kicker {
		margin: 0;
	}
	.map-grid {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(14rem, 1.2fr);
		gap: 2rem;
		align-items: start;
	}
	@media (max-width: 760px) {
		.map-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.map-box {
		margin-top: 0.5rem;
	}
	.under-map {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		align-items: flex-start;
		margin-top: 0.6rem;
	}
	.hover-card {
		min-width: 12rem;
		flex: 1;
	}
	.hover-card p {
		margin: 0.2rem 0 0.4rem;
	}
	.status-key {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1rem;
		font-size: 0.88rem;
	}
	.about h2 {
		font-size: 1.1rem;
		margin-top: 0;
	}
	.small {
		font-size: 0.88rem;
	}
	.table-view {
		margin: 2rem 0 1rem;
	}
	.table-view summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--accent);
	}
</style>
