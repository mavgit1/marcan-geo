<script lang="ts">
	// Stepped legend for the canton map, with a tick at the national share.
	import { shareBins } from './colors';
	import { pct, type Lang } from './i18n';

	let { lang, title, average, averageLabel }: { lang: Lang; title: string; average: number; averageLabel: string } = $props();

	const W = 240;
	const steps = [0, ...shareBins, 1];
	const x = (v: number) => 4 + v * (W - 8);
</script>

<figure class="share-legend">
	<figcaption class="small muted">{title}</figcaption>
	<svg viewBox="0 0 {W} 46" role="img" aria-label="{title}: {pct(lang, 0)}–{pct(lang, 1)}, {averageLabel}">
		{#each steps.slice(0, -1) as lo, i}
			<rect x={x(lo)} y="14" width={x(steps[i + 1]) - x(lo)} height="10" class="bin{i}" />
		{/each}
		{#each steps as v}
			<text x={x(v)} y="38" class="tick" text-anchor={v === 0 ? 'start' : v === 1 ? 'end' : 'middle'}>{pct(lang, v)}</text>
		{/each}
		<line x1={x(average)} x2={x(average)} y1="10" y2="28" class="avg" />
		<text x={x(average)} y="7" class="tick strong" text-anchor="middle">{averageLabel}</text>
	</svg>
</figure>

<style>
	.share-legend {
		margin: 0;
		max-width: 18rem;
	}
	svg {
		width: 100%;
		height: auto;
		display: block;
		overflow: visible;
	}
	rect {
		stroke: var(--bg);
		stroke-width: 1;
	}
	.bin0 {
		fill: var(--b0);
	}
	.bin1 {
		fill: var(--b1);
	}
	.bin2 {
		fill: var(--b2);
	}
	.bin3 {
		fill: var(--b3);
	}
	.bin4 {
		fill: var(--b4);
	}
	.tick {
		font-size: 10px;
		fill: var(--muted);
	}
	.strong {
		fill: var(--fg);
		font-weight: 650;
	}
	.avg {
		stroke: var(--fg);
		stroke-width: 1.5;
	}
	.small {
		font-size: 0.85rem;
	}
</style>
