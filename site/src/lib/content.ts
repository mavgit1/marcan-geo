// Guide and method texts. Strings may contain <code> and <a>; they are ours,
// not user input, and are rendered with {@html}.

import type { Lang, StatusKey } from './i18n';

export interface Step {
	id: StatusKey;
	title: string;
	body: string[];
	record?: string;
}

export interface Tool {
	name: string;
	url: string;
	desc: string;
}

interface Guide {
	title: string;
	intro: string[];
	steps: Step[];
	providerTitle: string;
	provider: string;
	toolsTitle: string;
	toolsIntro: string;
	tools: Tool[];
	toolsNote: string;
}

interface Method {
	title: string;
	sections: { title: string; body: string[] }[];
	rulesTitle: string;
	rules: [StatusKey, string][];
}

const tool = (name: string, url: string, desc: string): Tool => ({ name, url, desc });
const MARCAN = 'https://marcan.kaitiaki.tech/';
const PARSEDMARC = 'https://github.com/domainaware/parsedmarc';
const CLOUDFLARE = 'https://developers.cloudflare.com/dmarc-management/';
const POSTMARK = 'https://dmarc.postmarkapp.com/';
const DMARCIAN = 'https://dmarcian.com/';
const ISSUES = 'https://github.com/mavgit1/marcan-geo/issues';
const REC_NONE = 'v=DMARC1; p=none; rua=mailto:dmarc@example.ch';
const REC_Q = 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.ch';
const REC_R = 'v=DMARC1; p=reject; rua=mailto:dmarc@example.ch';

export const guide: Record<Lang, Guide> = {
	de: {
		title: 'So schützen Sie die Absenderadresse Ihrer Gemeinde',
		intro: [
			'DMARC sagt empfangenden Mailservern, was sie mit Mails tun sollen, die vorgeben, von Ihrer Domain zu kommen, aber die Prüfungen nicht bestehen: zustellen, in den Spam-Ordner legen oder abweisen.',
			'SPF allein reicht nicht. SPF prüft nur die versteckte Absenderadresse im Umschlag der Mail, nicht die Adresse, die Bürgerinnen und Bürger in ihrem Mailprogramm sehen. Erst DMARC verbindet SPF und DKIM mit dieser sichtbaren Adresse.',
			'Das gilt auch für Domains, die keine Mails verschicken, etwa die der Website: Jeder kann in ihrem Namen Mails versenden. Solche Domains sollten direkt <code>p=reject</code> veröffentlichen.',
			'Für Domains, die Mails verschicken, geht der Weg in Stufen. Jede Stufe ist ein einzelner DNS-Eintrag unter <code>_dmarc.ihre-domain.ch</code>.'
		],
		steps: [
			{ id: 'none', title: 'Kein DMARC: Überwachung einschalten', body: ['Veröffentlichen Sie einen DMARC-Eintrag mit <code>p=none</code> und einer Adresse für Berichte (<code>rua</code>). An der Zustellung ändert sich nichts; Sie erhalten ab jetzt täglich Berichte der grossen Mailanbieter.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Nur Überwachung: Berichte auswerten, dann durchsetzen', body: ['Fehlt <code>rua</code>, ergänzen Sie es zuerst: Ohne Berichte überwacht niemand etwas.', 'Werten Sie die Berichte zwei bis vier Wochen aus. Prüfen Sie, dass alle legitimen Absender (Newsletter, Gemeindesoftware, E-Rechnung, IT-Dienstleister) SPF oder DKIM für Ihre Domain bestehen. Danach auf <code>p=quarantine</code> wechseln.', '<code>pct</code> ist veraltet und wurde aus dem neuen DMARC-Standard entfernt. Setzen Sie eine Richtlinie ganz oder gar nicht; Einträge mit <code>pct</code> unter 100 oder <code>t=y</code> zählen hier als Überwachung.'], record: REC_Q },
			{ id: 'filtered', title: 'Gefiltert: auf Abweisen umstellen', body: ['Zeigen die Berichte, dass keine legitime Mail mehr betroffen ist, wechseln Sie auf <code>p=reject</code>. Gefälschte Mails werden dann gar nicht mehr zugestellt.'], record: REC_R },
			{ id: 'blocked', title: 'Blockiert: dranbleiben', body: ['Lassen Sie die Berichte weiterlaufen und prüfen Sie sie, wenn ein neuer Dienst in Ihrem Namen Mails verschicken soll. Sinnvolle nächste Schritte sind MTA-STS und TLS-RPT für verschlüsselte Zustellung.'] },
			{ id: 'unknown', title: 'Keine Daten', body: [`Wir kennen keine Website Ihrer Gemeinde, oder die Domain hat nicht geantwortet. Nennen Sie uns Ihre Domain über die <a href="${ISSUES}">Korrekturen</a>, dann nehmen wir sie auf.`] }
		],
		providerTitle: 'Sprechen Sie mit Ihrem IT-Dienstleister',
		provider: 'Viele Gemeinden teilen sich einen IT-Dienstleister oder die kantonale Informatik. Dort lässt sich DMARC oft für viele Gemeinden auf einmal einrichten. Die grossen Unterschiede zwischen den Kantonen deuten genau darauf hin.',
		toolsTitle: 'Werkzeuge für DMARC-Berichte',
		toolsIntro: 'Die Berichte kommen als XML-Dateien per Mail. Diese Werkzeuge machen sie lesbar:',
		tools: [
			tool('Marcan', MARCAN, 'Open Source, selbst gehostet, Daten bleiben bei Ihnen. Vom Autor dieser Seite.'),
			tool('parsedmarc', PARSEDMARC, 'Open Source, selbst gehostet, mit Elasticsearch/OpenSearch oder Splunk.'),
			tool('Cloudflare DMARC Management', CLOUDFLARE, 'Kostenlos, wenn Ihre Domain bei Cloudflare liegt.'),
			tool('Postmark DMARC Digests', POSTMARK, 'Kostenlose wöchentliche Zusammenfassung per Mail.'),
			tool('dmarcian', DMARCIAN, 'Kommerzieller Dienst mit Begleitung.')
		],
		toolsNote: 'Diese Seite sieht nicht, welches Werkzeug Sie verwenden, und die Bewertung hängt nicht davon ab.'
	},
	fr: {
		title: 'Comment protéger l’adresse d’expéditeur de votre commune',
		intro: [
			'DMARC indique aux serveurs de messagerie destinataires ce qu’ils doivent faire des e-mails qui prétendent venir de votre domaine mais échouent aux contrôles : les distribuer, les placer en spam ou les refuser.',
			'SPF seul ne suffit pas. SPF ne vérifie que l’adresse d’expédition cachée dans l’enveloppe du message, pas celle que les habitants voient dans leur messagerie. Seul DMARC relie SPF et DKIM à cette adresse visible.',
			'Cela vaut aussi pour les domaines qui n’envoient pas d’e-mails, par exemple celui du site web : n’importe qui peut envoyer des e-mails en leur nom. Ces domaines devraient publier directement <code>p=reject</code>.',
			'Pour les domaines qui envoient des e-mails, la démarche se fait par étapes. Chaque étape est un seul enregistrement DNS sous <code>_dmarc.votre-domaine.ch</code>.'
		],
		steps: [
			{ id: 'none', title: 'Pas de DMARC : activer la surveillance', body: ['Publiez un enregistrement DMARC avec <code>p=none</code> et une adresse pour les rapports (<code>rua</code>). La distribution ne change pas ; vous recevez dès lors des rapports quotidiens des grands fournisseurs de messagerie.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Surveillance seule : analyser les rapports, puis appliquer', body: ['S’il manque <code>rua</code>, ajoutez-le d’abord : sans rapports, personne ne surveille rien.', 'Analysez les rapports pendant deux à quatre semaines. Vérifiez que tous les expéditeurs légitimes (newsletter, logiciel communal, facturation électronique, prestataire informatique) passent SPF ou DKIM pour votre domaine. Passez ensuite à <code>p=quarantine</code>.', '<code>pct</code> est obsolète et a été retiré de la nouvelle norme DMARC. Appliquez une politique entièrement ou pas du tout ; les enregistrements avec <code>pct</code> inférieur à 100 ou <code>t=y</code> comptent ici comme surveillance.'], record: REC_Q },
			{ id: 'filtered', title: 'Filtrée : passer au refus', body: ['Si les rapports montrent qu’aucun e-mail légitime n’est plus concerné, passez à <code>p=reject</code>. Les e-mails usurpés ne sont alors plus distribués du tout.'], record: REC_R },
			{ id: 'blocked', title: 'Bloquée : rester attentif', body: ['Gardez les rapports actifs et consultez-les lorsqu’un nouveau service doit envoyer des e-mails en votre nom. MTA-STS et TLS-RPT sont de bonnes étapes suivantes pour une distribution chiffrée.'] },
			{ id: 'unknown', title: 'Pas de données', body: [`Nous ne connaissons pas de site web de votre commune, ou le domaine n’a pas répondu. Indiquez-nous votre domaine via les <a href="${ISSUES}">corrections</a> et nous l’ajouterons.`] }
		],
		providerTitle: 'Parlez-en à votre prestataire informatique',
		provider: 'Beaucoup de communes partagent un prestataire informatique ou l’informatique cantonale. DMARC peut souvent y être configuré pour de nombreuses communes à la fois. Les grandes différences entre cantons le suggèrent.',
		toolsTitle: 'Outils pour les rapports DMARC',
		toolsIntro: 'Les rapports arrivent par e-mail sous forme de fichiers XML. Ces outils les rendent lisibles :',
		tools: [
			tool('Marcan', MARCAN, 'Open source, auto-hébergé, les données restent chez vous. Par l’auteur de ce site.'),
			tool('parsedmarc', PARSEDMARC, 'Open source, auto-hébergé, avec Elasticsearch/OpenSearch ou Splunk.'),
			tool('Cloudflare DMARC Management', CLOUDFLARE, 'Gratuit si votre domaine est chez Cloudflare.'),
			tool('Postmark DMARC Digests', POSTMARK, 'Résumé hebdomadaire gratuit par e-mail.'),
			tool('dmarcian', DMARCIAN, 'Service commercial avec accompagnement.')
		],
		toolsNote: 'Ce site ne voit pas quel outil vous utilisez, et l’évaluation n’en dépend pas.'
	},
	it: {
		title: 'Come proteggere l’indirizzo mittente del vostro comune',
		intro: [
			'DMARC dice ai server di posta riceventi cosa fare con le e-mail che sembrano provenire dal vostro dominio ma non superano i controlli: consegnarle, metterle nello spam o rifiutarle.',
			'SPF da solo non basta. SPF verifica solo l’indirizzo mittente nascosto nella busta del messaggio, non quello che i cittadini vedono nel loro programma di posta. Solo DMARC collega SPF e DKIM a questo indirizzo visibile.',
			'Questo vale anche per i domini che non inviano e-mail, ad esempio quello del sito web: chiunque può inviare e-mail a loro nome. Questi domini dovrebbero pubblicare subito <code>p=reject</code>.',
			'Per i domini che inviano e-mail si procede a tappe. Ogni tappa è un solo record DNS sotto <code>_dmarc.vostro-dominio.ch</code>.'
		],
		steps: [
			{ id: 'none', title: 'Nessun DMARC: attivare il monitoraggio', body: ['Pubblicate un record DMARC con <code>p=none</code> e un indirizzo per i rapporti (<code>rua</code>). La consegna non cambia; da subito ricevete rapporti giornalieri dai grandi provider di posta.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Solo monitoraggio: analizzare i rapporti, poi applicare', body: ['Se manca <code>rua</code>, aggiungetelo prima: senza rapporti nessuno monitora nulla.', 'Analizzate i rapporti per due-quattro settimane. Verificate che tutti i mittenti legittimi (newsletter, software comunale, fatturazione elettronica, fornitore IT) superino SPF o DKIM per il vostro dominio. Poi passate a <code>p=quarantine</code>.', '<code>pct</code> è obsoleto ed è stato rimosso dal nuovo standard DMARC. Applicate una politica per intero o per niente; i record con <code>pct</code> inferiore a 100 o <code>t=y</code> contano qui come monitoraggio.'], record: REC_Q },
			{ id: 'filtered', title: 'Filtrate: passare al rifiuto', body: ['Quando i rapporti mostrano che nessuna e-mail legittima è più interessata, passate a <code>p=reject</code>. Le e-mail falsificate non vengono più consegnate.'], record: REC_R },
			{ id: 'blocked', title: 'Bloccate: restare vigili', body: ['Mantenete attivi i rapporti e controllateli quando un nuovo servizio deve inviare e-mail a vostro nome. MTA-STS e TLS-RPT sono buoni passi successivi per una consegna cifrata.'] },
			{ id: 'unknown', title: 'Nessun dato', body: [`Non conosciamo un sito web del vostro comune, oppure il dominio non ha risposto. Indicateci il vostro dominio tramite le <a href="${ISSUES}">correzioni</a> e lo aggiungeremo.`] }
		],
		providerTitle: 'Parlatene con il vostro fornitore IT',
		provider: 'Molti comuni condividono un fornitore IT o l’informatica cantonale. Lì DMARC si può spesso configurare per molti comuni in una volta. Le grandi differenze tra i cantoni lo suggeriscono.',
		toolsTitle: 'Strumenti per i rapporti DMARC',
		toolsIntro: 'I rapporti arrivano per e-mail come file XML. Questi strumenti li rendono leggibili:',
		tools: [
			tool('Marcan', MARCAN, 'Open source, self-hosted, i dati restano da voi. Dell’autore di questo sito.'),
			tool('parsedmarc', PARSEDMARC, 'Open source, self-hosted, con Elasticsearch/OpenSearch o Splunk.'),
			tool('Cloudflare DMARC Management', CLOUDFLARE, 'Gratuito se il vostro dominio è su Cloudflare.'),
			tool('Postmark DMARC Digests', POSTMARK, 'Riepilogo settimanale gratuito per e-mail.'),
			tool('dmarcian', DMARCIAN, 'Servizio commerciale con accompagnamento.')
		],
		toolsNote: 'Questo sito non vede quale strumento usate, e la valutazione non ne dipende.'
	},
	en: {
		title: 'How to protect your municipality’s sender address',
		intro: [
			'DMARC tells receiving mail servers what to do with mail that claims to come from your domain but fails the checks: deliver it, put it in spam, or reject it.',
			'SPF alone is not enough. SPF only checks the hidden envelope sender, not the address people see in their mail client. Only DMARC ties SPF and DKIM to that visible address.',
			'This also applies to domains that send no mail, such as the website’s: anyone can send mail in their name. Such domains should publish <code>p=reject</code> straight away.',
			'For domains that do send mail, you get there in steps. Each step is a single DNS record at <code>_dmarc.your-domain.ch</code>.'
		],
		steps: [
			{ id: 'none', title: 'No DMARC: turn on monitoring', body: ['Publish a DMARC record with <code>p=none</code> and an address for reports (<code>rua</code>). Delivery does not change; from now on you get daily reports from the large mail providers.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Monitoring only: read the reports, then enforce', body: ['If <code>rua</code> is missing, add it first: without reports, nobody is monitoring anything.', 'Read the reports for two to four weeks. Check that every legitimate sender (newsletter tool, municipal software, e-billing, IT provider) passes SPF or DKIM for your domain. Then move to <code>p=quarantine</code>.', '<code>pct</code> is obsolete and was removed from the new DMARC standard. Enforce a policy fully or not at all; records with <code>pct</code> below 100 or <code>t=y</code> count as monitoring here.'], record: REC_Q },
			{ id: 'filtered', title: 'Filtered: move to reject', body: ['When the reports show that no legitimate mail is affected any more, move to <code>p=reject</code>. Spoofed mail is then not delivered at all.'], record: REC_R },
			{ id: 'blocked', title: 'Blocked: keep it that way', body: ['Keep the reports coming and check them whenever a new service should send mail in your name. Good next steps are MTA-STS and TLS-RPT for encrypted delivery.'] },
			{ id: 'unknown', title: 'No data', body: [`We know no website for your municipality, or the domain did not answer. Tell us your domain through the <a href="${ISSUES}">corrections</a> and we will add it.`] }
		],
		providerTitle: 'Talk to your IT provider',
		provider: 'Many municipalities share an IT provider or the cantonal IT office. DMARC can often be set up there for many municipalities at once. The large differences between cantons point to exactly that.',
		toolsTitle: 'Tools for DMARC reports',
		toolsIntro: 'Reports arrive by email as XML files. These tools make them readable:',
		tools: [
			tool('Marcan', MARCAN, 'Open source, self-hosted, your data stays with you. By the author of this site.'),
			tool('parsedmarc', PARSEDMARC, 'Open source, self-hosted, with Elasticsearch/OpenSearch or Splunk.'),
			tool('Cloudflare DMARC Management', CLOUDFLARE, 'Free if your domain is on Cloudflare.'),
			tool('Postmark DMARC Digests', POSTMARK, 'Free weekly summary by email.'),
			tool('dmarcian', DMARCIAN, 'Commercial service with support.')
		],
		toolsNote: 'This site cannot see which tool you use, and the rating does not depend on it.'
	}
};

export const method: Record<Lang, Method> = {
	de: {
		title: 'Methode',
		sections: [
			{ title: 'Was gemessen wird', body: ['Für jede Gemeinde fragen wir drei öffentliche DNS-Einträge ihrer Maildomain ab: MX (empfängt die Domain Mails?), SPF und DMARC. Es werden keine Mails verschickt und keine Verbindungen zu Servern der Gemeinden aufgebaut.'] },
			{ title: 'Quellen', body: ['Gemeindeliste: amtliches Gemeindeverzeichnis des BFS. Websites: Wikidata. Die Maildomain wird aus der Domain der Website abgeleitet; wo das nachweislich nicht stimmt, korrigieren wir von Hand und halten den Beleg fest. Grenzen: swisstopo swissBOUNDARIES3D.', 'Die Abfragen laufen über Google Public DNS und Quad9 mit begrenzter Rate; die Antworten beider werden verglichen. Ohne Eintrag unter <code>_dmarc.domain</code> gilt der Eintrag der Organisationsdomain (z. B. <code>ne.ch</code> für <code>gemeinde.ne.ch</code>), mit deren <code>sp=</code>, falls gesetzt.'] },
			{ title: 'Grenzen', body: ['Die Domain der Website ist nicht immer die Maildomain; gemessen wird die Domain der Website, denn auch sie muss vor Fälschungen geschützt sein. DKIM wird nicht geprüft, weil die Selektoren unbekannt sind. Die Messung ist eine Momentaufnahme der DNS-Einträge und sagt nichts darüber, wie einzelne Mails tatsächlich behandelt werden. Alle Gemeinden zählen gleich, unabhängig von der Einwohnerzahl.'] },
			{ title: 'Veröffentlichung und Korrekturen', body: ['Zuerst erscheinen nur Zahlen pro Kanton. Angaben zu einzelnen Gemeinden folgen, nachdem die Kantone und das Bundesamt für Cybersicherheit informiert wurden.', `Stimmt etwas nicht, etwa die Maildomain Ihrer Gemeinde? Melden Sie es über die <a href="${ISSUES}">öffentlichen Issues</a>.`] }
		],
		rulesTitle: 'Einstufung',
		rules: [
			['blocked', '<code>p=reject</code>, ohne <code>pct</code> unter 100 und ohne <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, ohne <code>pct</code> unter 100 und ohne <code>t=y</code>'],
			['monitoring', '<code>p=none</code>, oder eine Richtlinie mit <code>pct</code> unter 100 oder <code>t=y</code>'],
			['none', 'kein DMARC-Eintrag oder ein ungültiger (z. B. mehrere Einträge)'],
			['unknown', 'keine Website bekannt, die Domain existiert nicht, oder ein DNS-Fehler. Domains ohne MX werden nach ihrem DMARC-Eintrag eingestuft wie alle anderen.']
		]
	},
	fr: {
		title: 'Méthode',
		sections: [
			{ title: 'Ce qui est mesuré', body: ['Pour chaque commune, nous interrogeons trois enregistrements DNS publics de son domaine mail : MX (le domaine reçoit-il des e-mails ?), SPF et DMARC. Aucun e-mail n’est envoyé et aucune connexion n’est établie avec les serveurs des communes.'] },
			{ title: 'Sources', body: ['Liste des communes : répertoire officiel des communes de l’OFS. Sites web : Wikidata. Le domaine mail est déduit du domaine du site web ; lorsque c’est manifestement faux, nous corrigeons à la main en notant la preuve. Limites : swisstopo swissBOUNDARIES3D.', 'Les requêtes passent par Google Public DNS et Quad9 avec un débit limité ; les réponses des deux sont comparées. Sans enregistrement sous <code>_dmarc.domaine</code>, c’est celui du domaine organisationnel qui s’applique (p. ex. <code>ne.ch</code> pour <code>commune.ne.ch</code>), avec son <code>sp=</code> s’il existe.'] },
			{ title: 'Limites', body: ['Le domaine du site web n’est pas toujours le domaine mail ; c’est lui qui est mesuré, car il doit lui aussi être protégé contre l’usurpation. DKIM n’est pas vérifié, car les sélecteurs sont inconnus. La mesure est un instantané des enregistrements DNS et ne dit rien du traitement réel de chaque e-mail. Toutes les communes comptent de la même manière, quelle que soit leur population.'] },
			{ title: 'Publication et corrections', body: ['Seuls les chiffres par canton sont publiés d’abord. Les détails par commune suivront après information des cantons et de l’Office fédéral de la cybersécurité.', `Une erreur, par exemple sur le domaine mail de votre commune ? Signalez-la via les <a href="${ISSUES}">issues publiques</a>.`] }
		],
		rulesTitle: 'Classification',
		rules: [
			['blocked', '<code>p=reject</code>, sans <code>pct</code> inférieur à 100 ni <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, sans <code>pct</code> inférieur à 100 ni <code>t=y</code>'],
			['monitoring', '<code>p=none</code>, ou une politique avec <code>pct</code> inférieur à 100 ou <code>t=y</code>'],
			['none', 'aucun enregistrement DMARC ou un enregistrement invalide (p. ex. plusieurs)'],
			['unknown', 'aucun site web connu, domaine inexistant, ou erreur DNS. Les domaines sans MX sont classés selon leur enregistrement DMARC comme les autres.']
		]
	},
	it: {
		title: 'Metodo',
		sections: [
			{ title: 'Cosa si misura', body: ['Per ogni comune interroghiamo tre record DNS pubblici del suo dominio mail: MX (il dominio riceve e-mail?), SPF e DMARC. Non si inviano e-mail e non ci si collega ai server dei comuni.'] },
			{ title: 'Fonti', body: ['Elenco dei comuni: elenco ufficiale dei comuni dell’UST. Siti web: Wikidata. Il dominio mail è dedotto dal dominio del sito web; dove è dimostrabilmente sbagliato correggiamo a mano annotando la prova. Confini: swisstopo swissBOUNDARIES3D.', 'Le richieste passano da Google Public DNS e Quad9 con frequenza limitata; le risposte dei due vengono confrontate. Senza record sotto <code>_dmarc.dominio</code> vale quello del dominio organizzativo (p. es. <code>ti.ch</code> per <code>comune.ti.ch</code>), con il suo <code>sp=</code> se presente.'] },
			{ title: 'Limiti', body: ['Il dominio del sito web non è sempre il dominio mail; si misura quello del sito, perché anch’esso va protetto dalle falsificazioni. DKIM non viene verificato perché i selettori sono sconosciuti. La misurazione è un’istantanea dei record DNS e non dice nulla sul trattamento effettivo delle singole e-mail. Tutti i comuni contano allo stesso modo, indipendentemente dalla popolazione.'] },
			{ title: 'Pubblicazione e correzioni', body: ['All’inizio si pubblicano solo cifre per cantone. I dettagli per comune seguiranno dopo aver informato i cantoni e l’Ufficio federale della cibersicurezza.', `Qualcosa non è corretto, ad esempio il dominio mail del vostro comune? Segnalatelo tramite le <a href="${ISSUES}">issue pubbliche</a>.`] }
		],
		rulesTitle: 'Classificazione',
		rules: [
			['blocked', '<code>p=reject</code>, senza <code>pct</code> inferiore a 100 né <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, senza <code>pct</code> inferiore a 100 né <code>t=y</code>'],
			['monitoring', '<code>p=none</code>, oppure una politica con <code>pct</code> inferiore a 100 o <code>t=y</code>'],
			['none', 'nessun record DMARC o un record non valido (p. es. più record)'],
			['unknown', 'nessun sito web noto, dominio inesistente, o errore DNS. I domini senza MX sono classificati in base al loro record DMARC come gli altri.']
		]
	},
	en: {
		title: 'Method',
		sections: [
			{ title: 'What is measured', body: ['For each municipality we query three public DNS records of its mail domain: MX (does the domain receive mail?), SPF and DMARC. No mail is sent and no connection is made to the municipalities’ servers.'] },
			{ title: 'Sources', body: ['Municipality list: the FSO’s official register of municipalities. Websites: Wikidata. The mail domain is derived from the website’s domain; where that is demonstrably wrong, we correct it by hand and record the evidence. Boundaries: swisstopo swissBOUNDARIES3D.', 'Queries go through Google Public DNS and Quad9 at a limited rate, and both answers are compared. Without a record at <code>_dmarc.domain</code>, the organizational domain’s record applies (e.g. <code>ne.ch</code> for <code>commune.ne.ch</code>), with its <code>sp=</code> if set.'] },
			{ title: 'Limits', body: ['The website’s domain is not always the mail domain; the website’s domain is what is measured, since it needs protection against spoofing too. DKIM is not checked, because the selectors are unknown. The measurement is a snapshot of DNS records and says nothing about how individual messages are actually handled. Every municipality counts the same, whatever its population.'] },
			{ title: 'Release and corrections', body: ['At first only canton totals are published. Details for individual municipalities follow after the cantons and the Federal Office for Cybersecurity have been informed.', `Something wrong, such as your municipality’s mail domain? Report it in the <a href="${ISSUES}">public issues</a>.`] }
		],
		rulesTitle: 'Classification',
		rules: [
			['blocked', '<code>p=reject</code>, with no <code>pct</code> below 100 and no <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, with no <code>pct</code> below 100 and no <code>t=y</code>'],
			['monitoring', '<code>p=none</code>, or a policy with <code>pct</code> below 100 or <code>t=y</code>'],
			['none', 'no DMARC record, or an invalid one (e.g. several records)'],
			['unknown', 'no known website, the domain does not exist, or a DNS error. Domains without MX are rated by their DMARC record like all others.']
		]
	}
};
