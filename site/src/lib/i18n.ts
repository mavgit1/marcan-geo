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
	measured: (date: string) => string;
	byAuthor: string;
	mapHint: string;
	source: (date: string) => string;
	sendsFrom: (name: string, domain: string) => string;
	explain: Record<StatusKey, string>;
	cantonContext: (canton: string, p: string) => string;
	techDetails: string;
	otherDomains: string;
	noRua: string;
	noneSplit: (n: number) => string;
	deciding: string;
	inherited: (domain: string) => string;
	trendSince: (date: string, up: number, down: number) => string;
	correctionLog: string;
	noCorrections: string;
	statusShort: Record<StatusKey, string>;
	keyTitle: string;
	lead: (share: string, n: number, top: string, topP: string, bottom: string, bottomP: string) => string;
	basis: (known: number, total: number, bare: number) => string;
	why: string;
	mapSub: string;
	sourceLine: string;
	cantonsPara: string;
	changePara: (date: string, up: number, fromNone: number, down: number, bare0: number, bare1: number) => string;
	goalTitle: string;
	goalPara: string;
	goalLink: string;
	methodNote: (n: number) => string;
	dmarcRecord: string;
	foundAt: string;
	inheritedFrom: string;
	mxLabel: string;
	noMx: string;
	nullMx: string;
	spfRecord: string;
	dkimNote: string;
	queried: (date: string) => string;
	from: (date: string) => string;
	since: (date: string) => string;
};

const de: Dict = {
	site: 'DMARC-Monitor Schweizer Gemeinden',
	tagline: 'Wie gut schützen Schweizer Gemeinden ihre Absenderadresse vor Fälschungen?',
	mapTitle: 'Schutz der Absenderadresse (DMARC)',
	status: {
		blocked: 'Richtlinie: ablehnen',
		filtered: 'Richtlinie: Quarantäne',
		monitoring: 'Nur Überwachung',
		none: 'Kein wirksames DMARC',
		unknown: 'Keine Daten'
	},
	nav: { overview: 'Übersicht', guide: 'Verbessern', method: 'Methode' },
	headline: 'der Gemeinden blockieren oder filtern gefälschte Mails',
	headlineSub: (n, t) => `${n} von ${t} Gemeinden mit auswertbaren Daten`,
	noDmarc: (p) => `${p} haben gar kein DMARC`,
	monitoringOnly: (p) => `${p} überwachen nur`,
	unknownNote: (n) => `${n} Gemeinden ohne auswertbare Daten (keine Website oder DNS-Fehler) sind nicht mitgezählt.`,
	enforcing: 'Ablehnen oder Quarantäne',
	enforcingShare: 'Ablehnen oder Quarantäne',
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
	legendShare: 'Anteil der Gemeinden mit Richtlinie «ablehnen» oder «Quarantäne»',
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
	footerBuilt: 'Ein Projekt des Autors von Marcan (Open-Source-DMARC-Werkzeug). Mit keiner Behörde verbunden. Methode, Code und Daten sind öffentlich.',
	footerCorrections: 'Korrekturen melden',
	tableView: 'Als Tabelle',
	kicker: (d) => `DMARC-Monitor · Stand ${d}`,
	title: (x) => (x < 0.5 ? 'Weniger als die Hälfte der Gemeinden verlangt, gefälschte Mails zu stoppen' : 'Mehr als die Hälfte der Gemeinden verlangt, gefälschte Mails zu stoppen'),
	dek: (t, tp, b, bp, m) => `Zwischen den Kantonen liegen Welten: In ${t} veröffentlichen ${tp} der Gemeinden eine Richtlinie, die gefälschte Mails abweist oder filtert, in ${b} sind es ${bp}. Weitere ${m} haben einen DMARC-Eintrag mit Berichten, aber ohne Durchsetzung; für sie ist das der nächste Schritt.`,
	firstStep: (n, p) => `${n} Gemeinden (${p}) haben einen DMARC-Eintrag mit Berichten, aber ohne Durchsetzung. Für sie ist die Durchsetzung der nächste Schritt.`,
	rankTitle: 'Grosse Unterschiede zwischen den Kantonen',
	rankSub: 'Gemeinden nach Einstufung, Kantone sortiert nach dem Anteil mit «ablehnen» oder «Quarantäne». Linie: Schweiz.',
	average: (p) => `Schweiz ${p}`,
	smallN: 'Weniger als 10 Gemeinden: Anteile schwanken stark.',
	mapLocator: 'Auf der Karte',
	aboutTitle: 'Über diese Daten',
	aboutBody: (d, n) => `Gemessen am ${d}: die öffentlichen DNS-Einträge (DMARC, SPF, MX) aller ${n} Gemeinden. Wir fragen nur öffentliche DNS-Resolver ab. Es werden keine Mails verschickt, und wir kontaktieren keine Server der Gemeinden.`,
	aboutMethod: 'So wird gemessen',
	rank: (r, n) => `Rang ${r} von ${n}`,
	vsNational: (p) => `Schweiz: ${p}`,
	domain: 'Domain',
	mailDomain: 'Maildomain',
	otherDomain: 'Weitere Domain',
	counts: 'zählt',
	weakestNote: 'Es zählt die am schwächsten geschützte Domain: Mit jeder lässt sich eine Mail im Namen der Gemeinde fälschen.',
	measured: (d) => `Gemessen am ${d} aus öffentlichen DNS-Einträgen`,
	byAuthor: 'Vom Autor von',
	mapHint: 'Fahren Sie über eine Gemeinde oder tippen Sie darauf.',
	source: (d) => `Quelle: eigene Messung der DNS-Einträge, ${d}.`,
	sendsFrom: (n, d) => `Die Mailadressen von ${n} enden auf @${d}.`,
	explain: {
		blocked: 'Die Gemeinde fordert Mailanbieter auf, gefälschte Mails mit diesem Absender abzuweisen.',
		filtered: 'Die Gemeinde fordert Mailanbieter auf, gefälschte Mails mit diesem Absender in den Spam-Ordner zu legen.',
		monitoring: 'Gefälschte Mails werden weiterhin zugestellt. Die Gemeinde erhält aber Berichte darüber, wer in ihrem Namen Mails verschickt.',
		none: 'Die Gemeinde gibt Mailanbietern keine Anweisung, was mit gefälschten Mails in ihrem Namen geschehen soll.',
		unknown: 'Für diese Domain liegen keine auswertbaren Daten vor.'
	},
	cantonContext: (c, p) => `Im Kanton ${c} veröffentlichen ${p} der Gemeinden eine Richtlinie «ablehnen» oder «Quarantäne».`,
	techDetails: 'Technische Details',
	otherDomains: 'Weitere Domains der Gemeinde',
	noRua: 'Der Eintrag (p=none) enthält keine Berichtsadresse: Er verlangt nichts und liefert niemandem Berichte. Deshalb gilt er hier als «Kein wirksames DMARC».',
	noneSplit: (n) => `davon ${n} mit p=none ohne Berichtsadresse`,
	deciding: 'Massgebend',
	inherited: (d) => `Die Gemeinde hat keinen eigenen Eintrag; es gilt jener der Kantonsdomain ${d}.`,
	trendSince: (d, up, down) => `Seit dem ${d} haben ${up} Gemeinden ihre Einstufung verbessert, ${down} verschlechtert.`,
	correctionLog: 'Korrekturprotokoll',
	noCorrections: 'Bisher wurden keine Korrekturen gemeldet.',
	statusShort: { blocked: 'Ablehnen', filtered: 'Quarantäne', monitoring: 'Nur Überwachung', none: 'Kein wirksames DMARC', unknown: 'Keine Daten' },
	keyTitle: 'DMARC-Einstufung der Gemeinden',
	lead: (s, n, t, tp, b, bp) => `${s} der Schweizer Gemeinden fordern Mailanbieter auf, gefälschte Mails in ihrem Namen abzuweisen oder in den Spam-Ordner zu legen. Die Kantone unterscheiden sich stark: In ${t} sind es ${tp}, in ${b} ${bp}.`,
	basis: (k, t, b) => `Die Prozente beziehen sich auf die ${k} von ${t} Gemeinden, für die Daten vorliegen. Zu «Kein wirksames DMARC» zählen auch ${b} Gemeinden mit einem Eintrag, der nichts bewirkt (p=none ohne Berichtsadresse).`,
	why: 'Gemeinden verschicken Rechnungen, Steuerunterlagen und Abstimmungsinformationen per Mail. Wer ihre Absenderadresse fälscht, kann damit glaubwürdige Betrugsmails verschicken. Dagegen gibt es seit 2015 einen Standard namens DMARC. Die Gemeinde hinterlegt dafür im DNS ihrer Domain einen kurzen Eintrag. Darin steht, was Mailanbieter mit gefälschten Mails in ihrem Namen tun sollen: abweisen, in den Spam-Ordner legen oder zustellen und der Gemeinde melden.',
	mapSub: 'Jede Fläche ist eine Gemeinde. Fahren Sie darüber oder tippen Sie darauf, um Name, Domain und Einstufung zu sehen.',
	sourceLine: 'Quelle: eigene Messung der öffentlichen DNS-Einträge.',
	cantonsPara: 'Auf der Karte zeichnen sich die Kantonsgrenzen ab. Viele Gemeinden lassen ihre Domains von einem gemeinsamen Informatikdienstleister oder vom Kanton verwalten. Wo dieser DMARC eingerichtet hat, sind meist alle seine Gemeinden geschützt, wo nicht, meist keine.',
	changePara: (d, up, fromNone, down, b0, b1) => `Seit der ersten Messung am ${d} haben ${up} Gemeinden nachgebessert; ${fromNone} davon hatten vorher kein wirksames DMARC. ${down < 13 ? ['Keine', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn', 'Elf', 'Zwölf'][down] : down} ${down === 1 || down === 0 ? 'hat' : 'haben'} sich verschlechtert.${b1 > b0 ? ` Ausserdem haben ${b1 - b0} Gemeinden in dieser Zeit einen DMARC-Eintrag veröffentlicht, der nichts bewirkt: Er verlangt nichts und liefert niemandem Berichte. Sie zählen weiterhin zu «Kein wirksames DMARC».` : ''}`,
	goalTitle: 'Was die Gemeinden tun können',
	goalPara: 'Domains, die keine Mails verschicken, etwa jene der Website, können sofort auf «ablehnen» gestellt werden. Für die Maildomain veröffentlicht die Gemeinde zuerst einen Eintrag mit Berichtsadresse. Nach einigen Wochen zeigen die Berichte, welche Dienste in ihrem Namen Mails verschicken, etwa der Newsletter oder die Gemeindesoftware. Sind alle korrekt eingerichtet, stellt sie auf «Quarantäne» und dann auf «ablehnen» um.',
	goalLink: 'Anleitung für Gemeinden und IT-Dienstleister',
	methodNote: (n) => `Gemessen wurden die öffentlichen DNS-Einträge (DMARC, SPF, MX) aller ${n} Gemeinden. Abgefragt werden nur öffentliche DNS-Resolver; wir verschicken keine Mails. Die Messung wird in unregelmässigen Abständen wiederholt.`,
	dmarcRecord: 'DMARC-Eintrag',
	foundAt: 'unter',
	inheritedFrom: 'übernommen von',
	mxLabel: 'Mailserver (MX)',
	noMx: 'keine',
	nullMx: 'Null-MX (nimmt keine Mails an)',
	spfRecord: 'SPF-Eintrag',
	dkimNote: 'DKIM ist nicht erfasst: Die Schlüssel lassen sich nur abfragen, wenn man ihren Namen kennt.',
	queried: (d) => `Öffentliche DNS-Einträge, Stand ${d}.`,
	from: (d) => `Ab ${d}`,
	since: (d) => `Seit ${d}`,
};

const fr: Dict = {
	site: 'Moniteur DMARC des communes suisses',
	tagline: 'Dans quelle mesure les communes suisses protègent-elles leur adresse d’expéditeur contre l’usurpation ?',
	mapTitle: 'Protection de l’adresse d’expéditeur (DMARC)',
	status: {
		blocked: 'Politique : rejet',
		filtered: 'Politique : quarantaine',
		monitoring: 'Surveillance seule',
		none: 'Pas de DMARC effectif',
		unknown: 'Pas de données'
	},
	nav: { overview: 'Aperçu', guide: 'Améliorer', method: 'Méthode' },
	headline: 'des communes bloquent ou filtrent les e-mails usurpés',
	headlineSub: (n, t) => `${n} sur ${t} communes avec des données exploitables`,
	noDmarc: (p) => `${p} n’ont aucun DMARC`,
	monitoringOnly: (p) => `${p} surveillent seulement`,
	unknownNote: (n) => `${n} communes sans données exploitables (pas de site web ou erreur DNS) ne sont pas comptées.`,
	enforcing: 'Rejet ou quarantaine',
	enforcingShare: 'Rejet ou quarantaine',
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
	legendShare: 'Part des communes avec une politique de rejet ou de quarantaine',
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
	footerBuilt: 'Un projet de l’auteur de Marcan (outil DMARC open source). Sans lien avec une autorité. Méthode, code et données sont publics.',
	footerCorrections: 'Signaler une correction',
	tableView: 'En tableau',
	kicker: (d) => `Moniteur DMARC · état au ${d}`,
	title: (x) => (x < 0.5 ? 'Moins de la moitié des communes demandent de bloquer les e-mails usurpés' : 'Plus de la moitié des communes demandent de bloquer les e-mails usurpés'),
	dek: (t, tp, b, bp, m) => `D’un canton à l’autre, l’écart est énorme. ${t} : ${tp} des communes publient une politique qui rejette ou filtre les e-mails usurpant leur adresse. ${b} : ${bp}. ${m} des communes ont un enregistrement DMARC avec rapports mais sans application ; c’est leur prochaine étape.`,
	firstStep: (n, p) => `${n} communes (${p}) ont un enregistrement DMARC avec rapports mais sans application. Pour elles, l’application est la prochaine étape.`,
	rankTitle: 'De grandes différences entre les cantons',
	rankSub: 'Communes selon leur évaluation, cantons triés par la part avec rejet ou quarantaine. Ligne : Suisse.',
	average: (p) => `Suisse ${p}`,
	smallN: 'Moins de 10 communes : les parts varient fortement.',
	mapLocator: 'Sur la carte',
	aboutTitle: 'À propos de ces données',
	aboutBody: (d, n) => `Mesuré le ${d} : les enregistrements DNS publics (DMARC, SPF, MX) des ${n} communes. Nous interrogeons uniquement des résolveurs DNS publics. Aucun e-mail n’est envoyé et nous ne contactons aucun serveur communal.`,
	aboutMethod: 'Méthode de mesure',
	rank: (r, n) => `Rang ${r} sur ${n}`,
	vsNational: (p) => `Suisse : ${p}`,
	domain: 'Domaine',
	mailDomain: 'Domaine mail',
	otherDomain: 'Autre domaine',
	counts: 'compte',
	weakestNote: 'C’est le domaine le moins protégé qui compte : chacun permet de falsifier un e-mail au nom de la commune.',
	measured: (d) => `Mesuré le ${d} à partir d’enregistrements DNS publics`,
	byAuthor: 'Par l’auteur de',
	mapHint: 'Survolez ou touchez une commune.',
	source: (d) => `Source : mesure propre des enregistrements DNS, ${d}.`,
	sendsFrom: (n, d) => `Les adresses e-mail de ${n} se terminent par @${d}.`,
	explain: {
		blocked: 'La commune demande aux fournisseurs de messagerie de rejeter les faux e-mails portant cet expéditeur.',
		filtered: 'La commune demande aux fournisseurs de messagerie de placer dans les spams les faux e-mails portant cet expéditeur.',
		monitoring: 'Les faux e-mails sont toujours distribués, mais la commune reçoit des rapports indiquant qui envoie des e-mails en son nom.',
		none: 'La commune ne donne aux fournisseurs de messagerie aucune instruction sur les faux e-mails envoyés en son nom.',
		unknown: 'Aucune donnée exploitable pour ce domaine.'
	},
	cantonContext: (c, p) => `Canton ${c} : ${p} des communes publient une politique de rejet ou de quarantaine.`,
	techDetails: 'Détails techniques',
	otherDomains: 'Autres domaines de la commune',
	noRua: 'L’enregistrement (p=none) n’a pas d’adresse de rapport : il ne demande rien et n’envoie de rapports à personne. Il compte donc comme « Pas de DMARC effectif ».',
	noneSplit: (n) => `dont ${n} avec un enregistrement p=none sans adresse de rapport`,
	deciding: 'Déterminant',
	inherited: (d) => `La commune n’a pas d’enregistrement propre ; c’est celui du domaine cantonal ${d} qui s’applique.`,
	trendSince: (d, up, down) => `Depuis le ${d}, ${up} communes ont amélioré leur évaluation et ${down} ont reculé.`,
	correctionLog: 'Journal des corrections',
	noCorrections: 'Aucune correction signalée jusqu’ici.',
	statusShort: { blocked: 'Rejet', filtered: 'Quarantaine', monitoring: 'Surveillance seule', none: 'Pas de DMARC effectif', unknown: 'Pas de données' },
	keyTitle: 'Classement DMARC des communes',
	lead: (s, n, t, tp, b, bp) => `${s} des communes suisses demandent aux fournisseurs de messagerie de rejeter les faux e-mails envoyés en leur nom ou de les placer dans les spams. Les écarts entre cantons sont grands : ${t} atteint ${tp}, ${b} seulement ${bp}.`,
	basis: (k, t, b) => `Les parts portent sur les ${k} des ${t} communes pour lesquelles des données existent. « Pas de DMARC effectif » comprend aussi ${b} communes dont l’enregistrement ne produit aucun effet (p=none sans adresse de rapport).`,
	why: 'Les communes envoient par e-mail des factures, des documents fiscaux et des informations de vote. Qui usurpe leur adresse d’expéditeur peut envoyer des e-mails frauduleux crédibles. Une norme existe contre cela depuis 2015 : DMARC. La commune place un court enregistrement dans le DNS de son domaine. Il indique aux fournisseurs de messagerie que faire des e-mails qui usurpent son adresse : les rejeter, les placer dans les spams ou les distribuer en le lui signalant.',
	mapSub: 'Chaque surface est une commune. Survolez-la ou touchez-la pour voir son nom, son domaine et son classement.',
	sourceLine: 'Source : mesure propre des enregistrements DNS publics.',
	cantonsPara: 'Sur la carte, les frontières cantonales se dessinent. Beaucoup de communes confient leurs domaines à un prestataire informatique commun ou au canton. Là où celui-ci a configuré DMARC, ses communes sont généralement toutes protégées ; sinon, généralement aucune.',
	changePara: (d, up, fromNone, down, b0, b1) => `Depuis la première mesure du ${d}, ${up} communes se sont améliorées ; ${fromNone} d’entre elles n’avaient auparavant aucun DMARC effectif. ${down === 1 ? 'Une a reculé.' : down ? `${down} ont reculé.` : 'Aucune n’a reculé.'}${b1 > b0 ? ` Dans le même temps, ${b1 - b0} communes de plus ont publié un enregistrement DMARC qui ne produit aucun effet : il ne demande rien et n’envoie de rapports à personne. Elles restent classées « Pas de DMARC effectif ».` : ''}`,
	goalTitle: 'Ce que les communes peuvent faire',
	goalPara: 'Les domaines qui n’envoient pas d’e-mails, comme celui du site web, peuvent passer tout de suite au rejet. Pour son domaine mail, la commune publie d’abord un enregistrement avec adresse de rapport. Après quelques semaines, les rapports montrent quels services envoient des e-mails en son nom, par exemple la newsletter ou le logiciel communal. Une fois tous correctement configurés, elle passe à la quarantaine, puis au rejet.',
	goalLink: 'Guide pour les communes et les prestataires informatiques',
	methodNote: (n) => `Nous avons relevé les enregistrements DNS publics (DMARC, SPF, MX) des ${n} communes. Seuls des résolveurs DNS publics sont interrogés ; aucun e-mail n’est envoyé. La mesure est répétée à intervalles irréguliers.`,
	dmarcRecord: 'Enregistrement DMARC',
	foundAt: 'sous',
	inheritedFrom: 'repris de',
	mxLabel: 'Serveurs de messagerie (MX)',
	noMx: 'aucun',
	nullMx: 'MX nul (n’accepte pas d’e-mails)',
	spfRecord: 'Enregistrement SPF',
	dkimNote: 'DKIM n’est pas relevé : les clés ne peuvent être interrogées que si l’on connaît leur nom.',
	queried: (d) => `Enregistrements DNS publics, état au ${d}.`,
	from: (d) => `À partir du ${d}`,
	since: (d) => `Depuis le ${d}`,
};

const it: Dict = {
	site: 'Monitor DMARC dei comuni svizzeri',
	tagline: 'Quanto bene i comuni svizzeri proteggono il loro indirizzo mittente dalle falsificazioni?',
	mapTitle: 'Protezione dell’indirizzo del mittente (DMARC)',
	status: {
		blocked: 'Politica: rifiuto',
		filtered: 'Politica: quarantena',
		monitoring: 'Solo monitoraggio',
		none: 'Nessun DMARC efficace',
		unknown: 'Nessun dato'
	},
	nav: { overview: 'Panoramica', guide: 'Migliorare', method: 'Metodo' },
	headline: 'dei comuni blocca o filtra le e-mail falsificate',
	headlineSub: (n, t) => `${n} su ${t} comuni con dati utilizzabili`,
	noDmarc: (p) => `il ${p} non ha alcun DMARC`,
	monitoringOnly: (p) => `il ${p} si limita al monitoraggio`,
	unknownNote: (n) => `${n} comuni senza dati utilizzabili (nessun sito web o errore DNS) non sono conteggiati.`,
	enforcing: 'Rifiuto o quarantena',
	enforcingShare: 'Rifiuto o quarantena',
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
	legendShare: 'Quota dei comuni con una politica di rifiuto o quarantena',
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
	footerBuilt: 'Un progetto dell’autore di Marcan (strumento DMARC open source). Senza legami con alcuna autorità. Metodo, codice e dati sono pubblici.',
	footerCorrections: 'Segnala una correzione',
	tableView: 'Come tabella',
	kicker: (d) => `Monitor DMARC · stato al ${d}`,
	title: (x) => (x < 0.5 ? 'Meno della metà dei comuni chiede di fermare le e-mail falsificate' : 'Più della metà dei comuni chiede di fermare le e-mail falsificate'),
	dek: (t, tp, b, bp, m) => `Tra i cantoni c’è un abisso. ${t}: il ${tp} dei comuni pubblica una politica che respinge o filtra le e-mail che ne falsificano l’indirizzo. ${b}: il ${bp}. Un altro ${m} dei comuni ha un record DMARC con rapporti ma senza applicazione; per loro è il prossimo passo.`,
	firstStep: (n, p) => `${n} comuni (${p}) hanno un record DMARC con rapporti ma senza applicazione. Per loro l’applicazione è il prossimo passo.`,
	rankTitle: 'Grandi differenze tra i cantoni',
	rankSub: 'Comuni secondo la valutazione, cantoni ordinati per la quota con rifiuto o quarantena. Linea: Svizzera.',
	average: (p) => `Svizzera ${p}`,
	smallN: 'Meno di 10 comuni: le quote variano molto.',
	mapLocator: 'Sulla carta',
	aboutTitle: 'Su questi dati',
	aboutBody: (d, n) => `Misurato il ${d}: i record DNS pubblici (DMARC, SPF, MX) di tutti i ${n} comuni. Interroghiamo solo resolver DNS pubblici. Non viene inviata alcuna e-mail e non contattiamo alcun server comunale.`,
	aboutMethod: 'Come misuriamo',
	rank: (r, n) => `${r}° su ${n}`,
	vsNational: (p) => `Svizzera: ${p}`,
	domain: 'Dominio',
	mailDomain: 'Dominio mail',
	otherDomain: 'Altro dominio',
	counts: 'conta',
	weakestNote: 'Conta il dominio meno protetto: con ognuno si può falsificare un’e-mail a nome del comune.',
	measured: (d) => `Misurato il ${d} da record DNS pubblici`,
	byAuthor: 'Dall’autore di',
	mapHint: 'Passate sopra o toccate un comune.',
	source: (d) => `Fonte: misurazione propria dei record DNS, ${d}.`,
	sendsFrom: (n, d) => `Gli indirizzi e-mail di ${n} terminano con @${d}.`,
	explain: {
		blocked: 'Il comune chiede ai provider di posta di respingere le e-mail false con questo mittente.',
		filtered: 'Il comune chiede ai provider di posta di mettere nello spam le e-mail false con questo mittente.',
		monitoring: 'Le e-mail false vengono ancora recapitate, ma il comune riceve rapporti su chi invia e-mail a suo nome.',
		none: 'Il comune non dà ai provider di posta alcuna istruzione su cosa fare con le e-mail false inviate a suo nome.',
		unknown: 'Nessun dato utilizzabile per questo dominio.'
	},
	cantonContext: (c, p) => `Canton ${c}: il ${p} dei comuni pubblica una politica di rifiuto o quarantena.`,
	techDetails: 'Dettagli tecnici',
	otherDomains: 'Altri domini del comune',
	noRua: 'Il record (p=none) non ha un indirizzo per i rapporti: non chiede nulla e non invia rapporti a nessuno. Conta quindi come «Nessun DMARC efficace».',
	noneSplit: (n) => `di cui ${n} con un record p=none senza indirizzo per i rapporti`,
	deciding: 'Determinante',
	inherited: (d) => `Il comune non ha un record proprio; vale quello del dominio cantonale ${d}.`,
	trendSince: (d, up, down) => `Dal ${d}, ${up} comuni hanno migliorato la loro valutazione e ${down} sono peggiorati.`,
	correctionLog: 'Registro delle correzioni',
	noCorrections: 'Finora non è stata segnalata alcuna correzione.',
	statusShort: { blocked: 'Rifiuto', filtered: 'Quarantena', monitoring: 'Solo monitoraggio', none: 'Nessun DMARC efficace', unknown: 'Nessun dato' },
	keyTitle: 'Classificazione DMARC dei comuni',
	lead: (s, n, t, tp, b, bp) => `Il ${s} dei comuni svizzeri chiede ai provider di posta di respingere le e-mail false inviate a suo nome o di metterle nello spam. I cantoni sono molto diversi: ${t} raggiunge il ${tp}, ${b} solo il ${bp}.`,
	basis: (k, t, b) => `Le quote si riferiscono ai ${k} dei ${t} comuni per cui ci sono dati. «Nessun DMARC efficace» comprende anche ${b} comuni con un record che non ha alcun effetto (p=none senza indirizzo per i rapporti).`,
	why: 'I comuni inviano per e-mail fatture, documenti fiscali e informazioni di voto. Chi ne falsifica l’indirizzo del mittente può inviare e-mail fraudolente credibili. Contro questo esiste dal 2015 uno standard: DMARC. Il comune inserisce un breve record nel DNS del suo dominio. Vi si indica cosa devono fare i provider di posta con le e-mail che ne falsificano il mittente: respingerle, metterle nello spam o recapitarle segnalandolo al comune.',
	mapSub: 'Ogni superficie è un comune. Passateci sopra o toccatela per vedere nome, dominio e classificazione.',
	sourceLine: 'Fonte: misurazione propria dei record DNS pubblici.',
	cantonsPara: 'Sulla carta si riconoscono i confini cantonali. Molti comuni affidano i loro domini a un fornitore IT comune o al cantone. Dove questo ha configurato DMARC, di solito tutti i suoi comuni sono protetti; dove no, di solito nessuno.',
	changePara: (d, up, fromNone, down, b0, b1) => `Dalla prima misurazione del ${d}, ${up} comuni sono migliorati; ${fromNone} di questi prima non avevano alcun DMARC efficace. ${down === 1 ? 'Uno è peggiorato.' : down ? `${down} sono peggiorati.` : 'Nessuno è peggiorato.'}${b1 > b0 ? ` Nello stesso periodo, altri ${b1 - b0} comuni hanno pubblicato un record DMARC che non ha alcun effetto: non chiede nulla e non invia rapporti a nessuno. Restano classificati come «Nessun DMARC efficace».` : ''}`,
	goalTitle: 'Che cosa possono fare i comuni',
	goalPara: 'I domini che non inviano e-mail, come quello del sito web, possono passare subito al rifiuto. Per il dominio di posta il comune pubblica prima un record con indirizzo per i rapporti. Dopo alcune settimane i rapporti mostrano quali servizi inviano e-mail a suo nome, per esempio la newsletter o il software comunale. Quando sono tutti configurati correttamente, passa alla quarantena e poi al rifiuto.',
	goalLink: 'Guida per comuni e fornitori IT',
	methodNote: (n) => `Abbiamo rilevato i record DNS pubblici (DMARC, SPF, MX) di tutti i ${n} comuni. Vengono interrogati solo resolver DNS pubblici; non viene inviata alcuna e-mail. La misurazione è ripetuta a intervalli irregolari.`,
	dmarcRecord: 'Record DMARC',
	foundAt: 'sotto',
	inheritedFrom: 'ripreso da',
	mxLabel: 'Server di posta (MX)',
	noMx: 'nessuno',
	nullMx: 'MX nullo (non accetta e-mail)',
	spfRecord: 'Record SPF',
	dkimNote: 'DKIM non è rilevato: le chiavi si possono interrogare solo conoscendone il nome.',
	queried: (d) => `Record DNS pubblici, stato al ${d}.`,
	from: (d) => `Dal ${d}`,
	since: (d) => `Dal ${d}`,
};

const en: Dict = {
	site: 'DMARC Monitor for Swiss Municipalities',
	tagline: 'How well do Swiss municipalities protect their sender address against spoofing?',
	mapTitle: 'Protection of the sender address (DMARC)',
	status: {
		blocked: 'Reject policy',
		filtered: 'Quarantine policy',
		monitoring: 'Monitoring only',
		none: 'No effective DMARC',
		unknown: 'No data'
	},
	nav: { overview: 'Overview', guide: 'Improve', method: 'Method' },
	headline: 'of municipalities block or filter spoofed mail',
	headlineSub: (n, t) => `${n} of ${t} municipalities with usable data`,
	noDmarc: (p) => `${p} have no DMARC at all`,
	monitoringOnly: (p) => `${p} only monitor`,
	unknownNote: (n) => `${n} municipalities without usable data (no website or a DNS error) are not counted.`,
	enforcing: 'Reject or quarantine',
	enforcingShare: 'Reject or quarantine',
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
	legendShare: 'Share of municipalities with a reject or quarantine policy',
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
	footerBuilt: 'A project by the author of Marcan (open-source DMARC tool). Not affiliated with any authority. Method, code and data are public.',
	footerCorrections: 'Report a correction',
	tableView: 'As a table',
	kicker: (d) => `DMARC Monitor · as of ${d}`,
	title: (x) => (x < 0.5 ? 'Fewer than half of Swiss municipalities ask mail servers to stop spoofed mail' : 'More than half of Swiss municipalities ask mail servers to stop spoofed mail'),
	dek: (t, tp, b, bp, m) => `The cantons are worlds apart: in ${t}, ${tp} of municipalities publish a policy that rejects or filters mail faking their address; in ${b}, ${bp}. Another ${m} have a DMARC record with reports but no enforcement; for them, enforcement is the next step.`,
	firstStep: (n, p) => `${n} municipalities (${p}) have a DMARC record with reports but no enforcement. For them, enforcement is the next step.`,
	rankTitle: 'Large differences between cantons',
	rankSub: 'Municipalities by rating, cantons sorted by the share with a reject or quarantine policy. Line: Switzerland.',
	average: (p) => `Switzerland ${p}`,
	smallN: 'Fewer than 10 municipalities: shares vary a lot.',
	mapLocator: 'On the map',
	aboutTitle: 'About this data',
	aboutBody: (d, n) => `Measured on ${d}: the public DNS records (DMARC, SPF, MX) of all ${n} municipalities. We query public DNS resolvers only. No mail is sent and no municipal server is contacted by us.`,
	aboutMethod: 'How it is measured',
	rank: (r, n) => `Rank ${r} of ${n}`,
	vsNational: (p) => `Switzerland: ${p}`,
	domain: 'Domain',
	mailDomain: 'Mail domain',
	otherDomain: 'Other domain',
	counts: 'counts',
	weakestNote: 'The least protected domain counts: each one can be used to forge mail in the municipality’s name.',
	measured: (d) => `Measured on ${d} from public DNS records`,
	byAuthor: 'By the author of',
	mapHint: 'Hover over or tap a municipality.',
	source: (d) => `Source: own measurement of DNS records, ${d}.`,
	sendsFrom: (n, d) => `Mail addresses of ${n} end in @${d}.`,
	explain: {
		blocked: 'The municipality asks mail providers to reject forged mail with this sender.',
		filtered: 'The municipality asks mail providers to put forged mail with this sender in the spam folder.',
		monitoring: 'Forged mail is still delivered, but the municipality receives reports on who sends mail in its name.',
		none: 'The municipality gives mail providers no instruction on what to do with forged mail in its name.',
		unknown: 'No usable data for this domain.'
	},
	cantonContext: (c, p) => `In ${c}, ${p} of municipalities publish a reject or quarantine policy.`,
	techDetails: 'Technical details',
	otherDomains: 'Other domains of the municipality',
	noRua: 'The record (p=none) has no report address: it asks for nothing and sends reports to nobody. It therefore counts as “No effective DMARC”.',
	noneSplit: (n) => `of these, ${n} have a p=none record without a report address`,
	deciding: 'Decides the rating',
	inherited: (d) => `The municipality has no record of its own; the record of the cantonal domain ${d} applies.`,
	trendSince: (d, up, down) => `Since ${d}, ${up} municipalities have improved their rating and ${down} have fallen back.`,
	correctionLog: 'Correction log',
	noCorrections: 'No corrections reported so far.',
	statusShort: { blocked: 'Reject', filtered: 'Quarantine', monitoring: 'Monitoring only', none: 'No effective DMARC', unknown: 'No data' },
	keyTitle: 'DMARC rating of the municipalities',
	lead: (s, n, t, tp, b, bp) => `${s} of Swiss municipalities ask mail providers to reject forged mail in their name or put it in the spam folder. The cantons differ widely: ${tp} in ${t}, ${bp} in ${b}.`,
	basis: (k, t, b) => `Percentages refer to the ${k} of ${t} municipalities with data. “No effective DMARC” includes ${b} municipalities whose record does nothing (p=none without a report address).`,
	why: 'Municipalities send bills, tax documents and voting information by email. Anyone who forges their sender address can send convincing fraudulent mail. A standard called DMARC has existed against this since 2015. A municipality places a short record in its domain’s DNS. It states what mail providers should do with forged mail in its name: reject it, put it in the spam folder, or deliver it and report it to the municipality.',
	mapSub: 'Each area is a municipality. Hover or tap to see its name, domain and rating.',
	sourceLine: 'Source: own measurement of public DNS records.',
	cantonsPara: 'Cantonal borders stand out on the map. Many municipalities have their domains run by a shared IT provider or by the canton. Where that provider has set up DMARC, usually all its municipalities are protected; where it has not, usually none are.',
	changePara: (d, up, fromNone, down, b0, b1) => `Since the first measurement on ${d}, ${up} municipalities have improved; ${fromNone} of them previously had no effective DMARC. ${down < 13 ? ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'][down] : down} got worse.${b1 > b0 ? ` In the same period, ${b1 - b0} more municipalities published a DMARC record that does nothing: it asks for nothing and sends reports to nobody. They still count as “No effective DMARC”.` : ''}`,
	goalTitle: 'What municipalities can do',
	goalPara: 'Domains that send no mail, such as the website’s, can be set to reject right away. For its mail domain, a municipality first publishes a record with a report address. After a few weeks, the reports show which services send mail in its name, such as the newsletter or the municipal software. Once all of them are set up correctly, it moves to quarantine and then to reject.',
	goalLink: 'Guide for municipalities and IT providers',
	methodNote: (n) => `We measured the public DNS records (DMARC, SPF, MX) of all ${n} municipalities. Only public DNS resolvers are queried; no mail is sent. The measurement is repeated at irregular intervals.`,
	dmarcRecord: 'DMARC record',
	foundAt: 'at',
	inheritedFrom: 'inherited from',
	mxLabel: 'Mail servers (MX)',
	noMx: 'none',
	nullMx: 'null MX (accepts no mail)',
	spfRecord: 'SPF record',
	dkimNote: 'DKIM is not covered: its keys can only be looked up if you know their names.',
	queried: (d) => `Public DNS records as of ${d}.`,
	from: (d) => `From ${d}`,
	since: (d) => `Since ${d}`,
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

/** Percent in running text: NZZ/SRF write the word out in German and Italian. */
export const pctText = (lang: Lang, x: number): string => {
	const n = Math.round(x * 100);
	return { de: `${n} Prozent`, fr: `${n} %`, it: `${n} per cento`, en: `${n} per cent` }[lang];
};
