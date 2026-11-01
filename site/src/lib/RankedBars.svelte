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

<ol class="ranked">
	<li class="head" aria-hidden="true">
		<span></span>
		<span class="n">n</span>
		<svg class="head-svg">
			<text x="{avg * 100}%" y="12" text-anchor="middle" class="avg-text">{tr.average(pct(lang, avg))}</text>
			<line x1="{avg * 100}%" x2="{avg * 100}%" y1="15" y2="20" class="avg" />
		</svg>
		<span></span>
	</li>
	{#each rows as r}
		<li>
			<a href="{base}/{lang}/kanton/{r.c.code.toLowerCase()}/">
				<span class="name"><span class="long">{cantonName(lang, r.c.code)}</span><span class="short">{r.c.code}</span>{#if r.small}<span class="star" aria-hidden="true">*</span>{/if}</span>
				<span class="n muted">{r.k}</span>
				<svg viewBox="0 0 100 10" preserveAspectRatio="none" role="img" aria-label="{cantonName(lang, r.c.code)}: {KNOWN.map((s, i) => `${tr.status[s]} ${r.n[i]}`).join(', ')}">
					{#each r.segs as g}
						<rect x={g.x} width={g.w} height="10" class={g.s}><title>{tr.status[g.s]}: {g.n} ({pct(lang, g.w / 100)})</title></rect>
					{/each}
					<line x1={avg * 100} x2={avg * 100} y1="-2" y2="12" class="avg" />
				</svg>
				<span class="share">{pct(lang, r.share)}</span>
			</a>
		</li>
	{/each}
</ol>

<style>
	.ranked {
		list-style: none;
		padding: 0;
		margin: 0;
		max-width: none;
		position: relative;
	}
	.ranked li {
		max-width: none;
	}
	.ranked a,
	.head {
		display: grid;
		grid-template-columns: minmax(6rem, 12rem) 2.2rem minmax(0, 1fr) 2.8rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.2rem 0;
		color: var(--fg);
		text-decoration: none;
		font-variant-numeric: tabular-nums;
	}
	.head {
		padding: 0;
		font-size: 0.8125rem;
		color: var(--muted);
	}
	.ranked a:hover .long,
	.ranked a:hover .short,
	.ranked a:focus-visible .long,
	.ranked a:focus-visible .short {
		text-decoration: underline;
	}
	.name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.94rem;
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
		font-size: 0.8125rem;
	}
	.share {
		text-align: right;
		font-size: 0.94rem;
	}
	svg {
		width: 100%;
		height: 0.875rem;
		display: block;
		overflow: visible;
	}
	.head-svg {
		height: 1.25rem;
	}
	.avg-text {
		font-size: 12px;
		fill: var(--muted);
	}
	rect {
		stroke: var(--bg);
		stroke-width: 1px;
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
		stroke-opacity: 0.6;
		stroke-width: 1px;
		vector-effect: non-scaling-stroke;
	}
	@media (max-width: 520px) {
		.long {
			display: none;
		}
		.short {
			display: inline;
		}
		.ranked a,
		.head {
			grid-template-columns: 2.6rem 2rem minmax(0, 1fr) 2.6rem;
			gap: 0.4rem;
		}
	}
</style>
