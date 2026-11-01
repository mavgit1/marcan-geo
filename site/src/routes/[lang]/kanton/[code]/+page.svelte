<script lang="ts">
	import { base } from '$app/paths';
	import Map, { type Shape } from '$lib/Map.svelte';
	import StatusBar from '$lib/StatusBar.svelte';
	import Trend from '$lib/Trend.svelte';
	import { data as pub, latest, enforcing } from '$lib/data';
	import { shareVar, statusVar } from '$lib/colors';
	import { t, pct } from '$lib/i18n';
	import cantonPaths from '$lib/geo/cantons.json';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));
	const c = $derived(data.canton);
	const now = $derived(latest(c.series));
	const munis = $derived((pub.municipalities ?? []).filter((m) => m.canton === c.code).sort((a, b) => a.name.localeCompare(b.name, lang)));

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
		// Without municipality detail: Switzerland, this canton highlighted.
		return pub.cantons.map((k) => ({
			id: String(k.nr),
			d: (cantonPaths as Record<string, string>)[String(k.nr)],
			fill: k.nr === c.nr ? shareVar(enforcing(latest(k.series))) : 'var(--muted-bg)',
			title: k.name,
			href: `${base}/${lang}/kanton/${k.code.toLowerCase()}/`
		}));
	});
</script>

<svelte:head>
	<title>{c.name} · {tr.site}</title>
</svelte:head>

<p><a href="{base}/{lang}/">← {tr.backToOverview}</a></p>
<h1>{c.name}</h1>

<div class="grid">
	<div>
		<p class="big">{pct(lang, enforcing(now))}</p>
		<p class="muted">{tr.enforcingShare}</p>
		<StatusBar counts={now} {lang} />
		<p><a href="{base}/{lang}/guide/">{tr.howToImprove} →</a></p>
	</div>
	<div>
		<Map {shapes} focus={data.muniPaths ? c.nr : undefined} label="{tr.mapTitle}: {c.name}" selected={data.muniPaths ? null : String(c.nr)} />
	</div>
</div>

<h2>{tr.trendTitle}</h2>
<Trend series={c.series} scans={pub.scans} {lang} />

{#if munis.length}
	<h2>{tr.municipalities}</h2>
	<div class="table-scroll">
		<table>
			<thead>
				<tr><th>{tr.municipality}</th><th>{tr.mapTitle}</th><th>{tr.policy}</th></tr>
			</thead>
			<tbody>
				{#each munis as m}
					<tr>
						<td><a href="{base}/{lang}/gemeinde/{m.bfs}/">{m.name}</a></td>
						<td><span class="swatch {m.status}"></span>{tr.status[m.status]}</td>
						<td><code>{m.policy || tr.noRecord}</code></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="muted">{tr.cantonDetailLater}</p>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
		gap: 2rem;
		align-items: start;
	}
	@media (max-width: 760px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.big {
		font-size: 3.5rem;
		font-weight: 750;
		line-height: 1;
		margin: 0;
		color: var(--accent);
	}
</style>
