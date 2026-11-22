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
	changePara: (date: string, up: number, down: number, bare0: number, bare1: number) => string;
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
	better: string;
	worse: string;
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
	weakestNote: 'Es zählt die am schwächsten geschützte Domain, denn mit jeder lassen sich Mails im Namen der Gemeinde fälschen.',
	measured: (d) => `Gemessen am ${d} aus öffentlichen DNS-Einträgen`,
	byAuthor: 'Vom Autor von',
	mapHint: 'Fahren Sie über eine Gemeinde oder tippen Sie darauf.',
	source: (d) => `Quelle: eigene Messung der DNS-Einträge, ${d}.`,
	sendsFrom: (n, d) => `${n} verschickt Mails von ${d}.`,
	explain: {
		blocked: 'Die Richtlinie verlangt von empfangenden Servern, gefälschte Mails mit diesem Absender abzuweisen.',
		filtered: 'Die Richtlinie verlangt von empfangenden Servern, gefälschte Mails mit diesem Absender als Spam zu behandeln.',
		monitoring: 'Der Eintrag verlangt keine Massnahme; die Gemeinde erhält Berichte über Mails, die in ihrem Namen verschickt werden.',
		none: 'Empfangende Server erhalten keine Anweisung, gefälschte Mails mit diesem Absender aufzuhalten.',
		unknown: 'Für diese Domain liegen keine auswertbaren Daten vor.'
	},
	cantonContext: (c, p) => `Im Kanton ${c} veröffentlichen ${p} der Gemeinden eine Richtlinie «ablehnen» oder «Quarantäne».`,
	techDetails: 'Technische Details',
	otherDomains: 'Weitere Domains der Gemeinde',
	noRua: 'Der Eintrag p=none hat keine Berichtsadresse (rua): Er verlangt keine Massnahme, und niemand erhält Berichte. Er zählt deshalb als «Kein wirksames DMARC».',
	noneSplit: (n) => `davon ${n} mit p=none ohne Berichtsadresse`,
	deciding: 'Massgebend',
	inherited: (d) => `Eintrag der kantonalen Domain ${d}, vom Kanton gesetzt.`,
	trendSince: (d, up, down) => `Seit dem ${d} haben ${up} Gemeinden ihre Einstufung verbessert, ${down} verschlechtert.`,
	correctionLog: 'Korrekturprotokoll',
	noCorrections: 'Bisher wurden keine Korrekturen gemeldet.',
	statusShort: { blocked: 'Ablehnen', filtered: 'Quarantäne', monitoring: 'Nur Überwachung', none: 'Kein wirksames DMARC', unknown: 'Keine Daten' },
	keyTitle: 'DMARC-Einstufung der Gemeinden',
	lead: (s, n, t, tp, b, bp) => `${s} der Schweizer Gemeinden veröffentlichen eine Richtlinie, die empfangende Mailserver anweist, gefälschte Mails mit ihrem Absender abzuweisen oder als Spam zu behandeln. Zwischen den Kantonen sind die Unterschiede gross: In ${t} sind es ${tp}, in ${b} ${bp}.`,
	basis: (k, t, b) => `Anteile bezogen auf ${k} von ${t} Gemeinden mit auswertbaren Daten. «Kein wirksames DMARC» umfasst ${b} Gemeinden mit einem Eintrag p=none ohne Berichtsadresse.`,
	why: 'Gemeinden verschicken Rechnungen, Steuerunterlagen und Abstimmungsinformationen per Mail. Wer ihre Absenderadresse fälscht, kann damit glaubwürdige Betrugsmails versenden. DMARC ist ein öffentlicher DNS-Eintrag, mit dem eine Domain empfangenden Mailservern mitteilt, was mit solchen Fälschungen geschehen soll: abweisen, als Spam behandeln oder bloss melden.',
	mapSub: 'Jede Fläche ist eine Gemeinde. Name, Domain und Einstufung erscheinen beim Darüberfahren oder Antippen.',
	sourceLine: 'Quelle: eigene Messung der öffentlichen DNS-Einträge.',
	cantonsPara: 'Wie gut eine Gemeinde geschützt ist, hängt oft davon ab, wer ihre Domains betreut. Viele Gemeinden teilen sich einen IT-Dienstleister oder die kantonale Informatik. Hat dieser DMARC eingerichtet, sind häufig alle seine Gemeinden geschützt; hat er es nicht, keine.',
	changePara: (d, up, down, b0, b1) => `Seit der ersten Messung am ${d} haben ${up} Gemeinden ihre Einstufung verbessert, ${down} verschlechtert. Im gleichen Zeitraum stieg die Zahl der Gemeinden mit einem DMARC-Eintrag ohne Berichtsadresse von ${b0} auf ${b1}. Ein solcher Eintrag verlangt keine Massnahme und liefert niemandem Berichte; er gilt hier deshalb nicht als wirksam.`,
	goalTitle: 'Was es bräuchte',
	goalPara: 'Das Ziel ist für alle Gemeinden dasselbe: die Richtlinie «ablehnen» auf jeder Domain, auch auf jenen, die nur für die Website dienen und keine Mails verschicken. Der Weg dorthin führt über einen Eintrag mit Berichtsadresse, einige Wochen Auswertung und dann die Umstellung auf «Quarantäne» und «ablehnen». Beim IT-Dienstleister lässt sich das oft für viele Gemeinden zugleich erledigen.',
	goalLink: 'Anleitung für Gemeinden und IT-Dienstleister',
	methodNote: (n) => `Erfasst sind die öffentlichen DNS-Einträge (DMARC, SPF, MX) aller ${n} Gemeinden, abgefragt über öffentliche DNS-Resolver. Es werden keine Mails verschickt und keine Server der Gemeinden kontaktiert. Die Messung wird wiederholt; bestätigte Korrekturen fliessen jeweils ein.`,
	dmarcRecord: 'DMARC-Eintrag',
	foundAt: 'unter',
	inheritedFrom: 'übernommen von',
	mxLabel: 'Mailserver (MX)',
	noMx: 'keine',
	nullMx: 'Null-MX (nimmt keine Mails an)',
	spfRecord: 'SPF-Eintrag',
	dkimNote: 'DKIM ist nicht erfasst: Die Schlüssel lassen sich nur abfragen, wenn man ihren Namen kennt.',
	queried: (d) => `Öffentliche DNS-Einträge, Stand ${d}.`,
	better: 'besser als zuvor',
	worse: 'schlechter als zuvor',
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
	weakestNote: 'C’est le domaine le moins protégé qui compte, car chacun permet d’envoyer de faux e-mails au nom de la commune.',
	measured: (d) => `Mesuré le ${d} à partir d’enregistrements DNS publics`,
	byAuthor: 'Par l’auteur de',
	mapHint: 'Survolez ou touchez une commune.',
	source: (d) => `Source : mesure propre des enregistrements DNS, ${d}.`,
	sendsFrom: (n, d) => `${n} envoie ses e-mails depuis ${d}.`,
	explain: {
		blocked: 'La politique demande aux serveurs destinataires de rejeter les e-mails usurpant cet expéditeur.',
		filtered: 'La politique demande aux serveurs destinataires de classer en spam les e-mails usurpant cet expéditeur.',
		monitoring: 'L’enregistrement ne demande aucune mesure ; la commune reçoit des rapports sur les e-mails envoyés en son nom.',
		none: 'Les serveurs destinataires ne reçoivent aucune instruction pour arrêter les e-mails usurpant cet expéditeur.',
		unknown: 'Aucune donnée exploitable pour ce domaine.'
	},
	cantonContext: (c, p) => `Canton ${c} : ${p} des communes publient une politique de rejet ou de quarantaine.`,
	techDetails: 'Détails techniques',
	otherDomains: 'Autres domaines de la commune',
	noRua: 'L’enregistrement p=none n’a pas d’adresse de rapport (rua) : il ne demande aucune mesure et personne ne reçoit de rapports. Il compte donc comme « Pas de DMARC effectif ».',
	noneSplit: (n) => `dont ${n} avec un enregistrement p=none sans adresse de rapport`,
	deciding: 'Déterminant',
	inherited: (d) => `Enregistrement du domaine cantonal ${d}, fixé par le canton.`,
	trendSince: (d, up, down) => `Depuis le ${d}, ${up} communes ont amélioré leur évaluation et ${down} ont reculé.`,
	correctionLog: 'Journal des corrections',
	noCorrections: 'Aucune correction signalée jusqu’ici.',
	statusShort: { blocked: 'Rejet', filtered: 'Quarantaine', monitoring: 'Surveillance seule', none: 'Pas de DMARC effectif', unknown: 'Pas de données' },
	keyTitle: 'Classement DMARC des communes',
	lead: (s, n, t, tp, b, bp) => `${s} des communes suisses publient une politique qui demande aux serveurs destinataires de rejeter les e-mails usurpant leur adresse ou de les classer en spam. Les écarts entre cantons sont importants : ${t} atteint ${tp}, ${b} ${bp}.`,
	basis: (k, t, b) => `Parts calculées sur ${k} des ${t} communes disposant de données exploitables. « Pas de DMARC effectif » comprend ${b} communes avec un enregistrement p=none sans adresse de rapport.`,
	why: 'Les communes envoient par e-mail des factures, des documents fiscaux et des informations de vote. Qui usurpe leur adresse d’expéditeur peut envoyer des e-mails frauduleux crédibles. DMARC est un enregistrement DNS public par lequel un domaine indique aux serveurs destinataires ce qu’ils doivent faire de ces faux : les rejeter, les classer en spam ou seulement les signaler.',
	mapSub: 'Chaque surface est une commune. Le nom, le domaine et le classement s’affichent au survol ou au toucher.',
	sourceLine: 'Source : mesure propre des enregistrements DNS publics.',
	cantonsPara: 'Le niveau de protection d’une commune dépend souvent de qui gère ses domaines. Beaucoup de communes partagent un prestataire informatique ou l’informatique cantonale. Si celui-ci a configuré DMARC, souvent toutes ses communes sont protégées ; sinon, aucune.',
	changePara: (d, up, down, b0, b1) => `Depuis la première mesure du ${d}, ${up} communes ont amélioré leur classement et ${down} ont reculé. Dans le même temps, le nombre de communes avec un enregistrement DMARC sans adresse de rapport est passé de ${b0} à ${b1}. Un tel enregistrement ne demande aucune mesure et ne fournit de rapports à personne ; il n’est donc pas considéré comme effectif ici.`,
	goalTitle: 'Ce qu’il faudrait',
	goalPara: 'L’objectif est le même pour toutes les communes : la politique « rejet » sur chaque domaine, y compris ceux qui ne servent qu’au site web et n’envoient pas d’e-mails. Le chemin passe par un enregistrement avec adresse de rapport, quelques semaines d’analyse, puis le passage à « quarantaine » et « rejet ». Chez le prestataire informatique, cela peut souvent se faire pour de nombreuses communes à la fois.',
	goalLink: 'Guide pour les communes et les prestataires informatiques',
	methodNote: (n) => `Sont relevés les enregistrements DNS publics (DMARC, SPF, MX) des ${n} communes, interrogés via des résolveurs DNS publics. Aucun e-mail n’est envoyé et aucun serveur communal n’est contacté. La mesure est répétée ; les corrections confirmées y sont intégrées.`,
	dmarcRecord: 'Enregistrement DMARC',
	foundAt: 'sous',
	inheritedFrom: 'repris de',
	mxLabel: 'Serveurs de messagerie (MX)',
	noMx: 'aucun',
	nullMx: 'MX nul (n’accepte pas d’e-mails)',
	spfRecord: 'Enregistrement SPF',
	dkimNote: 'DKIM n’est pas relevé : les clés ne peuvent être interrogées que si l’on connaît leur nom.',
	queried: (d) => `Enregistrements DNS publics, état au ${d}.`,
	better: 'mieux qu’avant',
	worse: 'moins bien qu’avant',
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
	weakestNote: 'Conta il dominio meno protetto, perché con ognuno si possono falsificare e-mail a nome del comune.',
	measured: (d) => `Misurato il ${d} da record DNS pubblici`,
	byAuthor: 'Dall’autore di',
	mapHint: 'Passate sopra o toccate un comune.',
	source: (d) => `Fonte: misurazione propria dei record DNS, ${d}.`,
	sendsFrom: (n, d) => `${n} invia e-mail da ${d}.`,
	explain: {
		blocked: 'La politica chiede ai server destinatari di respingere le e-mail che falsificano questo mittente.',
		filtered: 'La politica chiede ai server destinatari di trattare come spam le e-mail che falsificano questo mittente.',
		monitoring: 'Il record non chiede alcuna misura; il comune riceve rapporti sulle e-mail inviate a suo nome.',
		none: 'I server destinatari non ricevono alcuna istruzione per fermare le e-mail che falsificano questo mittente.',
		unknown: 'Nessun dato utilizzabile per questo dominio.'
	},
	cantonContext: (c, p) => `Canton ${c}: il ${p} dei comuni pubblica una politica di rifiuto o quarantena.`,
	techDetails: 'Dettagli tecnici',
	otherDomains: 'Altri domini del comune',
	noRua: 'Il record p=none non ha un indirizzo per i rapporti (rua): non chiede alcuna misura e nessuno riceve rapporti. Conta quindi come «Nessun DMARC efficace».',
	noneSplit: (n) => `di cui ${n} con un record p=none senza indirizzo per i rapporti`,
	deciding: 'Determinante',
	inherited: (d) => `Record del dominio cantonale ${d}, impostato dal cantone.`,
	trendSince: (d, up, down) => `Dal ${d}, ${up} comuni hanno migliorato la loro valutazione e ${down} sono peggiorati.`,
	correctionLog: 'Registro delle correzioni',
	noCorrections: 'Finora non è stata segnalata alcuna correzione.',
	statusShort: { blocked: 'Rifiuto', filtered: 'Quarantena', monitoring: 'Solo monitoraggio', none: 'Nessun DMARC efficace', unknown: 'Nessun dato' },
	keyTitle: 'Classificazione DMARC dei comuni',
	lead: (s, n, t, tp, b, bp) => `Il ${s} dei comuni svizzeri pubblica una politica che chiede ai server destinatari di respingere le e-mail che ne falsificano l’indirizzo o di trattarle come spam. Le differenze tra i cantoni sono grandi: ${t} raggiunge il ${tp}, ${b} il ${bp}.`,
	basis: (k, t, b) => `Quote calcolate su ${k} dei ${t} comuni con dati utilizzabili. «Nessun DMARC efficace» comprende ${b} comuni con un record p=none senza indirizzo per i rapporti.`,
	why: 'I comuni inviano per e-mail fatture, documenti fiscali e informazioni di voto. Chi ne falsifica l’indirizzo del mittente può inviare e-mail fraudolente credibili. DMARC è un record DNS pubblico con cui un dominio indica ai server destinatari cosa fare di tali falsi: respingerli, trattarli come spam o soltanto segnalarli.',
	mapSub: 'Ogni superficie è un comune. Nome, dominio e classificazione appaiono passandoci sopra o toccando.',
	sourceLine: 'Fonte: misurazione propria dei record DNS pubblici.',
	cantonsPara: 'Il livello di protezione di un comune dipende spesso da chi gestisce i suoi domini. Molti comuni condividono un fornitore IT o l’informatica cantonale. Se questo ha configurato DMARC, spesso tutti i suoi comuni sono protetti; altrimenti nessuno.',
	changePara: (d, up, down, b0, b1) => `Dalla prima misurazione del ${d}, ${up} comuni hanno migliorato la loro classificazione e ${down} sono peggiorati. Nello stesso periodo il numero di comuni con un record DMARC senza indirizzo per i rapporti è salito da ${b0} a ${b1}. Un tale record non chiede alcuna misura e non fornisce rapporti a nessuno; qui non è quindi considerato efficace.`,
	goalTitle: 'Che cosa servirebbe',
	goalPara: 'L’obiettivo è lo stesso per tutti i comuni: la politica «rifiuto» su ogni dominio, anche su quelli che servono solo al sito web e non inviano e-mail. La strada passa da un record con indirizzo per i rapporti, alcune settimane di analisi e poi il passaggio a «quarantena» e «rifiuto». Presso il fornitore IT questo si può spesso fare per molti comuni contemporaneamente.',
	goalLink: 'Guida per comuni e fornitori IT',
	methodNote: (n) => `Sono rilevati i record DNS pubblici (DMARC, SPF, MX) di tutti i ${n} comuni, interrogati tramite resolver DNS pubblici. Non viene inviata alcuna e-mail e non viene contattato alcun server comunale. La misurazione viene ripetuta; le correzioni confermate vi confluiscono.`,
	dmarcRecord: 'Record DMARC',
	foundAt: 'sotto',
	inheritedFrom: 'ripreso da',
	mxLabel: 'Server di posta (MX)',
	noMx: 'nessuno',
	nullMx: 'MX nullo (non accetta e-mail)',
	spfRecord: 'Record SPF',
	dkimNote: 'DKIM non è rilevato: le chiavi si possono interrogare solo conoscendone il nome.',
	queried: (d) => `Record DNS pubblici, stato al ${d}.`,
	better: 'meglio di prima',
	worse: 'peggio di prima',
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
	weakestNote: 'The least protected domain counts, since each one can be used to fake mail in the municipality’s name.',
	measured: (d) => `Measured on ${d} from public DNS records`,
	byAuthor: 'By the author of',
	mapHint: 'Hover over or tap a municipality.',
	source: (d) => `Source: own measurement of DNS records, ${d}.`,
	sendsFrom: (n, d) => `${n} sends mail from ${d}.`,
	explain: {
		blocked: 'The policy asks receiving servers to reject mail faking this sender.',
		filtered: 'The policy asks receiving servers to treat mail faking this sender as spam.',
		monitoring: 'The record asks for no action; the municipality receives reports on mail sent in its name.',
		none: 'Receiving servers get no instruction to stop mail faking this sender.',
		unknown: 'No usable data for this domain.'
	},
	cantonContext: (c, p) => `In ${c}, ${p} of municipalities publish a reject or quarantine policy.`,
	techDetails: 'Technical details',
	otherDomains: 'Other domains of the municipality',
	noRua: 'The p=none record has no report address (rua): it asks for no action and nobody receives reports. It therefore counts as “No effective DMARC”.',
	noneSplit: (n) => `of these, ${n} have a p=none record without a report address`,
	deciding: 'Decides the rating',
	inherited: (d) => `Record of the cantonal domain ${d}, set by the canton.`,
	trendSince: (d, up, down) => `Since ${d}, ${up} municipalities have improved their rating and ${down} have fallen back.`,
	correctionLog: 'Correction log',
	noCorrections: 'No corrections reported so far.',
	statusShort: { blocked: 'Reject', filtered: 'Quarantine', monitoring: 'Monitoring only', none: 'No effective DMARC', unknown: 'No data' },
	keyTitle: 'DMARC rating of the municipalities',
	lead: (s, n, t, tp, b, bp) => `${s} of Swiss municipalities publish a policy that tells receiving mail servers to reject mail faking their address or to treat it as spam. The differences between cantons are large: ${tp} in ${t}, ${bp} in ${b}.`,
	basis: (k, t, b) => `Shares based on ${k} of ${t} municipalities with usable data. “No effective DMARC” includes ${b} municipalities with a p=none record without a report address.`,
	why: 'Municipalities send bills, tax documents and voting information by email. Whoever forges their sender address can send convincing fraudulent mail. DMARC is a public DNS record with which a domain tells receiving mail servers what to do with such forgeries: reject them, treat them as spam or merely report them.',
	mapSub: 'Each area is a municipality. Name, domain and rating appear on hover or tap.',
	sourceLine: 'Source: own measurement of public DNS records.',
	cantonsPara: 'How well a municipality is protected often depends on who runs its domains. Many municipalities share an IT provider or the cantonal IT office. Where it has set up DMARC, often all its municipalities are protected; where it has not, none are.',
	changePara: (d, up, down, b0, b1) => `Since the first measurement on ${d}, ${up} municipalities have improved their rating and ${down} have fallen back. Over the same period, the number of municipalities with a DMARC record but no report address rose from ${b0} to ${b1}. Such a record asks for no action and reports to nobody, so it does not count as effective here.`,
	goalTitle: 'What it would take',
	goalPara: 'The goal is the same for every municipality: a reject policy on every domain, including those that only serve the website and send no mail. The way there is a record with a report address, a few weeks of reading the reports, then the move to quarantine and reject. At the IT provider this can often be done for many municipalities at once.',
	goalLink: 'Guide for municipalities and IT providers',
	methodNote: (n) => `Covered are the public DNS records (DMARC, SPF, MX) of all ${n} municipalities, queried through public DNS resolvers. No mail is sent and no municipal server is contacted. The measurement is repeated; confirmed corrections are included each time.`,
	dmarcRecord: 'DMARC record',
	foundAt: 'at',
	inheritedFrom: 'inherited from',
	mxLabel: 'Mail servers (MX)',
	noMx: 'none',
	nullMx: 'null MX (accepts no mail)',
	spfRecord: 'SPF record',
	dkimNote: 'DKIM is not covered: its keys can only be looked up if you know their names.',
	queried: (d) => `Public DNS records as of ${d}.`,
	better: 'better than before',
	worse: 'worse than before',
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
