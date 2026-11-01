<script lang="ts">
	// Stacked share of each status over the scans, plus the line for the share
	// that blocks or filters. Scans are irregular, so x is real time.
	import { STATUSES, enforcing, known, type Counts } from './data';
	import { t, pct, date, type Lang } from './i18n';

	let { series, scans, lang }: { series: Counts[]; scans: string[]; lang: Lang } = $props();

	const W = 640;
	const H = 200;
	const P = { t: 10, b: 30 };
	const P2 = { l: 44, r: 52 };
	const time = $derived(scans.map((d) => Date.parse(d + 'T00:00:00Z')));
	const x = (i: number) => {
		const span = time[time.length - 1] - time[0];
		return P2.l + (span ? (time[i] - time[0]) / span : 0) * (W - P2.l - P2.r);
	};
	// Date ticks at the first and last scan, and at others with room.
	const ticks = $derived.by(() => {
		const last = scans.length - 1;
		const out = [0];
		for (let i = 1; i < last; i++) {
			if (x(i) - x(out[out.length - 1]) > 120 && x(last) - x(i) > 120) out.push(i);
		}
		if (last > 0) out.push(last);
		return out;
	});
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
			<line x1={P2.l} x2={W - P2.r} y1={y(v)} y2={y(v)} class="grid" />
			<text x={P2.l - 6} y={y(v)} class="tick" text-anchor="end" dominant-baseline="middle">{pct(lang, v)}</text>
		{/each}
		{#each bands as b}
			<path d={b.d} class="band {b.key}" />
		{/each}
		<path d="M{line}" class="enf" />
		{#each series as c, i}
			<circle cx={x(i)} cy={y(enforcing(c))} r="4" class="dot"><title>{date(lang, scans[i])}: {pct(lang, enforcing(c))}</title></circle>
		{/each}
		<text x={x(series.length - 1) + 8} y={y(enforcing(series[series.length - 1]))} class="val" dominant-baseline="middle">{pct(lang, enforcing(series[series.length - 1]))}</text>
		{#each ticks as i, k}
			<text x={x(i)} y={H - 6} class="tick" text-anchor={k === 0 ? 'start' : k === ticks.length - 1 ? 'end' : 'middle'}>{date(lang, scans[i])}</text>
		{/each}
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
		font-size: 14px;
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
	.dot {
		fill: var(--fg);
		stroke: var(--bg);
		stroke-width: 2;
	}
	.val {
		font-size: 16px;
		font-weight: 650;
		fill: var(--fg);
	}
	.enf {
		fill: none;
		stroke: var(--fg);
		stroke-width: 2;
	}
</style>
