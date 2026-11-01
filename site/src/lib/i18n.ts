// UI text in the four languages. Long texts (guide, method) live in the
// route files, one block per language.

export const langs = ['de', 'fr', 'it', 'en'] as const;
export type Lang = (typeof langs)[number];

export const isLang = (s: string): s is Lang => (langs as readonly string[]).includes(s);

export const langNames: Record<Lang, string> = {
	de: 'Deutsch',
	fr: 'Français',
	it: 'Italiano',
	en: 'English'
};

export type StatusKey = 'blocked' | 'filtered' | 'monitoring' | 'none' | 'unknown';

type Dict = {
	site: string;
	tagline: string;
	mapTitle: string;
	status: Record<StatusKey, string>;
	nav: { overview: string; guide: string; method: string };
	headline: string;
	headlineSub: (n: number, total: number) => string;
	noDmarc: (pct: string) => string;
	monitoringOnly: (pct: string) => string;
	unknownNote: (n: number) => string;
	enforcing: string;
	enforcingShare: string;
	canton: string;
	cantons: string;
	municipalities: string;
	municipality: string;
	scanOf: (date: string) => string;
	firstScan: string;
	trendTitle: string;
	byCanton: string;
	cantonDetailLater: string;
	share: string;
	count: string;
	legendShare: string;
	backToOverview: string;
	howToImprove: string;
	policy: string;
	spf: string;
	spfValues: Record<string, string>;
	history: string;
	noRecord: string;
	sortBy: string;
	search: string;
	footerData: string;
	footerBuilt: string;
	footerCorrections: string;
	tableView: string;
};

const de: Dict = {
	site: 'DMARC-Monitor Schweizer Gemeinden',
	tagline: 'Wie gut schützen Schweizer Gemeinden ihre Absenderadresse vor Fälschungen?',
	mapTitle: 'Schutz der Absenderadresse (DMARC)',
	status: {
		blocked: 'Fälschungen blockiert',
		filtered: 'Fälschungen gefiltert',
		monitoring: 'Nur Überwachung',
		none: 'Kein DMARC',
		unknown: 'Keine Daten'
	},
	nav: { overview: 'Übersicht', guide: 'Verbessern', method: 'Methode' },
	headline: 'der Gemeinden blockieren oder filtern gefälschte Mails',
	headlineSub: (n, t) => `${n} von ${t} Gemeinden mit auswertbaren Daten`,
	noDmarc: (p) => `${p} haben gar kein DMARC`,
	monitoringOnly: (p) => `${p} überwachen nur`,
	unknownNote: (n) => `${n} Gemeinden ohne auswertbare Daten (keine Website oder DNS-Fehler) sind nicht mitgezählt.`,
	enforcing: 'Durchsetzend',
	enforcingShare: 'Anteil durchsetzend',
	canton: 'Kanton',
	cantons: 'Kantone',
	municipalities: 'Gemeinden',
	municipality: 'Gemeinde',
	scanOf: (d) => `Stand ${d}`,
	firstScan: 'Erste Messung. Der Verlauf erscheint ab der nächsten Messung.',
	trendTitle: 'Verlauf',
	byCanton: 'Nach Kanton',
	cantonDetailLater: 'Angaben zu einzelnen Gemeinden folgen, sobald die Kantone informiert sind.',
	share: 'Anteil',
	count: 'Anzahl',
	legendShare: 'Anteil der Gemeinden, die durchsetzen',
	backToOverview: 'Zur Übersicht',
	howToImprove: 'So verbessern',
	policy: 'DMARC-Richtlinie',
	spf: 'SPF',
	spfValues: { strict: 'streng (-all)', soft: 'weich (~all)', neutral: 'neutral (?all)', pass_all: 'erlaubt alles (+all)', no_all: 'ohne all', missing: 'fehlt', multiple: 'mehrere Einträge (ungültig)', unresolved: 'nicht auflösbar' },
	history: 'Verlauf',
	noRecord: 'kein Eintrag',
	sortBy: 'Sortieren',
	search: 'Gemeinde suchen',
	footerData: 'Grenzen © swisstopo · Gemeindeliste BFS · Websites Wikidata',
	footerBuilt: 'Erstellt vom Autor von Marcan. Methode und Code sind öffentlich.',
	footerCorrections: 'Korrekturen melden',
	tableView: 'Als Tabelle'
};

const fr: Dict = {
	site: 'Observatoire DMARC des communes suisses',
	tagline: 'Dans quelle mesure les communes suisses protègent-elles leur adresse d’expéditeur contre l’usurpation ?',
	mapTitle: 'Protection de l’adresse d’expéditeur (DMARC)',
	status: {
		blocked: 'Usurpation bloquée',
		filtered: 'Usurpation filtrée',
		monitoring: 'Surveillance seule',
		none: 'Pas de DMARC',
		unknown: 'Pas de données'
	},
	nav: { overview: 'Aperçu', guide: 'Améliorer', method: 'Méthode' },
	headline: 'des communes bloquent ou filtrent les e-mails usurpés',
	headlineSub: (n, t) => `${n} sur ${t} communes avec des données exploitables`,
	noDmarc: (p) => `${p} n’ont aucun DMARC`,
	monitoringOnly: (p) => `${p} surveillent seulement`,
	unknownNote: (n) => `${n} communes sans données exploitables (pas de site web ou erreur DNS) ne sont pas comptées.`,
	enforcing: 'Appliquée',
	enforcingShare: 'Part appliquée',
	canton: 'Canton',
	cantons: 'Cantons',
	municipalities: 'Communes',
	municipality: 'Commune',
	scanOf: (d) => `État au ${d}`,
	firstScan: 'Première mesure. L’évolution apparaîtra dès la prochaine mesure.',
	trendTitle: 'Évolution',
	byCanton: 'Par canton',
	cantonDetailLater: 'Les détails par commune suivront une fois les cantons informés.',
	share: 'Part',
	count: 'Nombre',
	legendShare: 'Part des communes qui appliquent une politique',
	backToOverview: 'Retour à l’aperçu',
	howToImprove: 'Comment améliorer',
	policy: 'Politique DMARC',
	spf: 'SPF',
	spfValues: { strict: 'stricte (-all)', soft: 'souple (~all)', neutral: 'neutre (?all)', pass_all: 'autorise tout (+all)', no_all: 'sans all', missing: 'absent', multiple: 'plusieurs enregistrements (invalide)', unresolved: 'non résolu' },
	history: 'Historique',
	noRecord: 'aucun enregistrement',
	sortBy: 'Trier',
	search: 'Chercher une commune',
	footerData: 'Limites © swisstopo · Liste des communes OFS · Sites web Wikidata',
	footerBuilt: 'Réalisé par l’auteur de Marcan. Méthode et code publics.',
	footerCorrections: 'Signaler une correction',
	tableView: 'En tableau'
};

const it: Dict = {
	site: 'Osservatorio DMARC dei comuni svizzeri',
	tagline: 'Quanto bene i comuni svizzeri proteggono il loro indirizzo mittente dalle falsificazioni?',
	mapTitle: 'Protezione dell’indirizzo del mittente (DMARC)',
	status: {
		blocked: 'Falsificazioni bloccate',
		filtered: 'Falsificazioni filtrate',
		monitoring: 'Solo monitoraggio',
		none: 'Nessun DMARC',
		unknown: 'Nessun dato'
	},
	nav: { overview: 'Panoramica', guide: 'Migliorare', method: 'Metodo' },
	headline: 'dei comuni blocca o filtra le e-mail falsificate',
	headlineSub: (n, t) => `${n} su ${t} comuni con dati utilizzabili`,
	noDmarc: (p) => `il ${p} non ha alcun DMARC`,
	monitoringOnly: (p) => `il ${p} si limita al monitoraggio`,
	unknownNote: (n) => `${n} comuni senza dati utilizzabili (nessun sito web o errore DNS) non sono conteggiati.`,
	enforcing: 'Applicata',
	enforcingShare: 'Quota applicata',
	canton: 'Cantone',
	cantons: 'Cantoni',
	municipalities: 'Comuni',
	municipality: 'Comune',
	scanOf: (d) => `Stato al ${d}`,
	firstScan: 'Prima misurazione. L’andamento apparirà dalla prossima misurazione.',
	trendTitle: 'Andamento',
	byCanton: 'Per cantone',
	cantonDetailLater: 'I dettagli per comune seguiranno dopo che i cantoni saranno stati informati.',
	share: 'Quota',
	count: 'Numero',
	legendShare: 'Quota dei comuni che applicano una politica',
	backToOverview: 'Torna alla panoramica',
	howToImprove: 'Come migliorare',
	policy: 'Politica DMARC',
	spf: 'SPF',
	spfValues: { strict: 'rigoroso (-all)', soft: 'morbido (~all)', neutral: 'neutro (?all)', pass_all: 'consente tutto (+all)', no_all: 'senza all', missing: 'assente', multiple: 'più record (non valido)', unresolved: 'non risolvibile' },
	history: 'Storico',
	noRecord: 'nessun record',
	sortBy: 'Ordina',
	search: 'Cerca un comune',
	footerData: 'Confini © swisstopo · Elenco dei comuni UST · Siti web Wikidata',
	footerBuilt: 'Realizzato dall’autore di Marcan. Metodo e codice sono pubblici.',
	footerCorrections: 'Segnala una correzione',
	tableView: 'Come tabella'
};

const en: Dict = {
	site: 'DMARC Monitor for Swiss Municipalities',
	tagline: 'How well do Swiss municipalities protect their sender address against spoofing?',
	mapTitle: 'Protection of the sender address (DMARC)',
	status: {
		blocked: 'Spoofing blocked',
		filtered: 'Spoofing filtered',
		monitoring: 'Monitoring only',
		none: 'No DMARC',
		unknown: 'No data'
	},
	nav: { overview: 'Overview', guide: 'Improve', method: 'Method' },
	headline: 'of municipalities block or filter spoofed mail',
	headlineSub: (n, t) => `${n} of ${t} municipalities with usable data`,
	noDmarc: (p) => `${p} have no DMARC at all`,
	monitoringOnly: (p) => `${p} only monitor`,
	unknownNote: (n) => `${n} municipalities without usable data (no website or a DNS error) are not counted.`,
	enforcing: 'Enforcing',
	enforcingShare: 'Share enforcing',
	canton: 'Canton',
	cantons: 'Cantons',
	municipalities: 'Municipalities',
	municipality: 'Municipality',
	scanOf: (d) => `As of ${d}`,
	firstScan: 'First measurement. The trend appears from the next one.',
	trendTitle: 'Trend',
	byCanton: 'By canton',
	cantonDetailLater: 'Details for individual municipalities follow once the cantons have been informed.',
	share: 'Share',
	count: 'Count',
	legendShare: 'Share of municipalities enforcing a policy',
	backToOverview: 'Back to overview',
	howToImprove: 'How to improve',
	policy: 'DMARC policy',
	spf: 'SPF',
	spfValues: { strict: 'strict (-all)', soft: 'soft (~all)', neutral: 'neutral (?all)', pass_all: 'allows all (+all)', no_all: 'no all', missing: 'missing', multiple: 'multiple records (invalid)', unresolved: 'unresolved' },
	history: 'History',
	noRecord: 'no record',
	sortBy: 'Sort',
	search: 'Find a municipality',
	footerData: 'Boundaries © swisstopo · Municipality list FSO · Websites Wikidata',
	footerBuilt: 'Built by the author of Marcan. Method and code are public.',
	footerCorrections: 'Report a correction',
	tableView: 'As a table'
};

const dicts: Record<Lang, Dict> = { de, fr, it, en };

export const t = (lang: Lang): Dict => dicts[lang];

const locales: Record<Lang, string> = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB' };

export const pct = (lang: Lang, x: number): string =>
	new Intl.NumberFormat(locales[lang], { style: 'percent', maximumFractionDigits: 0 }).format(x);

export const date = (lang: Lang, iso: string): string =>
	new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));
