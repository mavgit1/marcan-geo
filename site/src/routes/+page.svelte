<script lang="ts">
	// Language choice. Picks the browser's language when JavaScript runs;
	// the links work without it.
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { langs, langNames, isLang } from '$lib/i18n';

	onMount(() => {
		const pref = navigator.languages.map((l) => l.slice(0, 2)).find(isLang) ?? 'de';
		goto(`${base}/${pref}/`, { replaceState: true });
	});
</script>

<svelte:head>
	<title>DMARC · Gemeinden · Communes · Comuni</title>
</svelte:head>

<main class="wrap choose">
	<h1>DMARC</h1>
	<ul>
		{#each langs as l}
			<li><a href="{base}/{l}/" hreflang={l}>{langNames[l]}</a></li>
		{/each}
	</ul>
</main>

<style>
	.choose {
		padding-top: 4rem;
	}
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		gap: 1.5rem;
		font-size: 1.2rem;
	}
</style>
