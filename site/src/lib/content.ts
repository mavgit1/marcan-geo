// Guide and method texts. Strings may contain <code> and <a>; they are ours,
// not user input, and are rendered with {@html}.

import type { Lang, StatusKey } from './i18n';

export interface Step {
	id: StatusKey;
	title: string;
	body: string[];
	record?: string;
}

export interface ToolGroup {
	label: string;
	/** May contain links. */
	html: string;
}

interface Guide {
	title: string;
	intro: string[];
	steps: Step[];
	providerTitle: string;
	provider: string;
	toolsTitle: string;
	toolsIntro: string;
	tools: ToolGroup[];
}

interface Method {
	title: string;
	sections: { title: string; body: string[] }[];
	rulesTitle: string;
	rules: [StatusKey, string][];
	correctionsTitle: string;
	corrections: string[];
	faqTitle: string;
	faq: { q: string; a: string }[];
}

export const MARCAN = 'https://marcan.kaitiaki.tech/';
const PARSEDMARC = 'https://github.com/domainaware/parsedmarc';
const CLOUDFLARE = 'https://developers.cloudflare.com/dmarc-management/';
const POSTMARK = 'https://dmarc.postmarkapp.com/';
const DMARCIAN = 'https://dmarcian.com/';
export const ISSUES = 'https://github.com/mavgit1/marcan-geo/issues';
export const CONTACT = 'research@kaitiaki.tech';
const A = (url: string, text: string) => `<a href="${url}" rel="noopener">${text}</a>`;
const MAIL = `<a href="mailto:${CONTACT}">${CONTACT}</a>`;
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
			'Für Domains, die Mails verschicken, geht der Weg in Stufen. Jede Stufe ist ein einzelner DNS-Eintrag unter <code>_dmarc.ihre-domain.ch</code>.',
			'Die Empfehlungen folgen dem veröffentlichten Standard (RFC 7489 / DMARCbis). Sprechen Sie mit Ihrem IT-Dienstleister, bevor Sie Einträge ändern.'
		],
		steps: [
			{ id: 'none', title: 'Kein wirksames DMARC: Überwachung einschalten', body: ['Veröffentlichen Sie einen DMARC-Eintrag mit <code>p=none</code> und einer Adresse für Berichte (<code>rua</code>). An der Zustellung ändert sich nichts; Sie erhalten ab jetzt täglich Berichte der grossen Mailanbieter.', 'Ein Eintrag mit <code>p=none</code> ohne <code>rua</code> zählt hier als «Kein wirksames DMARC»: Er verlangt keine Massnahme, und niemand erhält Berichte.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Nur Überwachung: Berichte auswerten, dann durchsetzen', body: ['Fehlt <code>rua</code>, ergänzen Sie es zuerst: Ohne Berichte überwacht niemand etwas.', 'Werten Sie die Berichte zwei bis vier Wochen aus. Prüfen Sie, dass alle legitimen Absender (Newsletter, Gemeindesoftware, E-Rechnung, IT-Dienstleister) SPF oder DKIM für Ihre Domain bestehen. Danach auf <code>p=quarantine</code> wechseln.', '<code>pct</code> ist veraltet und wurde aus dem neuen DMARC-Standard entfernt. Setzen Sie eine Richtlinie ganz oder gar nicht; Einträge mit <code>pct</code> unter 100 oder <code>t=y</code> zählen hier als Überwachung.'], record: REC_Q },
			{ id: 'filtered', title: 'Quarantäne: auf Ablehnen umstellen', body: ['Zeigen die Berichte, dass keine legitime Mail mehr betroffen ist, wechseln Sie auf <code>p=reject</code>. Empfangende Server werden dann aufgefordert, gefälschte Mails abzuweisen statt als Spam abzulegen.'], record: REC_R },
			{ id: 'blocked', title: 'Ablehnen: dranbleiben', body: ['Lassen Sie die Berichte weiterlaufen und prüfen Sie sie, wenn ein neuer Dienst in Ihrem Namen Mails verschicken soll. Sinnvolle nächste Schritte sind MTA-STS und TLS-RPT für verschlüsselte Zustellung.'] },
			{ id: 'unknown', title: 'Keine Daten', body: [`Wir kennen keine Website Ihrer Gemeinde, oder die Domain hat nicht geantwortet. Nennen Sie uns Ihre Domain über die <a href="${ISSUES}">Korrekturen</a>, dann nehmen wir sie auf.`] }
		],
		providerTitle: 'Sprechen Sie mit Ihrem IT-Dienstleister',
		provider: 'Viele Gemeinden teilen sich einen IT-Dienstleister oder die kantonale Informatik. Dort lässt sich DMARC oft für viele Gemeinden auf einmal einrichten. Die grossen Unterschiede zwischen den Kantonen deuten genau darauf hin.',
		toolsTitle: 'Werkzeuge, die helfen',
		toolsIntro: 'DMARC-Berichte kommen als XML-Dateien per Mail. Jedes Werkzeug, das sie lesen kann, ist recht: Die Einstufung hängt nur vom DNS-Eintrag ab, nicht vom Werkzeug.',
		tools: [
			{ label: 'Gehostet, kostenlos', html: `${A(CLOUDFLARE, 'Cloudflare DMARC Management')} (wenn Ihr DNS bei Cloudflare liegt); ${A(POSTMARK, 'Postmark DMARC Digests')} (wöchentliche Zusammenfassung per Mail).` },
			{ label: 'Gehostet, mit Support', html: `kommerzielle Dienste wie ${A(DMARCIAN, 'dmarcian')}.` },
			{ label: 'Selbst betrieben, Open Source', html: `${A(PARSEDMARC, 'parsedmarc')} (mit Elasticsearch/OpenSearch oder Splunk); <strong>${A(MARCAN, 'Marcan')}</strong> (ein einziger Container; vom Autor dieser Website).` },
			{ label: 'Zuerst beim IT-Dienstleister fragen', html: `Vielleicht betreibt er schon eines für alle seine Gemeinden.` }
		]
	},
	fr: {
		title: 'Comment protéger l’adresse d’expéditeur de votre commune',
		intro: [
			'DMARC indique aux serveurs de messagerie destinataires ce qu’ils doivent faire des e-mails qui prétendent venir de votre domaine mais échouent aux contrôles : les distribuer, les placer en spam ou les refuser.',
			'SPF seul ne suffit pas. SPF ne vérifie que l’adresse d’expédition cachée dans l’enveloppe du message, pas celle que les habitants voient dans leur messagerie. Seul DMARC relie SPF et DKIM à cette adresse visible.',
			'Cela vaut aussi pour les domaines qui n’envoient pas d’e-mails, par exemple celui du site web : n’importe qui peut envoyer des e-mails en leur nom. Ces domaines devraient publier directement <code>p=reject</code>.',
			'Pour les domaines qui envoient des e-mails, la démarche se fait par étapes. Chaque étape est un seul enregistrement DNS sous <code>_dmarc.votre-domaine.ch</code>.',
			'Les recommandations suivent la norme publiée (RFC 7489 / DMARCbis). Parlez-en à votre prestataire informatique avant de modifier des enregistrements.'
		],
		steps: [
			{ id: 'none', title: 'Pas de DMARC effectif : activer la surveillance', body: ['Publiez un enregistrement DMARC avec <code>p=none</code> et une adresse pour les rapports (<code>rua</code>). La distribution ne change pas ; vous recevez dès lors des rapports quotidiens des grands fournisseurs de messagerie.', 'Un enregistrement <code>p=none</code> sans <code>rua</code> compte ici comme « Pas de DMARC effectif » : il ne demande aucune mesure et personne ne reçoit de rapports.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Surveillance seule : analyser les rapports, puis appliquer', body: ['S’il manque <code>rua</code>, ajoutez-le d’abord : sans rapports, personne ne surveille rien.', 'Analysez les rapports pendant deux à quatre semaines. Vérifiez que tous les expéditeurs légitimes (newsletter, logiciel communal, facturation électronique, prestataire informatique) passent SPF ou DKIM pour votre domaine. Passez ensuite à <code>p=quarantine</code>.', '<code>pct</code> est obsolète et a été retiré de la nouvelle norme DMARC. Appliquez une politique entièrement ou pas du tout ; les enregistrements avec <code>pct</code> inférieur à 100 ou <code>t=y</code> comptent ici comme surveillance.'], record: REC_Q },
			{ id: 'filtered', title: 'Quarantaine : passer au rejet', body: ['Si les rapports montrent qu’aucun e-mail légitime n’est plus concerné, passez à <code>p=reject</code>. Les serveurs destinataires sont alors invités à rejeter les e-mails usurpés au lieu de les classer en spam.'], record: REC_R },
			{ id: 'blocked', title: 'Rejet : rester attentif', body: ['Gardez les rapports actifs et consultez-les lorsqu’un nouveau service doit envoyer des e-mails en votre nom. MTA-STS et TLS-RPT sont de bonnes étapes suivantes pour une distribution chiffrée.'] },
			{ id: 'unknown', title: 'Pas de données', body: [`Nous ne connaissons pas de site web de votre commune, ou le domaine n’a pas répondu. Indiquez-nous votre domaine via les <a href="${ISSUES}">corrections</a> et nous l’ajouterons.`] }
		],
		providerTitle: 'Parlez-en à votre prestataire informatique',
		provider: 'Beaucoup de communes partagent un prestataire informatique ou l’informatique cantonale. DMARC peut souvent y être configuré pour de nombreuses communes à la fois. Les grandes différences entre cantons le suggèrent.',
		toolsTitle: 'Des outils qui aident',
		toolsIntro: 'Les rapports DMARC arrivent par e-mail sous forme de fichiers XML. Tout outil capable de les lire convient : l’évaluation dépend uniquement de votre enregistrement DNS, pas de l’outil.',
		tools: [
			{ label: 'Hébergé, gratuit', html: `${A(CLOUDFLARE, 'Cloudflare DMARC Management')} (si votre DNS est chez Cloudflare) ; ${A(POSTMARK, 'Postmark DMARC Digests')} (résumé hebdomadaire par e-mail).` },
			{ label: 'Hébergé, avec support', html: `services commerciaux comme ${A(DMARCIAN, 'dmarcian')}.` },
			{ label: 'Auto-hébergé, open source', html: `${A(PARSEDMARC, 'parsedmarc')} (avec Elasticsearch/OpenSearch ou Splunk) ; <strong>${A(MARCAN, 'Marcan')}</strong> (un seul conteneur ; développé par l’auteur de ce site).` },
			{ label: 'Demandez d’abord à votre prestataire informatique', html: `il en exploite peut-être déjà un pour toutes ses communes.` }
		]
	},
	it: {
		title: 'Come proteggere l’indirizzo mittente del vostro comune',
		intro: [
			'DMARC dice ai server di posta riceventi cosa fare con le e-mail che sembrano provenire dal vostro dominio ma non superano i controlli: consegnarle, metterle nello spam o rifiutarle.',
			'SPF da solo non basta. SPF verifica solo l’indirizzo mittente nascosto nella busta del messaggio, non quello che i cittadini vedono nel loro programma di posta. Solo DMARC collega SPF e DKIM a questo indirizzo visibile.',
			'Questo vale anche per i domini che non inviano e-mail, ad esempio quello del sito web: chiunque può inviare e-mail a loro nome. Questi domini dovrebbero pubblicare subito <code>p=reject</code>.',
			'Per i domini che inviano e-mail si procede a tappe. Ogni tappa è un solo record DNS sotto <code>_dmarc.vostro-dominio.ch</code>.',
			'Le raccomandazioni seguono lo standard pubblicato (RFC 7489 / DMARCbis). Parlate con il vostro fornitore IT prima di modificare i record.'
		],
		steps: [
			{ id: 'none', title: 'Nessun DMARC efficace: attivare il monitoraggio', body: ['Pubblicate un record DMARC con <code>p=none</code> e un indirizzo per i rapporti (<code>rua</code>). La consegna non cambia; da subito ricevete rapporti giornalieri dai grandi provider di posta.', 'Un record <code>p=none</code> senza <code>rua</code> conta qui come «Nessun DMARC efficace»: non chiede alcuna misura e nessuno riceve rapporti.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Solo monitoraggio: analizzare i rapporti, poi applicare', body: ['Se manca <code>rua</code>, aggiungetelo prima: senza rapporti nessuno monitora nulla.', 'Analizzate i rapporti per due-quattro settimane. Verificate che tutti i mittenti legittimi (newsletter, software comunale, fatturazione elettronica, fornitore IT) superino SPF o DKIM per il vostro dominio. Poi passate a <code>p=quarantine</code>.', '<code>pct</code> è obsoleto ed è stato rimosso dal nuovo standard DMARC. Applicate una politica per intero o per niente; i record con <code>pct</code> inferiore a 100 o <code>t=y</code> contano qui come monitoraggio.'], record: REC_Q },
			{ id: 'filtered', title: 'Quarantena: passare al rifiuto', body: ['Quando i rapporti mostrano che nessuna e-mail legittima è più interessata, passate a <code>p=reject</code>. I server destinatari sono allora invitati a respingere le e-mail falsificate invece di metterle nello spam.'], record: REC_R },
			{ id: 'blocked', title: 'Rifiuto: restare vigili', body: ['Mantenete attivi i rapporti e controllateli quando un nuovo servizio deve inviare e-mail a vostro nome. MTA-STS e TLS-RPT sono buoni passi successivi per una consegna cifrata.'] },
			{ id: 'unknown', title: 'Nessun dato', body: [`Non conosciamo un sito web del vostro comune, oppure il dominio non ha risposto. Indicateci il vostro dominio tramite le <a href="${ISSUES}">correzioni</a> e lo aggiungeremo.`] }
		],
		providerTitle: 'Parlatene con il vostro fornitore IT',
		provider: 'Molti comuni condividono un fornitore IT o l’informatica cantonale. Lì DMARC si può spesso configurare per molti comuni in una volta. Le grandi differenze tra i cantoni lo suggeriscono.',
		toolsTitle: 'Strumenti utili',
		toolsIntro: 'I rapporti DMARC arrivano per e-mail come file XML. Va bene qualsiasi strumento in grado di leggerli: la valutazione dipende solo dal record DNS, non dallo strumento.',
		tools: [
			{ label: 'Ospitato, gratuito', html: `${A(CLOUDFLARE, 'Cloudflare DMARC Management')} (se il DNS è su Cloudflare); ${A(POSTMARK, 'Postmark DMARC Digests')} (riepilogo settimanale per e-mail).` },
			{ label: 'Ospitato, con supporto', html: `servizi commerciali come ${A(DMARCIAN, 'dmarcian')}.` },
			{ label: 'Self-hosted, open source', html: `${A(PARSEDMARC, 'parsedmarc')} (con Elasticsearch/OpenSearch o Splunk); <strong>${A(MARCAN, 'Marcan')}</strong> (un solo container; sviluppato dall’autore di questo sito).` },
			{ label: 'Chiedete prima al vostro fornitore IT', html: `forse ne gestisce già uno per tutti i suoi comuni.` }
		]
	},
	en: {
		title: 'How to protect your municipality’s sender address',
		intro: [
			'DMARC tells receiving mail servers what to do with mail that claims to come from your domain but fails the checks: deliver it, put it in spam, or reject it.',
			'SPF alone is not enough. SPF only checks the hidden envelope sender, not the address people see in their mail client. Only DMARC ties SPF and DKIM to that visible address.',
			'This also applies to domains that send no mail, such as the website’s: anyone can send mail in their name. Such domains should publish <code>p=reject</code> straight away.',
			'For domains that do send mail, you get there in steps. Each step is a single DNS record at <code>_dmarc.your-domain.ch</code>.',
			'Recommendations follow the published standard (RFC 7489 / DMARCbis). Talk to your IT provider before changing records.'
		],
		steps: [
			{ id: 'none', title: 'No effective DMARC: turn on monitoring', body: ['Publish a DMARC record with <code>p=none</code> and an address for reports (<code>rua</code>). Delivery does not change; from now on you get daily reports from the large mail providers.', 'A record with <code>p=none</code> but no <code>rua</code> counts as “No effective DMARC” here: it asks for no action and nobody receives reports.'], record: REC_NONE },
			{ id: 'monitoring', title: 'Monitoring only: read the reports, then enforce', body: ['If <code>rua</code> is missing, add it first: without reports, nobody is monitoring anything.', 'Read the reports for two to four weeks. Check that every legitimate sender (newsletter tool, municipal software, e-billing, IT provider) passes SPF or DKIM for your domain. Then move to <code>p=quarantine</code>.', '<code>pct</code> is obsolete and was removed from the new DMARC standard. Enforce a policy fully or not at all; records with <code>pct</code> below 100 or <code>t=y</code> count as monitoring here.'], record: REC_Q },
			{ id: 'filtered', title: 'Quarantine: move to reject', body: ['When the reports show that no legitimate mail is affected any more, move to <code>p=reject</code>. Receiving servers are then asked to reject spoofed mail instead of filing it as spam.'], record: REC_R },
			{ id: 'blocked', title: 'Reject: keep it that way', body: ['Keep the reports coming and check them whenever a new service should send mail in your name. Good next steps are MTA-STS and TLS-RPT for encrypted delivery.'] },
			{ id: 'unknown', title: 'No data', body: [`We know no website for your municipality, or the domain did not answer. Tell us your domain through the <a href="${ISSUES}">corrections</a> and we will add it.`] }
		],
		providerTitle: 'Talk to your IT provider',
		provider: 'Many municipalities share an IT provider or the cantonal IT office. DMARC can often be set up there for many municipalities at once. The large differences between cantons point to exactly that.',
		toolsTitle: 'Tools that help',
		toolsIntro: 'DMARC reports arrive by email as XML files. Any tool that reads them will do: this rating depends only on your DNS record, not on the tool.',
		tools: [
			{ label: 'Hosted, free', html: `${A(CLOUDFLARE, 'Cloudflare DMARC Management')} (if your DNS is at Cloudflare); ${A(POSTMARK, 'Postmark DMARC Digests')} (a weekly summary by email).` },
			{ label: 'Hosted, with support', html: `commercial services such as ${A(DMARCIAN, 'dmarcian')}.` },
			{ label: 'Self-hosted, open source', html: `${A(PARSEDMARC, 'parsedmarc')} (with Elasticsearch/OpenSearch or Splunk); <strong>${A(MARCAN, 'Marcan')}</strong> (a single container; built by the author of this site).` },
			{ label: 'Ask your IT provider first', html: `it may already run one for all its municipalities.` }
		]
	}
};

export const method: Record<Lang, Method> = {
	de: {
		title: 'Methode',
		sections: [
			{ title: 'Was gemessen wird', body: ['Für jede Gemeinde fragen wir drei öffentliche DNS-Einträge ihrer Maildomain ab: MX (empfängt die Domain Mails?), SPF und DMARC. Wir fragen nur öffentliche DNS-Resolver ab. Es werden keine Mails verschickt, und wir kontaktieren keine Server der Gemeinden.'] },
			{ title: 'Quellen', body: ['Gemeindeliste: amtliches Gemeindeverzeichnis des BFS. Websites: Wikidata. Die Maildomain stammt aus einer geprüften Liste: in der Regel die Domain der Website; wo die Gemeinde ihre Adresse nachweislich unter einer anderen Domain veröffentlicht, diese, mit Beleg. Nutzt eine Gemeinde mehrere Domains (etwa für Mail und Website), zählt die am schwächsten geschützte, denn mit jeder lassen sich Mails in ihrem Namen fälschen. Die Seite jeder Gemeinde zeigt alle Domains und welche davon für die Einstufung massgebend ist. Grenzen: swisstopo swissBOUNDARIES3D.', 'Die Abfragen laufen über Google Public DNS und Quad9 mit begrenzter Rate; die Antworten beider werden verglichen. Ohne Eintrag unter <code>_dmarc.domain</code> gilt der Eintrag der Organisationsdomain (z. B. <code>ne.ch</code> für <code>gemeinde.ne.ch</code>), mit deren <code>sp=</code>, falls gesetzt.'] },
			{ title: 'Grenzen', body: ['Für rund 550 Gemeinden ist die Maildomain auf der offiziellen Website belegt, darunter fast alle schlecht eingestuften Gemeinden der schwächsten Kantone; für die übrigen gilt die Domain der Website. In einer Zufallsstichprobe von 100 Gemeinden waren 3 falsch (inzwischen korrigiert); einige Dutzend Zuordnungen könnten also noch abweichen. Korrekturen sind willkommen. DKIM wird nicht geprüft, weil die Selektoren unbekannt sind. Die Messung ist eine Momentaufnahme der DNS-Einträge und sagt nichts darüber, wie einzelne Mails tatsächlich behandelt werden. Alle Gemeinden zählen gleich, unabhängig von der Einwohnerzahl.', 'Eine DMARC-Richtlinie ist eine Aufforderung an empfangende Server. Ob eine bestimmte Mail abgewiesen wird, hängt vom Empfänger und von der SPF/DKIM-Ausrichtung ab, die diese Momentaufnahme nicht prüft. Die Einstufung hängt nur von den DNS-Einträgen ab, von keinem Werkzeug.'] },
			{ title: 'Veröffentlichung', body: ['Alle Angaben, auch jene zu einzelnen Gemeinden, beruhen auf öffentlichen DNS-Einträgen, die jeder abfragen kann. Jede Gemeinde hat eine eigene Seite mit ihren Domains und deren Einstufung.'] }
		],
		rulesTitle: 'Einstufung',
		rules: [
			['blocked', '<code>p=reject</code>, ohne <code>pct</code> unter 100 und ohne <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, ohne <code>pct</code> unter 100 und ohne <code>t=y</code>'],
			['monitoring', '<code>p=none</code> mit Berichtsadresse (<code>rua</code>), oder eine Richtlinie mit <code>pct</code> unter 100 oder <code>t=y</code>'],
			['none', 'kein DMARC-Eintrag, ein ungültiger (z. B. mehrere Einträge), oder <code>p=none</code> ohne Berichtsadresse: Ein solcher Eintrag verlangt keine Massnahme, und niemand erhält Berichte'],
			['unknown', 'keine Website bekannt, die Domain existiert nicht, oder ein DNS-Fehler. Domains ohne MX werden nach ihrem DMARC-Eintrag eingestuft wie alle anderen.']
		],
		correctionsTitle: 'Korrekturen',
		corrections: [
			`Ist eine Maildomain falsch zugeordnet oder ein Eintrag inzwischen geändert? Schreiben Sie an ${MAIL} oder melden Sie es über die ${A(ISSUES, 'öffentlichen Issues auf GitHub')}. E-Mails werden nicht veröffentlicht.`,
			'Wir antworten innert 5 Arbeitstagen. Bestätigte Korrekturen werden innert 10 Arbeitstagen neu gemessen und veröffentlicht.',
			'Jede Korrektur erscheint unten im Korrekturprotokoll, mit Datum, Gemeinde und Änderung, ohne Namen der meldenden Person.'
		],
		faqTitle: 'Häufige Fragen',
		faq: [
			{ q: 'Warum wird eine Domain bewertet, die keine E-Mails empfängt?', a: 'Auch eine Domain ohne Postfach kann als gefälschter Absender verwendet werden. Mit einem DMARC-Eintrag <code>p=reject</code> erklärt die Inhaberin: «Von hier kommen keine E-Mails.» Ohne diesen Eintrag müssen empfangende Server raten.' },
			{ q: 'Warum zählt die am schwächsten geschützte Domain?', a: 'Jede Domain einer Gemeinde lässt sich einzeln fälschen. Eine ungeschützte Website-Domain genügt für eine glaubwürdige Fälschung. Die Gemeindeseite zeigt, welche Domain die Bewertung bestimmt hat.' },
			{ q: 'Unser IT-Dienstleister betreut unsere E-Mails. Warum sind wir aufgeführt?', a: 'Der Eintrag wird unter der Domain der Gemeinde veröffentlicht, unabhängig davon, wer sie betreibt. Ihr Dienstleister kann ihn in wenigen Minuten anpassen; die Anleitung auf dieser Seite beschreibt die Schritte.' },
			{ q: 'Wir haben einen DMARC-Eintrag. Warum «Kein wirksames DMARC»?', a: 'Ein Eintrag mit <code>p=none</code> ohne Berichtsadresse (<code>rua</code>) verlangt keine Massnahme, und niemand erhält Berichte. Ergänzen Sie eine <code>rua</code>-Adresse, dann gilt die Domain als «Nur Überwachung»; mit <code>p=quarantine</code> oder <code>p=reject</code> wird die Richtlinie durchgesetzt.' }
		]
	},
	fr: {
		title: 'Méthode',
		sections: [
			{ title: 'Ce qui est mesuré', body: ['Pour chaque commune, nous interrogeons trois enregistrements DNS publics de son domaine mail : MX (le domaine reçoit-il des e-mails ?), SPF et DMARC. Nous interrogeons uniquement des résolveurs DNS publics. Aucun e-mail n’est envoyé et nous ne contactons aucun serveur communal.'] },
			{ title: 'Sources', body: ['Liste des communes : répertoire officiel des communes de l’OFS. Sites web : Wikidata. Le domaine mail provient d’une liste vérifiée : en règle générale le domaine du site web ; lorsque la commune publie manifestement son adresse sous un autre domaine, celui-ci, avec la preuve. Si une commune utilise plusieurs domaines (par exemple pour le mail et le site web), c’est le moins protégé qui compte, car chacun permet d’envoyer de faux e-mails en son nom. La page de chaque commune montre tous les domaines et celui qui détermine l’évaluation. Limites : swisstopo swissBOUNDARIES3D.', 'Les requêtes passent par Google Public DNS et Quad9 avec un débit limité ; les réponses des deux sont comparées. Sans enregistrement sous <code>_dmarc.domaine</code>, c’est celui du domaine organisationnel qui s’applique (p. ex. <code>ne.ch</code> pour <code>commune.ne.ch</code>), avec son <code>sp=</code> s’il existe.'] },
			{ title: 'Limites', body: ['Pour environ 550 communes, le domaine mail est attesté sur le site officiel, dont presque toutes les communes mal classées des cantons les plus faibles ; pour les autres, c’est le domaine du site web. Dans un échantillon aléatoire de 100 communes, 3 étaient fausses (corrigées depuis) ; quelques dizaines d’attributions pourraient donc encore être inexactes. Les corrections sont bienvenues. DKIM n’est pas vérifié, car les sélecteurs sont inconnus. La mesure est un instantané des enregistrements DNS et ne dit rien du traitement réel de chaque e-mail. Toutes les communes comptent de la même manière, quelle que soit leur population.', 'Une politique DMARC est une demande adressée aux serveurs destinataires. Le rejet d’un message donné dépend du destinataire et de l’alignement SPF/DKIM, que cet instantané ne vérifie pas. L’évaluation dépend uniquement des enregistrements DNS, d’aucun outil.'] },
			{ title: 'Publication', body: ['Toutes les données, y compris celles par commune, reposent sur des enregistrements DNS publics que chacun peut consulter. Chaque commune a sa propre page avec ses domaines et leur classement.'] }
		],
		rulesTitle: 'Classification',
		rules: [
			['blocked', '<code>p=reject</code>, sans <code>pct</code> inférieur à 100 ni <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, sans <code>pct</code> inférieur à 100 ni <code>t=y</code>'],
			['monitoring', '<code>p=none</code> avec adresse de rapport (<code>rua</code>), ou une politique avec <code>pct</code> inférieur à 100 ou <code>t=y</code>'],
			['none', 'aucun enregistrement DMARC, un enregistrement invalide (p. ex. plusieurs), ou <code>p=none</code> sans adresse de rapport : un tel enregistrement ne demande aucune mesure et personne ne reçoit de rapports'],
			['unknown', 'aucun site web connu, domaine inexistant, ou erreur DNS. Les domaines sans MX sont classés selon leur enregistrement DMARC comme les autres.']
		],
		correctionsTitle: 'Corrections',
		corrections: [
			`Un domaine de messagerie mal attribué ou un enregistrement modifié entre-temps ? Écrivez à ${MAIL} ou signalez-le via les ${A(ISSUES, 'issues publiques sur GitHub')}. Les e-mails ne sont pas publiés.`,
			'Nous répondons dans les 5 jours ouvrables. Les corrections confirmées sont remesurées et publiées dans les 10 jours ouvrables.',
			'Chaque correction figure ci-dessous dans le journal des corrections, avec la date, la commune et le changement, sans le nom de la personne qui l’a signalée.'
		],
		faqTitle: 'Questions fréquentes',
		faq: [
			{ q: 'Pourquoi évaluer un domaine qui ne reçoit pas d’e-mails ?', a: 'Un domaine sans boîte aux lettres peut quand même servir d’expéditeur falsifié. Avec un enregistrement DMARC <code>p=reject</code>, son titulaire déclare : « aucun e-mail ne part d’ici ». Sans cet enregistrement, les serveurs destinataires doivent deviner.' },
			{ q: 'Pourquoi le domaine le moins protégé compte-t-il ?', a: 'Chaque domaine d’une commune peut être falsifié séparément. Un seul domaine de site web non protégé suffit pour un faux crédible. La page de la commune indique quel domaine a déterminé l’évaluation.' },
			{ q: 'Notre prestataire informatique gère nos e-mails. Pourquoi figurons-nous ici ?', a: 'L’enregistrement est publié sous le domaine de la commune, quel que soit l’exploitant. Votre prestataire peut le modifier en quelques minutes ; le guide de ce site décrit les étapes.' },
			{ q: 'Nous avons un enregistrement DMARC. Pourquoi « Pas de DMARC effectif » ?', a: 'Un enregistrement <code>p=none</code> sans adresse de rapport (<code>rua</code>) ne demande aucune mesure et personne ne reçoit de rapports. Ajoutez une adresse <code>rua</code> : le domaine passe alors en « Surveillance seule » ; avec <code>p=quarantine</code> ou <code>p=reject</code>, la politique est appliquée.' }
		]
	},
	it: {
		title: 'Metodo',
		sections: [
			{ title: 'Cosa si misura', body: ['Per ogni comune interroghiamo tre record DNS pubblici del suo dominio mail: MX (il dominio riceve e-mail?), SPF e DMARC. Interroghiamo solo resolver DNS pubblici. Non viene inviata alcuna e-mail e non contattiamo alcun server comunale.'] },
			{ title: 'Fonti', body: ['Elenco dei comuni: elenco ufficiale dei comuni dell’UST. Siti web: Wikidata. Il dominio mail proviene da un elenco verificato: di norma il dominio del sito web; dove il comune pubblica dimostrabilmente il suo indirizzo sotto un altro dominio, quest’ultimo, con la prova. Se un comune usa più domini (ad esempio per la posta e per il sito), conta quello meno protetto, perché con ognuno si possono falsificare e-mail a suo nome. La pagina di ogni comune mostra tutti i domini e quale determina la valutazione. Confini: swisstopo swissBOUNDARIES3D.', 'Le richieste passano da Google Public DNS e Quad9 con frequenza limitata; le risposte dei due vengono confrontate. Senza record sotto <code>_dmarc.dominio</code> vale quello del dominio organizzativo (p. es. <code>ti.ch</code> per <code>comune.ti.ch</code>), con il suo <code>sp=</code> se presente.'] },
			{ title: 'Limiti', body: ['Per circa 550 comuni il dominio mail è documentato sul sito ufficiale, tra cui quasi tutti i comuni classificati male dei cantoni più deboli; per gli altri vale il dominio del sito web. In un campione casuale di 100 comuni, 3 erano sbagliati (nel frattempo corretti); qualche decina di attribuzioni potrebbe quindi ancora non essere esatta. Le correzioni sono benvenute. DKIM non viene verificato perché i selettori sono sconosciuti. La misurazione è un’istantanea dei record DNS e non dice nulla sul trattamento effettivo delle singole e-mail. Tutti i comuni contano allo stesso modo, indipendentemente dalla popolazione.', 'Una politica DMARC è una richiesta ai server destinatari. Se un determinato messaggio viene respinto dipende dal destinatario e dall’allineamento SPF/DKIM, che questa istantanea non verifica. La valutazione dipende solo dai record DNS, non da alcuno strumento.'] },
			{ title: 'Pubblicazione', body: ['Tutti i dati, anche quelli per comune, si basano su record DNS pubblici che chiunque può consultare. Ogni comune ha una propria pagina con i suoi domini e la loro classificazione.'] }
		],
		rulesTitle: 'Classificazione',
		rules: [
			['blocked', '<code>p=reject</code>, senza <code>pct</code> inferiore a 100 né <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, senza <code>pct</code> inferiore a 100 né <code>t=y</code>'],
			['monitoring', '<code>p=none</code> con indirizzo per i rapporti (<code>rua</code>), oppure una politica con <code>pct</code> inferiore a 100 o <code>t=y</code>'],
			['none', 'nessun record DMARC, un record non valido (p. es. più record), oppure <code>p=none</code> senza indirizzo per i rapporti: un tale record non chiede alcuna misura e nessuno riceve rapporti'],
			['unknown', 'nessun sito web noto, dominio inesistente, o errore DNS. I domini senza MX sono classificati in base al loro record DMARC come gli altri.']
		],
		correctionsTitle: 'Correzioni',
		corrections: [
			`Un dominio mail attribuito male o un record cambiato nel frattempo? Scrivete a ${MAIL} oppure segnalatelo tramite le ${A(ISSUES, 'issue pubbliche su GitHub')}. Le e-mail non vengono pubblicate.`,
			'Rispondiamo entro 5 giorni lavorativi. Le correzioni confermate vengono rimisurate e pubblicate entro 10 giorni lavorativi.',
			'Ogni correzione compare qui sotto nel registro delle correzioni, con data, comune e modifica, senza il nome di chi l’ha segnalata.'
		],
		faqTitle: 'Domande frequenti',
		faq: [
			{ q: 'Perché viene valutato un dominio che non riceve e-mail?', a: 'Anche un dominio senza casella di posta può essere usato come mittente falsificato. Con un record DMARC <code>p=reject</code> il titolare dichiara: «da qui non parte alcuna e-mail». Senza questo record, i server destinatari devono tirare a indovinare.' },
			{ q: 'Perché conta il dominio meno protetto?', a: 'Ogni dominio di un comune può essere falsificato singolarmente. Basta un dominio del sito web non protetto per un falso credibile. La pagina del comune indica quale dominio ha determinato la valutazione.' },
			{ q: 'Il nostro fornitore informatico gestisce le nostre e-mail. Perché siamo elencati?', a: 'Il record è pubblicato sotto il dominio del comune, chiunque lo gestisca. Il vostro fornitore può modificarlo in pochi minuti; la guida su questo sito descrive i passaggi.' },
			{ q: 'Abbiamo un record DMARC. Perché «Nessun DMARC efficace»?', a: 'Un record <code>p=none</code> senza indirizzo per i rapporti (<code>rua</code>) non chiede alcuna misura e nessuno riceve rapporti. Aggiungete un indirizzo <code>rua</code>: il dominio passa a «Solo monitoraggio»; con <code>p=quarantine</code> o <code>p=reject</code> la politica viene applicata.' }
		]
	},
	en: {
		title: 'Method',
		sections: [
			{ title: 'What is measured', body: ['For each municipality we query three public DNS records of its mail domain: MX (does the domain receive mail?), SPF and DMARC. We query public DNS resolvers only. No mail is sent and no municipal server is contacted by us.'] },
			{ title: 'Sources', body: ['Municipality list: the FSO’s official register of municipalities. Websites: Wikidata. The mail domain comes from a checked list: usually the website’s domain; where the municipality demonstrably publishes its address under another domain, that one, with the evidence. If a municipality uses several domains (say, for mail and for the website), the least protected one counts, since each can be used to fake mail in its name. The municipality page shows each domain and which one determines the rating. Boundaries: swisstopo swissBOUNDARIES3D.', 'Queries go through Google Public DNS and Quad9 at a limited rate, and both answers are compared. Without a record at <code>_dmarc.domain</code>, the organizational domain’s record applies (e.g. <code>ne.ch</code> for <code>commune.ne.ch</code>), with its <code>sp=</code> if set.'] },
			{ title: 'Limits', body: ['For about 550 municipalities the mail domain is confirmed on the official website, including almost all poorly rated municipalities in the weakest cantons; for the rest, the website’s domain is used. In a random sample of 100 municipalities, 3 were wrong (since corrected), so a few dozen assignments may still be off. Corrections are welcome. DKIM is not checked, because the selectors are unknown. The measurement is a snapshot of DNS records and says nothing about how individual messages are actually handled. Every municipality counts the same, whatever its population.', 'A DMARC policy is a request to receiving servers. Whether a given message is rejected depends on the receiver and on SPF/DKIM alignment, which this snapshot does not check. The rating depends only on the DNS records, not on any tool.'] },
			{ title: 'Release', body: ['All data, including that for individual municipalities, comes from public DNS records that anyone can query. Each municipality has its own page with its domains and their rating.'] }
		],
		rulesTitle: 'Classification',
		rules: [
			['blocked', '<code>p=reject</code>, with no <code>pct</code> below 100 and no <code>t=y</code>'],
			['filtered', '<code>p=quarantine</code>, with no <code>pct</code> below 100 and no <code>t=y</code>'],
			['monitoring', '<code>p=none</code> with a report address (<code>rua</code>), or a policy with <code>pct</code> below 100 or <code>t=y</code>'],
			['none', 'no DMARC record, an invalid one (e.g. several records), or <code>p=none</code> without a report address: such a record asks for no action and nobody receives reports'],
			['unknown', 'no known website, the domain does not exist, or a DNS error. Domains without MX are rated by their DMARC record like all others.']
		],
		correctionsTitle: 'Corrections',
		corrections: [
			`Mail domain assigned wrongly, or a record changed since? Write to ${MAIL} or report it in the ${A(ISSUES, 'public issues on GitHub')}. Emails are not published.`,
			'We answer within 5 working days. Confirmed corrections are rescanned and published within 10 working days.',
			'Every correction appears in the correction log below, with date, municipality and what changed, without the reporter’s name.'
		],
		faqTitle: 'Frequent questions',
		faq: [
			{ q: 'Why is a domain that receives no mail rated?', a: 'A domain without a mailbox can still be used as a forged sender. A DMARC record with <code>p=reject</code> is how its owner says “no mail comes from here”. Without it, receiving servers have to guess.' },
			{ q: 'Why does the least protected domain count?', a: 'Each domain of a municipality can be forged on its own. One unprotected website domain is enough for a convincing fake. The municipality’s page shows which domain decided the rating.' },
			{ q: 'Our IT provider handles our mail. Why are we listed?', a: 'The record is published under the municipality’s domain, whoever operates it. Your provider can change it in a few minutes; the guide on this site describes the steps.' },
			{ q: 'We have a DMARC record. Why “no effective DMARC”?', a: 'A <code>p=none</code> record without a report address (<code>rua</code>) asks for no action, and nobody receives reports. Add an <code>rua</code> address and the domain counts as “Monitoring only”; with <code>p=quarantine</code> or <code>p=reject</code> the policy is enforced.' }
		]
	}
};
