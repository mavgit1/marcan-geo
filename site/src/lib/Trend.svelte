<script lang="ts">
	// Stacked share of each status over the scans, plus the enforcing line.
	import { STATUSES, enforcing, known, type Counts } from './data';
	import { t, pct, date, type Lang } from './i18n';

	let { series, scans, lang }: { series: Counts[]; scans: string[]; lang: Lang } = $props();

	const W = 640;
	const H = 200;
	const P = { l: 36, r: 12, t: 10, b: 26 };
	const x = (i: number) => P.l + (series.length < 2 ? 0 : (i / (series.length - 1)) * (W - P.l - P.r));
	const y = (v: number) => P.t + (1 - v) * (H - P.t - P.b);

	// Known statuses only (unknown is not part of the base).
	const bands = $derived.by(() => {
		const out: { key: string; d: string }[] = [];
		const cum = series.map(() => 0);
		for (let s = 0; s < 4; s++) {
			const lower = cum.slice();
			series.forEach((c, i) => (cum[i] += known(c) ? c[s] / known(c) : 0));
			const top = series.map((_, i) => `${x(i)},${y(cum[i])}`);
			const bottom = series.map((_, i) => `${x(i)},${y(lower[i])}`).reverse();
			out.push({ key: STATUSES[s], d: `M${top.join('L')}L${bottom.join('L')}Z` });
		}
		return out;
	});
	const line = $derived(series.map((c, i) => `${x(i)},${y(enforcing(c))}`).join('L'));
</script>

{#if series.length < 2}
	<p class="muted">{t(lang).firstScan}</p>
{:else}
	<svg viewBox="0 0 {W} {H}" class="trend" role="img" aria-label="{t(lang).enforcingShare}: {series.map((c, i) => `${date(lang, scans[i])} ${pct(lang, enforcing(c))}`).join(', ')}">
		{#each [0, 0.25, 0.5, 0.75, 1] as v}
			<line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} class="grid" />
			<text x={P.l - 6} y={y(v)} class="tick" text-anchor="end" dominant-baseline="middle">{pct(lang, v)}</text>
		{/each}
		{#each bands as b}
			<path d={b.d} class="band {b.key}" />
		{/each}
		<path d="M{line}" class="enf" />
		<text x={P.l} y={H - 6} class="tick">{date(lang, scans[0])}</text>
		<text x={W - P.r} y={H - 6} class="tick" text-anchor="end">{date(lang, scans[scans.length - 1])}</text>
	</svg>
{/if}

<style>
	.trend {
		width: 100%;
		height: auto;
		display: block;
	}
	.grid {
		stroke: var(--line);
		stroke-width: 1;
	}
	.tick {
		font-size: 11px;
		fill: var(--muted);
	}
	.band {
		opacity: 0.85;
	}
	.blocked {
		fill: var(--s-blocked);
	}
	.filtered {
		fill: var(--s-filtered);
	}
	.monitoring {
		fill: var(--s-monitoring);
	}
	.none {
		fill: var(--s-none);
	}
	.enf {
		fill: none;
		stroke: var(--fg);
		stroke-width: 2;
	}
</style>
