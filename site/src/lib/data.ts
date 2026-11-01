// The published data file, written by `marcan-geo export`.
// Its level decides what exists: level 0 has no `municipalities` at all.

import raw from './data/public.json';
import type { StatusKey } from './i18n';

export type Counts = [number, number, number, number, number];

export interface Canton {
	nr: number;
	code: string;
	name: string;
	series: Counts[];
}

export interface Municipality {
	bfs: number;
	name: string;
	canton: string;
	status: StatusKey;
	policy: string;
	spf: string;
	history: [number, StatusKey][];
}

export interface PublicData {
	level: number;
	classifier_version: number;
	statuses: StatusKey[];
	scans: string[];
	national: Counts[];
	cantons: Canton[];
	municipalities?: Municipality[];
}

export const data = raw as unknown as PublicData;

export const STATUSES: StatusKey[] = ['blocked', 'filtered', 'monitoring', 'none', 'unknown'];

export const latest = <T>(series: T[]): T => series[series.length - 1];

/** Share of municipalities enforcing (blocked + filtered), among those with a known mail domain. */
export const enforcing = (c: Counts): number => {
	const known = c[0] + c[1] + c[2] + c[3];
	return known ? (c[0] + c[1]) / known : 0;
};

export const known = (c: Counts): number => c[0] + c[1] + c[2] + c[3];

export const cantonByCode = (code: string): Canton | undefined =>
	data.cantons.find((c) => c.code.toLowerCase() === code.toLowerCase());
