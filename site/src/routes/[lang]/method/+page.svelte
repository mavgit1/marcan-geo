<script lang="ts">
	import Meta from '$lib/Meta.svelte';
	import { method } from '$lib/content';
	import { data as pub } from '$lib/data';
	import { t, date } from '$lib/i18n';
	import { corrections } from '$lib/corrections';

	let { data } = $props();
	const m = $derived(method[data.lang]);
	const tr = $derived(t(data.lang));
</script>

<Meta title="{m.title} · {tr.site}" description={m.sections[0].body[0].replace(/<[^>]+>/g, '')} />

<h1>{m.title}</h1>

{#each m.sections.slice(0, 2) as s}
	<h2>{s.title}</h2>
	{#each s.body as p}
		<p>{@html p}</p>
	{/each}
{/each}

<h2>{m.rulesTitle}</h2>
<div class="table-scroll">
	<table>
		<tbody>
			{#each m.rules as [key, rule]}
				<tr>
					<th scope="row"><span class="swatch {key}"></span>{tr.status[key]}</th>
					<td>{@html rule}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<p class="muted small">Classifier v{pub.classifier_version}</p>

{#each m.sections.slice(2) as s}
	<h2>{s.title}</h2>
	{#each s.body as p}
		<p>{@html p}</p>
	{/each}
{/each}

<h2 id="corrections">{m.correctionsTitle}</h2>
{#each m.corrections as p}
	<p>{@html p}</p>
{/each}
<h3>{tr.correctionLog}</h3>
{#if corrections.length}
	<ul class="log">
		{#each corrections as c}
			<li>{date(data.lang, c.date)} · {c.municipality}: {c.what}</li>
		{/each}
	</ul>
{:else}
	<p class="muted">{tr.noCorrections}</p>
{/if}

<h2 id="faq">{m.faqTitle}</h2>
<dl class="faq">
	{#each m.faq as f}
		<dt>{f.q}</dt>
		<dd>{@html f.a}</dd>
	{/each}
</dl>

<style>
	th {
		color: var(--fg);
		white-space: nowrap;
	}
	.small {
		font-size: 0.85rem;
	}
	.faq dt {
		font-weight: 650;
		margin-top: 1rem;
	}
	.faq dd {
		margin: 0.3rem 0 0;
		max-width: 46rem;
	}
	.log {
		padding-left: 1.2rem;
	}
</style>
