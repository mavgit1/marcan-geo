<script lang="ts">
	// Cantons ranked by the share that blocks or filters, each as a 100% bar
	// of its municipalities by status (municipalities with data only).
	import { base } from '$app/paths';
	import { STATUSES, enforcing, known, latest, type Canton, type Counts } from './data';
	import { t, pct, cantonName, type Lang } from './i18n';

	let { cantons, national, lang }: { cantons: Canton[]; national: Counts; lang: Lang } = $props();
	const tr = $derived(t(lang));

	const KNOWN = STATUSES.slice(0, 4);
	const SMALL = 10;
	const avg = $derived(enforcing(national));
	const rows = $derived(
		cantons
			.map((c) => {
				const n = latest(c.series);
				const k = known(n);
				let x = 0;
				const segs = KNOWN.map((s, i) => {
					const w = k ? (n[i] / k) * 100 : 0;
					const seg = { s, x, w, n: n[i] };
					x += w;
					return seg;
				}).filter((g) => g.w > 0);
				return { c, n, k, share: enforcing(n), segs, small: k < SMALL };
			})
			.sort((a, b) => b.share - a.share || b.k - a.k)
	);
</script>

<ul class="key">
	{#each KNOWN as s}
		<li><span class="swatch {s}"></span>{tr.status[s]}</li>
	{/each}
</ul>
<ol class="ranked">
	{#each rows as r}
		<li>
			<a href="{base}/{lang}/kanton/{r.c.code.toLowerCase()}/">
				<span class="name"><span class="long">{cantonName(lang, r.c.code)}</span><span class="short">{r.c.code}</span>{#if r.small}<span class="star" aria-hidden="true">*</span>{/if}</span>
				<span class="n muted">{r.k}</span>
				<svg viewBox="0 0 100 10" preserveAspectRatio="none" role="img" aria-label="{cantonName(lang, r.c.code)}: {KNOWN.map((s, i) => `${tr.status[s]} ${r.n[i]}`).join(', ')}">
					{#each r.segs as g}
						<rect x={g.x} width={g.w} height="10" class={g.s}><title>{tr.status[g.s]}: {g.n} ({pct(lang, g.w / 100)})</title></rect>
					{/each}
					<line x1={avg * 100} x2={avg * 100} y1="-1" y2="11" class="avg" />
				</svg>
				<span class="share">{pct(lang, r.share)}</span>
			</a>
		</li>
	{/each}
</ol>
<p class="foot muted">
	<span class="avg-key" aria-hidden="true"></span>{tr.average(pct(lang, avg))} · <span aria-hidden="true">*</span> {tr.smallN}
</p>

<style>
	.key {
		list-style: none;
		padding: 0;
		margin: 0 0 0.6rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1.1rem;
		font-size: 0.88rem;
	}
	.ranked {
		list-style: none;
		padding: 0;
		margin: 0;
		max-width: none;
	}
	.ranked li {
		max-width: none;
	}
	.ranked a {
		display: grid;
		grid-template-columns: minmax(6rem, 11rem) 2.4rem minmax(0, 1fr) 2.8rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.18rem 0.25rem;
		border-radius: 6px;
		color: var(--fg);
		text-decoration: none;
		font-variant-numeric: tabular-nums;
	}
	.ranked a:hover,
	.ranked a:focus-visible {
		background: var(--muted-bg);
	}
	.name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.95rem;
	}
	.short {
		display: none;
	}
	.star {
		color: var(--muted);
		margin-left: 0.15em;
	}
	.n {
		text-align: right;
		font-size: 0.85rem;
	}
	.share {
		text-align: right;
		font-weight: 650;
	}
	svg {
		width: 100%;
		height: 1rem;
		display: block;
		overflow: visible;
	}
	rect {
		stroke: var(--bg);
		stroke-width: 1.5px;
		vector-effect: non-scaling-stroke;
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
	.avg {
		stroke: var(--fg);
		stroke-width: 1.5px;
		stroke-dasharray: 3 2;
		vector-effect: non-scaling-stroke;
	}
	.foot {
		font-size: 0.85rem;
		margin-top: 0.6rem;
	}
	.avg-key {
		display: inline-block;
		width: 0;
		height: 0.9em;
		border-left: 1.5px dashed var(--fg);
		margin-right: 0.45em;
		vertical-align: -0.1em;
	}
	@media (max-width: 520px) {
		.long {
			display: none;
		}
		.short {
			display: inline;
		}
		.ranked a {
			grid-template-columns: 2.6rem 2rem minmax(0, 1fr) 2.6rem;
			gap: 0.4rem;
		}
	}
</style>
