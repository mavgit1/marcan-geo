// Builds the map geometry from swisstopo swissBOUNDARIES3D (Hoheitsgebiet layer).
// Run once per boundary edition; the output in src/lib/geo/ is committed.
//
//   node scripts/build-geo.mjs <path to swissBOUNDARIES3D_1_5_TLM_HOHEITSGEBIET.shp> <edition, e.g. 2026-01>
//
// Coordinates stay in LV95 (the Swiss projection) and are only scaled to the
// SVG viewBox, so the map looks the way Swiss maps usually do.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoIdentity, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

const [shp, edition] = process.argv.slice(2);
if (!shp || !edition) {
	console.error('usage: build-geo.mjs <HOHEITSGEBIET.shp> <edition>');
	process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'src', 'lib', 'geo');
const tmp = join(mkdtempSync(join(tmpdir(), 'marcan-geo-')), 'ch.json');
const mapshaper = join(here, '..', 'node_modules', '.bin', 'mapshaper');

// Simplify on the shared topology so neighbours keep matching edges. The map
// is ~1000 px across ~350 km, so detail below ~200 m is invisible.
execFileSync(mapshaper, [
	'-i', shp, 'name=all',
	'-filter', 'ICC == "CH"',
	'-each', 'kind = OBJEKTART == "Kantonsgebiet" ? "lake" : OBJEKTART == "Kommunanz" ? "shared" : "municipality"',
	'-filter-fields', 'BFS_NUMMER,KANTONSNUM,kind',
	'-simplify', 'interval=200', 'keep-shapes',
	'-filter', 'kind != "lake"', '+', 'name=land',
	'-dissolve', 'KANTONSNUM', 'target=land', '+', 'name=cantons',
	'-o', tmp, 'format=topojson', 'quantization=100000', 'target=all,cantons'
], { stdio: 'inherit' });

const topo = JSON.parse(readFileSync(tmp, 'utf8'));
const layer = topo.objects.all;
const all = feature(topo, layer);

const W = 1000;
const projection = geoIdentity().reflectY(true).fitWidth(W, all);
const path = geoPath(projection).digits(1);
const [[, y0], [, y1]] = path.bounds(all);
const H = Math.ceil(y1 - y0);

const land = layer.geometries.filter((g) => g.properties.kind !== 'lake');
const municipalities = {};
const shared = [];
const lakes = [];
const cantonGeoms = {};
for (const f of all.features) {
	const d = path(f);
	if (!d) continue;
	const p = f.properties;
	if (p.kind === 'lake') lakes.push(d);
	else if (p.kind === 'shared') shared.push(d);
	else municipalities[p.BFS_NUMMER] = d;
}
for (const g of land) (cantonGeoms[g.properties.KANTONSNUM] ??= []).push(g);

// Canton fills from the dissolved layer. Labels sit at the centroid of the
// canton's largest municipality, which stays inside oddly shaped cantons.
const cantonFills = {};
const boxes = {};
for (const f of feature(topo, topo.objects.cantons).features) {
	cantonFills[f.properties.KANTONSNUM] = path(f);
	const [[x0, y0], [x1, y1]] = path.bounds(f);
	boxes[f.properties.KANTONSNUM] = [x0, y0, x1 - x0, y1 - y0].map((v) => Math.round(v * 10) / 10);
}
const labels = {};
for (const [nr, geoms] of Object.entries(cantonGeoms)) {
	const fs = geoms.map((g) => feature(topo, g));
	const largest = fs.reduce((a, b) => (path.area(b) > path.area(a) ? b : a));
	const [x, y] = path.centroid(largest);
	labels[nr] = [Math.round(x), Math.round(y)];
}

const cantonBorders = path(
	mesh(topo, { type: 'GeometryCollection', geometries: land }, (a, b) => a.properties.KANTONSNUM !== b.properties.KANTONSNUM || a === b)
);

mkdirSync(out, { recursive: true });
const meta = { edition, source: 'swisstopo swissBOUNDARIES3D', viewBox: `0 0 ${W} ${H}` };
writeFileSync(join(out, 'base.json'), JSON.stringify({ ...meta, lakes, shared, cantonBorders, labels, boxes }));
writeFileSync(join(out, 'cantons.json'), JSON.stringify(cantonFills));
writeFileSync(join(out, 'municipalities.json'), JSON.stringify(municipalities));
console.log(
	`geo ${edition}: ${Object.keys(municipalities).length} municipalities, ${Object.keys(cantonFills).length} cantons, ${lakes.length} lakes, viewBox ${meta.viewBox}`
);
