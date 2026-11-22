// Public correction log: confirmed corrections, newest first. No reporter
// names. `what` is shown as written, in the language it was written in.

export interface Correction {
	date: string;
	municipality: string;
	what: string;
}

export const corrections: Correction[] = [];
