//! Website URL -> web domain, and organizational domains for the DMARC fallback.

/// Cantonal domains. Municipalities hosted under one (`<x>.zh.ch`) keep the
/// label below it, since the canton's own domain says nothing about theirs.
const CANTONAL: [&str; 26] = [
    "zh.ch", "be.ch", "lu.ch", "ur.ch", "sz.ch", "ow.ch", "nw.ch", "gl.ch", "zg.ch", "fr.ch",
    "so.ch", "bs.ch", "bl.ch", "sh.ch", "ar.ch", "ai.ch", "sg.ch", "gr.ch", "ag.ch", "tg.ch",
    "ti.ch", "vd.ch", "vs.ch", "ne.ch", "ge.ch", "ju.ch",
];

/// Lower-cased host of a URL, without port, trailing dot or `www.`.
pub fn host_of(url: &str) -> Option<String> {
    let rest = url.split_once("://").map_or(url, |(_, r)| r);
    let host = rest.split(['/', '?', '#']).next()?;
    let host = host.rsplit_once('@').map_or(host, |(_, h)| h);
    let host = host.split(':').next()?.trim_end_matches('.');
    // IDN (twann-tüscherz.ch) to its ASCII form, which is what DNS answers for.
    let host = idna::domain_to_ascii(host).ok()?;
    let host = host.strip_prefix("www.").unwrap_or(&host).to_string();
    (host.contains('.') && !host.is_empty()).then_some(host)
}

/// The domain a municipality's mail most likely uses, derived from its website.
/// A page on the canton's own site (`www.ti.ch/porza`) gives none: the
/// canton's domain is not the municipality's (overrides can say otherwise).
pub fn web_domain(url: &str) -> Option<String> {
    let host = host_of(url)?;
    let registrable = organizational_domain(&host)?;
    if CANTONAL.contains(&registrable.as_str()) {
        if host == registrable {
            return None;
        }
        let below = host.strip_suffix(&format!(".{registrable}"))?;
        let label = below.rsplit('.').next()?;
        return Some(format!("{label}.{registrable}"));
    }
    Some(registrable)
}

/// Organizational domain per the Public Suffix List (RFC 7489 section 3.2).
pub fn organizational_domain(name: &str) -> Option<String> {
    psl::domain_str(name).map(str::to_string)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plain_and_www() {
        assert_eq!(web_domain("https://www.gemeinde-x.ch/de/").as_deref(), Some("gemeinde-x.ch"));
        assert_eq!(web_domain("http://sub.gemeinde-x.ch").as_deref(), Some("gemeinde-x.ch"));
        assert_eq!(web_domain("https://WWW.Example.CH:443").as_deref(), Some("example.ch"));
    }

    #[test]
    fn cantonal_subdomain_kept() {
        assert_eq!(web_domain("https://www.boudry.ne.ch").as_deref(), Some("boudry.ne.ch"));
        assert_eq!(web_domain("https://www.gemeinde.x.zh.ch/a").as_deref(), Some("x.zh.ch"));
        assert_eq!(web_domain("https://www.ne.ch").as_deref(), None);
        assert_eq!(web_domain("http://www.ti.ch/porza").as_deref(), None);
    }

    #[test]
    fn idn_to_ascii() {
        assert_eq!(web_domain("https://www.twann-tüscherz.ch").as_deref(), Some("xn--twann-tscherz-2ob.ch"));
    }

    #[test]
    fn org_domain() {
        assert_eq!(organizational_domain("boudry.ne.ch").as_deref(), Some("ne.ch"));
        assert_eq!(organizational_domain("example.ch").as_deref(), Some("example.ch"));
    }
}
