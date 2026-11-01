<script lang="ts">
	import { base } from '$app/paths';
	import { data as pub, latest } from '$lib/data';
	import { t, date, cantonName } from '$lib/i18n';

	let { data } = $props();
	const lang = $derived(data.lang);
	const tr = $derived(t(lang));
	const m = $derived(data.m);
	// The domain that decides the status: the first one with that status.
	const deciding = $derived(m.domains.findIndex((d) => d.status === m.status));
</script>

<svelte:head>
	<title>{m.name} · {tr.site}</title>
</svelte:head>

<p><a href="{base}/{lang}/kanton/{m.canton.toLowerCase()}/">← {cantonName(lang, m.canton)}</a></p>
<p class="kicker">{tr.municipality} · {tr.scanOf(date(lang, latest(pub.scans)))}</p>
<h1>{m.name}</h1>

<p class="status"><span class="swatch {m.status}"></span>{tr.status[m.status]}</p>

<div class="table-scroll">
	<table>
		<thead>
			<tr><th>{tr.domain}</th><th>{tr.mapTitle}</th><th>{tr.policy}</th></tr>
		</thead>
		<tbody>
			{#each m.domains as d, i}
				<tr>
					<td>
						<code>{d.domain}</code>
						<span class="muted small">{i === 0 ? tr.mailDomain : tr.otherDomain}{#if m.domains.length > 1 && i === deciding} · <strong>{tr.counts}</strong>{/if}</span>
					</td>
					<td><span class="swatch {d.status}"></span>{tr.status[d.status]}</td>
					<td><code>{d.policy || tr.noRecord}</code></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
{#if m.domains.length > 1}
	<p class="small muted">{tr.weakestNote}</p>
{/if}

<dl>
	<dt>{tr.spf}</dt>
	<dd>{tr.spfValues[m.spf] ?? m.spf}</dd>
</dl>

<h2>{tr.history}</h2>
<ol class="history">
	{#each m.history as [i, s]}
		<li><span class="swatch {s}"></span>{date(lang, pub.scans[i])}: {tr.status[s]}</li>
	{/each}
</ol>

<p><a href="{base}/{lang}/guide/#{m.status}">{tr.howToImprove} →</a></p>

<style>
	.status {
		font-size: 1.3rem;
		font-weight: 600;
	}
	td .small {
		display: block;
		font-size: 0.82rem;
	}
	.small {
		font-size: 0.88rem;
	}
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.4rem 1.2rem;
		margin-top: 1.4rem;
	}
	dt {
		color: var(--muted);
	}
	dd {
		margin: 0;
	}
	.history {
		list-style: none;
		padding: 0;
	}
</style>
