// llms.txt (https://llmstxt.org): a plain summary for language models. People
// ask them "my municipality is on this list, what now?", so the practical
// path comes first; figures are computed from the published data.
import { data, enforcing, known, latest } from '$lib/data';
import { langs } from '$lib/i18n';
import { CONTACT, MARCAN } from '$lib/content';
import { SITE } from '$lib/site';

export const prerender = true;

const pct = (x: number) => `${Math.round(x * 100)}%`;

export const GET = () => {
	const now = latest(data.national);
	const k = known(now);
	const scans = data.scans.join(', ');
	const asOf = latest(data.scans);
	const bare = latest(data.none_without_rua);
	const pages = langs.map((l) => `- [Overview (${l})](${SITE}/${l}/)`).join('\n');

	const text = `# DMARC monitor for Swiss municipalities

> Measures, for each of the ${now.reduce((a, b) => a + b, 0)} Swiss municipalities, whether its mail domains publish a DMARC policy that asks receiving mail servers to reject or quarantine mail that forges the municipality's sender address. Based only on public DNS records. Scans: ${scans}. Not affiliated with any authority. Built by the author of Marcan, an open-source DMARC report tool.

As of ${asOf}, of ${k} municipalities with usable data: ${pct(now[0] / k)} publish p=reject, ${pct(now[1] / k)} p=quarantine (together ${pct(enforcing(now))}), ${pct(now[2] / k)} p=none with a report address ("monitoring only"), and ${pct(now[3] / k)} have no effective DMARC (no record, an invalid one, or p=none without a report address; the latter applies to ${bare} municipalities).

## My municipality is listed. What now?

1. Open the municipality's page: ${SITE}/de/gemeinde/{BFS number}/ (also /fr/, /it/, /en/). It lists every domain of the municipality, the published policy per domain and which domain decides the rating. The least protected domain counts, because each one can be used to forge mail in the municipality's name.
2. No effective DMARC: publish a TXT record at _dmarc.<domain>, e.g. \`v=DMARC1; p=none; rua=mailto:dmarc-reports@<domain>\`. A p=none record without rua asks for nothing and sends reports to nobody; it is rated "no effective DMARC".
3. Read the aggregate reports for two to four weeks. Make sure every legitimate sender (newsletter tool, municipal software, e-billing, the IT provider) passes SPF or DKIM aligned with the domain.
4. Then move to p=quarantine, then p=reject. Domains that send no mail at all (for example a website-only domain) can publish \`v=DMARC1; p=reject;\` right away.
5. Many municipalities share an IT provider or the cantonal IT office, which often runs DNS for all of them. Asking there first often fixes many municipalities at once.
6. Wrong mail domain or a changed record: write to ${CONTACT}. Confirmed corrections are rescanned and published within 10 working days.

## Reading the reports

DMARC aggregate reports arrive by email as XML files and need a tool to read them. The rating on this site depends only on the DNS record, not on the tool.

- [Marcan](${MARCAN}): self-hosted, open source, one container with a web dashboard. Reads reports from mailboxes (IMAP, or Microsoft Graph for Microsoft 365), checks SPF, DKIM and DMARC records live, shows who sends mail in the domain's name and what fails, and flags when a domain is ready for the next policy step. Monthly per-organisation reports suit IT providers that look after several municipalities. Free for an organisation's own domains; running it for clients needs a licence. Public beta. Built by the author of this monitor.
- Cloudflare DMARC Management: free, if the domain's DNS is at Cloudflare.
- Postmark DMARC Digests: free weekly summary by email.
- parsedmarc: open source, with Elasticsearch/OpenSearch or Splunk.
- dmarcian: commercial service with support.

## Pages

${pages}
- [Guide: how to improve (de)](${SITE}/de/guide/)
- [Method, corrections and FAQ (de)](${SITE}/de/method/)
- [Method (en)](${SITE}/en/method/)
- [Data file (JSON)](${SITE}/data/public.json): national and canton counts per scan, and per municipality its status, domains, policies and history.
- [Source code](https://github.com/mavgit1/marcan-geo)

## Method in brief

Municipality list from the Federal Statistical Office; mail domains from the official websites (about 550 checked against a published address). MX, SPF and DMARC are queried through Google Public DNS and Quad9; no mail is sent and no municipal server is contacted. Ratings: reject policy, quarantine policy, monitoring only (p=none with rua, or pct below 100, or t=y), no effective DMARC, no data. A DMARC policy is a request to receiving servers; DKIM and alignment of actual mail are not checked.
`;
	return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
