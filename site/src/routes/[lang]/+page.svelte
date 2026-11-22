<script lang="ts">
	import { base } from '$app/paths';
	import Map, { type Shape } from '$lib/Map.svelte';
	import StatusBar from '$lib/StatusBar.svelte';
	import RankedBars from '$lib/RankedBars.svelte';
	import ShareLegend from '$lib/ShareLegend.svelte';
	import Trend from '$lib/Trend.svelte';
	import { data as pub, latest, enforcing, known, STATUSES } from '$lib/data';
	import { shareVar, statusVar } from '$lib/colors';
	import { t, pct, pctText, date, cantonName } from '$lib/i18n';
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

	// Change since the first scan, from each municipality's status history.
	const RANK = { blocked: 0, filtered: 1, monitoring: 2, none: 3, unknown: -1 } as const;
	const change = munis.reduce(
		(acc, m) => {
			const [first, was] = m.history[0] ?? [];
			if (first !== 0 || RANK[was] < 0 || RANK[m.status] < 0) return acc;
			if (RANK[m.status] < RANK[was]) acc.up++;
			if (RANK[m.status] > RANK[was]) acc.down++;
			return acc;
		},
		{ up: 0, down: 0 }
	);

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

	// One caption line under the map, so hovering never moves the layout.
	const caption = $derived.by(() => {
		if (!hover) return '';
		if (data.muniPaths) {
			const m = muniByBfs.get(hover);
			return m ? `${m.name} (${m.canton}) · ${tr.status[m.status]} · ${m.domains.map((d) => d.domain).join(', ')}` : '';
		}
		const c = cantonByNr.get(hover);
		return c ? `${cantonName(lang, c.code)} · ${pct(lang, enforcing(latest(c.series)))} ${tr.enforcing.toLowerCase()}` : '';
	});
</script>

<svelte:head>
	<title>{tr.site}</title>
	<meta name="description" content={tr.tagline} />
</svelte:head>

<header class="intro text">
	<p class="kicker">{tr.kicker(date(lang, scanDate))}</p>
	<h1>{tr.title(share)}</h1>
	<p class="dek">
		{tr.lead(
			pctText(lang, share),
			known(now),
			cantonName(lang, top.code),
			pctText(lang, enforcing(latest(top.series))),
			cantonName(lang, bottom.code),
			pctText(lang, enforcing(latest(bottom.series)))
		)}
	</p>
</header>

<section class="national text">
	<h2 class="chart-title">{tr.keyTitle}</h2>
	<StatusBar counts={now} {lang} />
	<p class="source">{tr.basis(known(now), total, latest(pub.none_without_rua))}</p>
</section>

<p class="prose text">{tr.why}</p>

<section class="figure">
	<h2 class="chart-title">{tr.mapTitle}</h2>
	<p class="chart-sub">{data.muniPaths ? tr.mapSub : tr.legendShare}</p>
	<div class="map-box">
		<Map {shapes} {labels} label={tr.mapTitle} selected={hover} onhover={(id) => (hover = id)} />
	</div>
	<p class="caption" aria-live="polite">{caption}</p>
	{#if !data.muniPaths}
		<ShareLegend {lang} title={tr.legendShare} average={share} averageLabel={tr.average(pct(lang, share))} />
	{/if}
	<p class="source">{tr.sourceLine}</p>
</section>

<p class="prose text">{tr.cantonsPara}</p>

<section class="figure">
	<h2 class="chart-title">{tr.rankTitle}</h2>
	<p class="chart-sub">{tr.rankSub}</p>
	<RankedBars cantons={pub.cantons} national={now} {lang} />
	<p class="source">{tr.sourceLine} * {tr.smallN}</p>
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
							<th class="num"><span class="swatch {s}"></span><span class="sr-only">{tr.statusShort[s]}</span></th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each sorted as c}
						{@const n = latest(c.series)}
						<tr>
							<td><a href="{base}/{lang}/kanton/{c.code.toLowerCase()}/">{cantonName(lang, c.code)}</a></td>
							<td class="num">{pct(lang, enforcing(n))}</td>
							<td class="num">{n.reduce((a, b) => a + b, 0)}</td>
							{#each n as v}
								<td class="num">{v}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</details>
</section>

{#if pub.scans.length > 1 && munis.length}
	<p class="prose text">
		{tr.changePara(date(lang, pub.scans[0]), change.up, change.down, pub.none_without_rua[0], latest(pub.none_without_rua))}
	</p>
{/if}

<section class="figure">
	<h2 class="chart-title">{tr.trendTitle}</h2>
	<p class="chart-sub">{tr.legendShare}</p>
	<Trend series={pub.national} scans={pub.scans} {lang} />
	<p class="source">{tr.sourceLine}</p>
</section>

<section class="text">
	<h2 class="chart-title">{tr.goalTitle}</h2>
	<p class="prose">{tr.goalPara}</p>
	<p><a href="{base}/{lang}/guide/">{tr.goalLink} →</a></p>
</section>

<section class="endnote text">
	<h2 class="chart-title">{tr.aboutMethod}</h2>
	<p>{tr.methodNote(total)}</p>
	<p><a href="{base}/{lang}/method/">{tr.nav.method}</a> · <a href="{base}/{lang}/method/#corrections">{tr.footerCorrections}</a></p>
	{#if !data.muniPaths}
		<p class="muted">{tr.cantonDetailLater}</p>
	{/if}
</section>

<style>
	.intro h1 {
		margin: 0.35rem 0 0.8rem;
	}
	.dek {
		margin: 0 0 0.9rem;
	}
	section {
		margin: 2.5rem 0 0;
	}
	.figure {
		margin-top: 2.5rem;
	}
	.national {
		margin-top: 2rem;
	}
	.prose {
		font-family: var(--serif);
		font-size: 1.125rem;
		line-height: 1.6;
		margin: 2.5rem 0 0;
	}
	section .prose {
		margin-top: 0.4rem;
	}
	.map-box {
		max-width: 60rem;
	}
	.caption {
		min-height: 1.5em;
		margin: 0.4rem 0 0;
		font-size: 0.94rem;
		max-width: none;
	}
	.table-view {
		margin-top: 1.2rem;
	}
	.table-view summary {
		cursor: pointer;
		font-size: 0.94rem;
		color: var(--muted);
		text-decoration: underline;
		text-decoration-color: var(--line);
		list-style: none;
	}
	.table-view summary::-webkit-details-marker {
		display: none;
	}
	.endnote {
		border-top: 1px solid var(--line);
		padding-top: 1.2rem;
		font-size: 0.94rem;
	}
	.endnote p {
		margin: 0.5rem 0;
	}
</style>
