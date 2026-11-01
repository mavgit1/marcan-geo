<script lang="ts">
	import { guide } from '$lib/content';
	import { t } from '$lib/i18n';

	let { data } = $props();
	const g = $derived(guide[data.lang]);
	const tr = $derived(t(data.lang));
</script>

<svelte:head>
	<title>{g.title} · {tr.site}</title>
</svelte:head>

<h1>{g.title}</h1>
{#each g.intro as p}
	<p>{@html p}</p>
{/each}

{#each g.steps as s}
	<section id={s.id} class="step">
		<h2><span class="swatch {s.id}"></span>{s.title}</h2>
		{#each s.body as p}
			<p>{@html p}</p>
		{/each}
		{#if s.record}
			<pre><code>_dmarc  TXT  "{s.record}"</code></pre>
		{/if}
	</section>
{/each}

<h2>{g.providerTitle}</h2>
<p>{g.provider}</p>

<h2>{g.toolsTitle}</h2>
<p>{g.toolsIntro}</p>
<ul class="tools">
	{#each g.tools as tool}
		<li><a href={tool.url} rel="noopener">{tool.name}</a>: {tool.desc}</li>
	{/each}
</ul>
<p class="muted">{g.toolsNote}</p>

<style>
	.step {
		scroll-margin-top: 1rem;
	}
	pre {
		background: var(--muted-bg);
		border-radius: 8px;
		padding: 0.8rem 1rem;
		overflow-x: auto;
		max-width: 46rem;
	}
	pre code {
		background: none;
		padding: 0;
	}
	.tools li {
		margin: 0.3rem 0;
	}
</style>
