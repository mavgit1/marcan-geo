<script lang="ts">
	import { base } from '$app/paths';
	import Map, { type Shape } from '$lib/Map.svelte';
	import StatusBar from '$lib/StatusBar.svelte';
	import Trend from '$lib/Trend.svelte';
	import { data as pub, latest, enforcing, known, STATUSES } from '$lib/data';
	import { shareBins, shareVar, shareVars, statusVar } from '$lib/colors';
	import { t, pct, date } from '$lib/i18n';
	import cantonPaths from '$lib/geo/cantons.json';
	import geo from '$lib/geo/base.json';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));

	const now = latest(pub.national);
	const total = now.reduce((a, b) => a + b, 0);
	const cantonByNr = new globalThis.Map(pub.cantons.map((c) => [String(c.nr), c]));
	const munis = pub.municipalities ?? [];
	const muniByBfs = new globalThis.Map(munis.map((m) => [String(m.bfs), m]));

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
			const share = enforcing(latest(c.series));
			return {
				id: String(c.nr),
				d: (cantonPaths as Record<string, string>)[String(c.nr)],
				fill: shareVar(share),
				title: `${c.name}: ${pct(lang, share)} ${tr.enforcing.toLowerCase()}`,
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
			return m ? { title: `${m.name} (${m.canton})`, sub: `${tr.status[m.status]}${m.policy ? ` · ${m.policy}` : ''}` } : null;
		}
		const c = cantonByNr.get(hover);
		return c ? { title: c.name, counts: latest(c.series) } : null;
	});

	const sorted = [...pub.cantons].sort((a, b) => enforcing(latest(b.series)) - enforcing(latest(a.series)));
	const binLabels = $derived(
		shareVars.map((_, i) => {
			const lo = i === 0 ? 0 : shareBins[i - 1];
			const hi = i < shareBins.length ? shareBins[i] : 1;
			return `${pct(lang, lo)}–${pct(lang, hi)}`;
		})
	);
</script>

<svelte:head>
	<title>{tr.site}</title>
	<meta name="description" content={tr.tagline} />
</svelte:head>

<p class="muted lead">{tr.tagline}</p>

<section class="hero">
	<h1><span class="big">{pct(lang, enforcing(now))}</span> <span>{tr.headline}</span></h1>
	<div>
		<p class="muted">
			{tr.headlineSub(known(now), total)} · {tr.noDmarc(pct(lang, now[3] / known(now)))} · {tr.monitoringOnly(pct(lang, now[2] / known(now)))}
		</p>
	</div>
</section>

<section>
	<h2>{tr.mapTitle}</h2>
	<div class="map-grid">
		<div class="map-box">
			<Map {shapes} {labels} label={tr.mapTitle} selected={hover} onhover={(id) => (hover = id)} />
		</div>
		<aside class="side">
			{#if hovered}
				<div class="card">
					<strong>{hovered.title}</strong>
					{#if 'counts' in hovered && hovered.counts}
						<p class="muted small">{pct(lang, enforcing(hovered.counts))} {tr.enforcing.toLowerCase()}</p>
						<StatusBar counts={hovered.counts} {lang} legend={false} />
					{:else if 'sub' in hovered}
						<p class="small">{hovered.sub}</p>
					{/if}
				</div>
			{/if}
			<div class="legend">
				{#if data.muniPaths}
					<ul>
						{#each STATUSES as s}
							<li><span class="swatch {s}"></span>{tr.status[s]}</li>
						{/each}
					</ul>
				{:else}
					<p class="small muted">{tr.legendShare}</p>
					<ul>
						{#each shareVars as _, i}
							<li><span class="swatch bin{i}"></span>{binLabels[i]}</li>
						{/each}
					</ul>
					<p class="small muted">{tr.cantonDetailLater}</p>
				{/if}
			</div>
		</aside>
	</div>
</section>

<section>
	<h2>{tr.municipalities}</h2>
	<StatusBar counts={now} {lang} />
	<p class="small muted">{tr.unknownNote(now[4])}</p>
</section>

<section>
	<h2>{tr.trendTitle}</h2>
	<Trend series={pub.national} scans={pub.scans} {lang} />
</section>

<section>
	<h2>{tr.byCanton}</h2>
	<div class="table-scroll">
		<table>
			<thead>
				<tr>
					<th>{tr.canton}</th>
					<th class="num">{tr.municipalities}</th>
					{#each STATUSES as s}
						<th class="num"><span class="swatch {s}"></span><span class="sr-only">{tr.status[s]}</span></th>
					{/each}
					<th class="num">{tr.enforcingShare}</th>
				</tr>
			</thead>
			<tbody>
				{#each sorted as c}
					{@const n = latest(c.series)}
					<tr>
						<td><a href="{base}/{lang}/kanton/{c.code.toLowerCase()}/">{c.name}</a></td>
						<td class="num">{n.reduce((a, b) => a + b, 0)}</td>
						{#each n as v}
							<td class="num">{v}</td>
						{/each}
						<td class="num"><strong>{pct(lang, enforcing(n))}</strong></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="small muted">{tr.scanOf(date(lang, latest(pub.scans)))}</p>
</section>

<style>
	.lead {
		font-size: 1.05rem;
		margin-bottom: 0.5rem;
	}
	.hero h1 {
		margin: 0 0 0.3rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 1.2rem;
	}
	.big {
		font-size: clamp(3rem, 10vw, 5rem);
		font-weight: 750;
		line-height: 1;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	.map-grid {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(12rem, 1fr);
		gap: 1.5rem;
		align-items: start;
	}
	@media (max-width: 760px) {
		.map-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.side {
		display: grid;
		gap: 1rem;
	}
	.legend ul {
		list-style: none;
		padding: 0;
		margin: 0.3rem 0;
		display: grid;
		gap: 0.25rem;
	}
	.small {
		font-size: 0.88rem;
	}
	.swatch.bin0 {
		background: var(--b0);
	}
	.swatch.bin1 {
		background: var(--b1);
	}
	.swatch.bin2 {
		background: var(--b2);
	}
	.swatch.bin3 {
		background: var(--b3);
	}
	.swatch.bin4 {
		background: var(--b4);
	}
	section {
		margin-bottom: 1rem;
	}
</style>
