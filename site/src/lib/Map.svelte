<script lang="ts">
	import base from './geo/base.json';

	export interface Shape {
		id: string;
		d: string;
		fill: string;
		title: string;
		href?: string;
	}

	interface Props {
		shapes: Shape[];
		/** Zoom to this canton number's bounding box. */
		focus?: number;
		labels?: { x: number; y: number; text: string }[];
		label: string;
		selected?: string | null;
		onhover?: (id: string | null) => void;
	}

	let { shapes, focus, labels = [], label, selected = null, onhover }: Props = $props();

	const boxes = base.boxes as Record<string, number[]>;
	const viewBox = $derived.by(() => {
		if (focus === undefined) return base.viewBox;
		const [x, y, w, h] = boxes[String(focus)];
		const pad = Math.max(w, h) * 0.04;
		return `${x - pad} ${y - pad} ${w + 2 * pad} ${h + 2 * pad}`;
	});
	// Strokes use non-scaling-stroke; only the hatch pattern needs the zoom.
	const scale = $derived(focus === undefined ? 1 : Math.max(...boxes[String(focus)].slice(2)) / 1000);
</script>

<svg {viewBox} role="img" aria-label={label} class="map">
	<defs>
		<pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45) scale({scale * 1.5})">
			<rect width="4" height="4" class="hatch-bg" />
			<line x1="0" y1="0" x2="0" y2="4" class="hatch-line" />
		</pattern>
	</defs>
	{#each shapes as s (s.id)}
		{#if s.href}
			<a href={s.href} onmouseenter={() => onhover?.(s.id)} onmouseleave={() => onhover?.(null)} onfocus={() => onhover?.(s.id)} onblur={() => onhover?.(null)}>
				<path d={s.d} fill={s.fill} class="shape" class:selected={selected === s.id}><title>{s.title}</title></path>
			</a>
		{:else}
			<path d={s.d} fill={s.fill} class="shape" role="presentation" onmouseenter={() => onhover?.(s.id)} onmouseleave={() => onhover?.(null)}><title>{s.title}</title></path>
		{/if}
	{/each}
	{#each base.shared as d}
		<path {d} class="shared" />
	{/each}
	{#each base.lakes as d}
		<path {d} class="lake" />
	{/each}
	<path d={base.cantonBorders} class="borders" />
	{#each labels as l}
		<text x={l.x} y={l.y} class="label">{l.text}</text>
	{/each}
</svg>

<style>
	.map {
		width: 100%;
		height: auto;
		display: block;
	}
	.shape {
		stroke: var(--bg);
		stroke-width: 0.5px;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}
	a:hover .shape,
	a:focus-visible .shape,
	.shape.selected {
		stroke: var(--fg);
		stroke-width: 2px;
	}
	a:focus-visible {
		outline: none;
	}
	.lake {
		fill: var(--lake);
		stroke: var(--line);
		stroke-width: 0.6px;
		vector-effect: non-scaling-stroke;
		pointer-events: none;
	}
	.shared {
		fill: var(--muted-bg);
		pointer-events: none;
	}
	.borders {
		fill: none;
		stroke: var(--fg);
		stroke-opacity: 0.7;
		stroke-width: 1px;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
		pointer-events: none;
	}
	.label {
		font-size: 13px;
		font-weight: 650;
		text-anchor: middle;
		dominant-baseline: middle;
		fill: var(--fg);
		paint-order: stroke;
		stroke: var(--bg);
		stroke-width: 3px;
		pointer-events: none;
	}
	.hatch-bg {
		fill: var(--muted-bg);
	}
	.hatch-line {
		stroke: var(--muted);
		stroke-width: 1.2;
	}
</style>
