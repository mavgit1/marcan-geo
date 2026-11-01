<script lang="ts">
	import { STATUSES, type Counts } from './data';
	import { t, pct, type Lang } from './i18n';

	let { counts, lang, legend = true }: { counts: Counts; lang: Lang; legend?: boolean } = $props();
	const total = $derived(counts.reduce((a, b) => a + b, 0));
</script>

<div class="bar" role="img" aria-label={STATUSES.map((s, i) => `${t(lang).status[s]}: ${counts[i]}`).join(', ')}>
	{#each STATUSES as s, i}
		{#if counts[i] > 0}
			<svg class="seg" viewBox="0 0 10 10" preserveAspectRatio="none" width="{(counts[i] / total) * 100}%">
				<rect width="10" height="10" class={s} />
			</svg>
		{/if}
	{/each}
</div>
{#if legend}
	<ul class="legend">
		{#each STATUSES as s, i}
			<li><span class="swatch {s}"></span>{t(lang).status[s]} <span class="muted">{counts[i]} · {pct(lang, total ? counts[i] / total : 0)}</span></li>
		{/each}
	</ul>
{/if}

<style>
	.bar {
		display: flex;
		height: 1.1rem;
		border-radius: 6px;
		overflow: hidden;
		gap: 2px;
	}
	.seg {
		height: 100%;
		display: block;
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
	.unknown {
		fill: var(--muted-bg);
	}
	.legend {
		list-style: none;
		padding: 0;
		margin: 0.7rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.2rem;
		font-size: 0.92rem;
	}
</style>
