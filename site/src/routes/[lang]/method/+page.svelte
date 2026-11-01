<script lang="ts">
	import { method } from '$lib/content';
	import { data as pub } from '$lib/data';
	import { t } from '$lib/i18n';

	let { data } = $props();
	const m = $derived(method[data.lang]);
	const tr = $derived(t(data.lang));
</script>

<svelte:head>
	<title>{m.title} · {tr.site}</title>
</svelte:head>

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

<style>
	th {
		color: var(--fg);
		white-space: nowrap;
	}
	.small {
		font-size: 0.85rem;
	}
</style>
