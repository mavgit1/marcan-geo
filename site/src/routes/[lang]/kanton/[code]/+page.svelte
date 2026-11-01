<script lang="ts">
	import { base } from '$app/paths';
	import Map, { type Shape } from '$lib/Map.svelte';
	import StatusBar from '$lib/StatusBar.svelte';
	import Trend from '$lib/Trend.svelte';
	import { data as pub, latest, enforcing, known } from '$lib/data';
	import { statusVar } from '$lib/colors';
	import { t, pct, date, cantonName } from '$lib/i18n';
	import cantonPaths from '$lib/geo/cantons.json';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));
	const c = $derived(data.canton);
	const now = $derived(latest(c.series));
	const name = $derived(cantonName(lang, c.code));
	const national = enforcing(latest(pub.national));
	const ranked = [...pub.cantons].sort((a, b) => enforcing(latest(b.series)) - enforcing(latest(a.series)));
	const rank = $derived(ranked.findIndex((k) => k.nr === c.nr) + 1);
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
			fill: k.nr === c.nr ? 'var(--accent)' : 'var(--muted-bg)',
			title: cantonName(lang, k.code),
			href: `${base}/${lang}/kanton/${k.code.toLowerCase()}/`
		}));
	});
</script>

<svelte:head>
	<title>{name} · {tr.site}</title>
</svelte:head>

<p><a href="{base}/{lang}/">← {tr.backToOverview}</a></p>
<p class="kicker">{tr.canton} · {tr.scanOf(date(lang, latest(pub.scans)))}</p>
<h1>{name}</h1>

<div class="grid">
	<div>
		<p class="big">{pct(lang, enforcing(now))}</p>
		<p class="muted">{tr.legendShare}</p>
		<p class="compare">{tr.rank(rank, ranked.length)} · {tr.vsNational(pct(lang, national))} · {known(now)} {tr.municipalities}</p>
		{#if known(now) < 10}<p class="small muted">{tr.smallN}</p>{/if}
		<StatusBar counts={now} {lang} />
		<p><a href="{base}/{lang}/guide/">{tr.howToImprove} →</a></p>
	</div>
	<div>
		<Map {shapes} focus={data.muniPaths ? c.nr : undefined} label="{tr.mapTitle}: {name}" selected={data.muniPaths ? null : String(c.nr)} />
	</div>
</div>

<h2>{tr.trendTitle}</h2>
<Trend series={c.series} scans={pub.scans} {lang} />

{#if munis.length}
	<h2>{tr.municipalities}</h2>
	<div class="table-scroll">
		<table>
			<thead>
				<tr><th>{tr.municipality}</th><th>{tr.mapTitle}</th><th>{tr.domain}</th></tr>
			</thead>
			<tbody>
				{#each munis as m}
					<tr>
						<td><a href="{base}/{lang}/gemeinde/{m.bfs}/">{m.name}</a></td>
						<td><span class="swatch {m.status}"></span>{tr.status[m.status]}</td>
						<td class="muted"><code>{m.domains[0]?.domain ?? ''}</code>{#if m.domains.length > 1} +{m.domains.length - 1}{/if}</td>
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
	.compare {
		font-weight: 400;
		margin: 0.4rem 0 1rem;
	}
	.small {
		font-size: 0.88rem;
	}
	.big {
		font-family: var(--serif);
		font-size: 3.2rem;
		font-weight: 700;
		line-height: 1;
		margin: 0;
		color: var(--fg);
	}
</style>
