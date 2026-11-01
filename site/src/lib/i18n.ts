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
	kicker: (date: string) => string;
	title: (share: number) => string;
	dek: (top: string, topP: string, bottom: string, bottomP: string, mon: string) => string;
	firstStep: (n: number, p: string) => string;
	rankTitle: string;
	rankSub: string;
	average: (p: string) => string;
	smallN: string;
	mapLocator: string;
	aboutTitle: string;
	aboutBody: (date: string, n: number) => string;
	aboutMethod: string;
	rank: (r: number, of: number) => string;
	vsNational: (p: string) => string;
	domain: string;
	mailDomain: string;
	otherDomain: string;
	counts: string;
	weakestNote: string;
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
	enforcing: 'Blockieren oder filtern',
	enforcingShare: 'Blockieren oder filtern',
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
	legendShare: 'Anteil der Gemeinden, die gefälschte Mails blockieren oder filtern',
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
	tableView: 'Als Tabelle',
	kicker: (d) => `DMARC-Monitor · Stand ${d}`,
	title: (x) => (x < 0.5 ? 'Weniger als die Hälfte der Gemeinden wehrt gefälschte Mails ab' : 'Mehr als die Hälfte der Gemeinden wehrt gefälschte Mails ab'),
	dek: (t, tp, b, bp, m) => `Zwischen den Kantonen liegen Welten: In ${t} blockieren oder filtern ${tp} der Gemeinden gefälschte Mails mit ihrem Absender, in ${b} sind es ${bp}. Weitere ${m} überwachen bereits – ihnen fehlt ein einziger Schritt.`,
	firstStep: (n, p) => `${n} Gemeinden (${p}) haben den ersten Schritt gemacht: Sie überwachen bereits und sind einen Schritt vom Schutz entfernt.`,
	rankTitle: 'Grosse Unterschiede zwischen den Kantonen',
	rankSub: 'Gemeinden nach Schutz, Kantone sortiert nach dem Anteil, der gefälschte Mails blockiert oder filtert. Linie: Schweiz.',
	average: (p) => `Schweiz ${p}`,
	smallN: 'Weniger als 10 Gemeinden: Anteile schwanken stark.',
	mapLocator: 'Auf der Karte',
	aboutTitle: 'Über diese Daten',
	aboutBody: (d, n) => `Gemessen am ${d}: die öffentlichen DNS-Einträge (DMARC, SPF, MX) aller ${n} Gemeinden. Es wurden keine Mails verschickt und keine Server der Gemeinden kontaktiert.`,
	aboutMethod: 'So wird gemessen',
	rank: (r, n) => `Rang ${r} von ${n}`,
	vsNational: (p) => `Schweiz: ${p}`,
	domain: 'Domain',
	mailDomain: 'Maildomain',
	otherDomain: 'Weitere Domain',
	counts: 'zählt',
	weakestNote: 'Es zählt die am schwächsten geschützte Domain, denn mit jeder lassen sich Mails im Namen der Gemeinde fälschen.',
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
	enforcing: 'Bloquent ou filtrent',
	enforcingShare: 'Bloquent ou filtrent',
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
	legendShare: 'Part des communes qui bloquent ou filtrent les e-mails usurpés',
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
	tableView: 'En tableau',
	kicker: (d) => `Observatoire DMARC · état au ${d}`,
	title: (x) => (x < 0.5 ? 'Moins de la moitié des communes repoussent les e-mails usurpés' : 'Plus de la moitié des communes repoussent les e-mails usurpés'),
	dek: (t, tp, b, bp, m) => `D’un canton à l’autre, l’écart est énorme. ${t} : ${tp} des communes bloquent ou filtrent les e-mails qui usurpent leur adresse. ${b} : ${bp}. ${m} des communes surveillent déjà – il ne leur manque qu’une étape.`,
	firstStep: (n, p) => `${n} communes (${p}) ont fait le premier pas : elles surveillent déjà et ne sont qu’à une étape de la protection.`,
	rankTitle: 'De grandes différences entre les cantons',
	rankSub: 'Communes selon leur protection, cantons triés par la part qui bloque ou filtre les e-mails usurpés. Ligne : Suisse.',
	average: (p) => `Suisse ${p}`,
	smallN: 'Moins de 10 communes : les parts varient fortement.',
	mapLocator: 'Sur la carte',
	aboutTitle: 'À propos de ces données',
	aboutBody: (d, n) => `Mesuré le ${d} : les enregistrements DNS publics (DMARC, SPF, MX) des ${n} communes. Aucun e-mail n’a été envoyé et aucun serveur communal n’a été contacté.`,
	aboutMethod: 'Méthode de mesure',
	rank: (r, n) => `Rang ${r} sur ${n}`,
	vsNational: (p) => `Suisse : ${p}`,
	domain: 'Domaine',
	mailDomain: 'Domaine mail',
	otherDomain: 'Autre domaine',
	counts: 'compte',
	weakestNote: 'C’est le domaine le moins protégé qui compte, car chacun permet d’envoyer de faux e-mails au nom de la commune.',
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
	enforcing: 'Bloccano o filtrano',
	enforcingShare: 'Bloccano o filtrano',
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
	legendShare: 'Quota dei comuni che bloccano o filtrano le e-mail falsificate',
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
	tableView: 'Come tabella',
	kicker: (d) => `Osservatorio DMARC · stato al ${d}`,
	title: (x) => (x < 0.5 ? 'Meno della metà dei comuni respinge le e-mail falsificate' : 'Più della metà dei comuni respinge le e-mail falsificate'),
	dek: (t, tp, b, bp, m) => `Tra i cantoni c’è un abisso. ${t}: il ${tp} dei comuni blocca o filtra le e-mail che ne falsificano l’indirizzo. ${b}: il ${bp}. Un altro ${m} dei comuni monitora già – manca un solo passo.`,
	firstStep: (n, p) => `${n} comuni (${p}) hanno fatto il primo passo: monitorano già e sono a un passo dalla protezione.`,
	rankTitle: 'Grandi differenze tra i cantoni',
	rankSub: 'Comuni secondo la protezione, cantoni ordinati per la quota che blocca o filtra le e-mail falsificate. Linea: Svizzera.',
	average: (p) => `Svizzera ${p}`,
	smallN: 'Meno di 10 comuni: le quote variano molto.',
	mapLocator: 'Sulla carta',
	aboutTitle: 'Su questi dati',
	aboutBody: (d, n) => `Misurato il ${d}: i record DNS pubblici (DMARC, SPF, MX) di tutti i ${n} comuni. Non è stata inviata alcuna e-mail e non è stato contattato alcun server comunale.`,
	aboutMethod: 'Come misuriamo',
	rank: (r, n) => `${r}° su ${n}`,
	vsNational: (p) => `Svizzera: ${p}`,
	domain: 'Dominio',
	mailDomain: 'Dominio mail',
	otherDomain: 'Altro dominio',
	counts: 'conta',
	weakestNote: 'Conta il dominio meno protetto, perché con ognuno si possono falsificare e-mail a nome del comune.',
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
	enforcing: 'Block or filter',
	enforcingShare: 'Block or filter',
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
	legendShare: 'Share of municipalities that block or filter spoofed mail',
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
	tableView: 'As a table',
	kicker: (d) => `DMARC Monitor · as of ${d}`,
	title: (x) => (x < 0.5 ? 'Fewer than half of Swiss municipalities fend off spoofed mail' : 'More than half of Swiss municipalities fend off spoofed mail'),
	dek: (t, tp, b, bp, m) => `The cantons are worlds apart: in ${t}, ${tp} of municipalities block or filter mail that fakes their address; in ${b}, ${bp}. Another ${m} already monitor – they are one step away.`,
	firstStep: (n, p) => `${n} municipalities (${p}) have taken the first step: they already monitor and are one step from protection.`,
	rankTitle: 'Large differences between cantons',
	rankSub: 'Municipalities by protection, cantons sorted by the share that blocks or filters spoofed mail. Line: Switzerland.',
	average: (p) => `Switzerland ${p}`,
	smallN: 'Fewer than 10 municipalities: shares vary a lot.',
	mapLocator: 'On the map',
	aboutTitle: 'About this data',
	aboutBody: (d, n) => `Measured on ${d}: the public DNS records (DMARC, SPF, MX) of all ${n} municipalities. No mail was sent and no municipal server was contacted.`,
	aboutMethod: 'How it is measured',
	rank: (r, n) => `Rank ${r} of ${n}`,
	vsNational: (p) => `Switzerland: ${p}`,
	domain: 'Domain',
	mailDomain: 'Mail domain',
	otherDomain: 'Other domain',
	counts: 'counts',
	weakestNote: 'The least protected domain counts, since each one can be used to fake mail in the municipality’s name.',
};

const dicts: Record<Lang, Dict> = { de, fr, it, en };

export const t = (lang: Lang): Dict => dicts[lang];

const locales: Record<Lang, string> = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB' };

export const pct = (lang: Lang, x: number): string =>
	new Intl.NumberFormat(locales[lang], { style: 'percent', maximumFractionDigits: 0 }).format(x);

export const date = (lang: Lang, iso: string): string =>
	new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));

const cantonNames: Record<string, [string, string, string, string]> = {
	ZH: ['Zürich', 'Zurich', 'Zurigo', 'Zurich'],
	BE: ['Bern', 'Berne', 'Berna', 'Bern'],
	LU: ['Luzern', 'Lucerne', 'Lucerna', 'Lucerne'],
	UR: ['Uri', 'Uri', 'Uri', 'Uri'],
	SZ: ['Schwyz', 'Schwyz', 'Schwyz', 'Schwyz'],
	OW: ['Obwalden', 'Obwald', 'Obvaldo', 'Obwalden'],
	NW: ['Nidwalden', 'Nidwald', 'Nidvaldo', 'Nidwalden'],
	GL: ['Glarus', 'Glaris', 'Glarona', 'Glarus'],
	ZG: ['Zug', 'Zoug', 'Zugo', 'Zug'],
	FR: ['Freiburg', 'Fribourg', 'Friburgo', 'Fribourg'],
	SO: ['Solothurn', 'Soleure', 'Soletta', 'Solothurn'],
	BS: ['Basel-Stadt', 'Bâle-Ville', 'Basilea Città', 'Basel-Stadt'],
	BL: ['Basel-Landschaft', 'Bâle-Campagne', 'Basilea Campagna', 'Basel-Landschaft'],
	SH: ['Schaffhausen', 'Schaffhouse', 'Sciaffusa', 'Schaffhausen'],
	AR: ['Appenzell Ausserrhoden', 'Appenzell Rhodes-Extérieures', 'Appenzello Esterno', 'Appenzell Ausserrhoden'],
	AI: ['Appenzell Innerrhoden', 'Appenzell Rhodes-Intérieures', 'Appenzello Interno', 'Appenzell Innerrhoden'],
	SG: ['St. Gallen', 'Saint-Gall', 'San Gallo', 'St. Gallen'],
	GR: ['Graubünden', 'Grisons', 'Grigioni', 'Graubünden'],
	AG: ['Aargau', 'Argovie', 'Argovia', 'Aargau'],
	TG: ['Thurgau', 'Thurgovie', 'Turgovia', 'Thurgau'],
	TI: ['Tessin', 'Tessin', 'Ticino', 'Ticino'],
	VD: ['Waadt', 'Vaud', 'Vaud', 'Vaud'],
	VS: ['Wallis', 'Valais', 'Vallese', 'Valais'],
	NE: ['Neuenburg', 'Neuchâtel', 'Neuchâtel', 'Neuchâtel'],
	GE: ['Genf', 'Genève', 'Ginevra', 'Geneva'],
	JU: ['Jura', 'Jura', 'Jura', 'Jura'],
};

export const cantonName = (lang: Lang, code: string): string => cantonNames[code]?.[langs.indexOf(lang)] ?? code;
