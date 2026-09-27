"""Build the bilingual, dependency-free pTakeoff marketing pages."""

from __future__ import annotations

from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOWNLOAD = "https://github.com/Tompula86/takeoff-releases/releases/latest"


def tx(lang: str, fi: str, en: str) -> str:
    return fi if lang == "fi" else en


def href(lang: str, page: str = "") -> str:
    prefix = "/" if lang == "fi" else "/en/"
    return prefix + (page + "/" if page else "")


def link(lang: str, page: str, label: str, cls: str = "") -> str:
    return f'<a class="{cls}" href="{href(lang, page)}">{label}</a>'


def tag(lang: str, fi: str, en: str) -> str:
    return escape(tx(lang, fi, en))


def header(lang: str, current: str) -> str:
    nav = [
        ("pquant", "pQuant"),
        ("pfield", "pField"),
        ("psite", "pSite"),
        ("beta", tag(lang, "Beta ja saatavuus", "Beta & availability")),
        ("contact", tag(lang, "Palaute", "Feedback")),
    ]
    links = "".join(
        f'<a href="{href(lang, page)}"{" aria-current=\"page\"" if current == page else ""}>{label}</a>'
        for page, label in nav
    )
    other = "en" if lang == "fi" else "fi"
    fi_url = href("fi", current)
    en_url = href("en", current)
    return f"""
<a class="skip-link" href="#main">{tag(lang, "Siirry sisältöön", "Skip to content")}</a>
<header class="site-header">
  <div class="shell header-inner">
    <a class="brand" href="{href(lang)}" aria-label="pTakeoff — {tag(lang, "etusivu", "home")}">
      <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>pTakeoff<span class="brand-dot">.</span></span>
    </a>
    <nav class="desktop-nav" aria-label="{tag(lang, "Päänavigaatio", "Main navigation")}">{links}</nav>
    <div class="header-actions">
      <div class="language-switch" aria-label="{tag(lang, "Kieli", "Language")}">
        <a href="{fi_url}" lang="fi"{" aria-current=\"true\"" if lang == "fi" else ""}>FI</a>
        <span aria-hidden="true">/</span>
        <a href="{en_url}" lang="en"{" aria-current=\"true\"" if lang == "en" else ""}>EN</a>
      </div>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="{tag(lang, "Avaa valikko", "Open menu")}"><span></span><span></span></button>
    </div>
  </div>
  <nav id="mobile-nav" class="mobile-nav" aria-label="{tag(lang, "Mobiilinavigaatio", "Mobile navigation")}" hidden>{links}</nav>
</header>"""


def footer(lang: str) -> str:
    docs = "/ohjeet.html" if lang == "fi" else "/docs.html"
    privacy = "/tietosuoja.html" if lang == "fi" else "/privacy.html"
    terms = "/ehdot.html" if lang == "fi" else "/terms.html"
    cookies = "/evasteet.html" if lang == "fi" else "/cookies.html"
    return f"""
<footer class="site-footer">
  <div class="shell footer-grid">
    <div><a class="brand footer-brand" href="{href(lang)}"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>pTakeoff<span class="brand-dot">.</span></span></a>
      <p>{tag(lang, "Työkaluja suunnitelmasta työmaalle.", "Tools from plan to site.")}</p></div>
    <div><strong>{tag(lang, "Tuotteet", "Products")}</strong><a href="{href(lang, "pquant")}">pQuant</a><a href="{href(lang, "pfield")}">pField</a><a href="{href(lang, "psite")}">pSite</a></div>
    <div><strong>{tag(lang, "Tutustu", "Explore")}</strong><a href="{href(lang, "beta")}">{tag(lang, "Beta ja saatavuus", "Beta & availability")}</a><a href="{href(lang, "contact")}">{tag(lang, "Palaute ja yhteys", "Feedback & contact")}</a><a href="{docs}">{tag(lang, "pQuant-ohjeet", "pQuant documentation")}</a></div>
    <div><strong>{tag(lang, "Tietoa", "Information")}</strong><a href="{privacy}">{tag(lang, "Tietosuoja", "Privacy")}</a><a href="{terms}">{tag(lang, "pQuantin lisenssiehdot", "pQuant license terms")}</a><a href="{cookies}">{tag(lang, "Evästeet", "Cookies")}</a></div>
  </div>
  <div class="shell footer-bottom"><span>© 2026 pTakeoff</span><span>{tag(lang, "Sivun tuotetilanne päivitetty 26.9.2026", "Product status updated 26 Sep 2026")}</span></div>
</footer>"""


def shell(lang: str, page: str, title: str, description: str, content: str, image: str = "/assets/hero_ui.png") -> str:
    url = "https://ptakeoff.com" + href(lang, page)
    alt_url = "https://ptakeoff.com" + href("en" if lang == "fi" else "fi", page)
    return f"""<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1018">
  <meta name="description" content="{escape(description, quote=True)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="{lang}" href="{url}">
  <link rel="alternate" hreflang="{'en' if lang == 'fi' else 'fi'}" href="{alt_url}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/site.css">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="pTakeoff">
  <meta property="og:locale" content="{'fi_FI' if lang == 'fi' else 'en_US'}">
  <meta property="og:title" content="{escape(title, quote=True)}">
  <meta property="og:description" content="{escape(description, quote=True)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="https://ptakeoff.com{image}">
  <title>{escape(title)}</title>
  <script src="/site.js" defer></script>
</head>
<body class="page-{page or 'home'}">
{header(lang, page)}
<main id="main">{content}</main>
{footer(lang)}
</body>
</html>
"""


def eyebrow(number: str, name: str) -> str:
    return f'<span class="eyebrow"><span class="eyebrow-number">{number}</span>{name}</span>'


def home(lang: str) -> str:
    t = lambda fi, en: tag(lang, fi, en)
    products = [
        ("pquant", "01", "pQuant", t("Määrälaskenta", "Quantity takeoff"), t("PDF-suunnitelmasta mitatut määrät, reseptit ja muokattava Excel.", "Measure PDFs, calculate with recipes and export editable Excel."), "/assets/hero_ui.png", t("Windows · julkinen kokeilu", "Windows · public trial"), t("Tutustu pQuantiin", "Explore pQuant")),
        ("pfield", "02", "pField", t("Infra ja CAD", "Infrastructure & CAD"), t("Pinnat, linjaukset ja putkiverkot samassa 3D-suunnittelutyössä.", "Surfaces, alignments and pipe networks in a 3D design workspace."), None, t("Windows · rajattu beta", "Windows · limited beta"), t("Tutustu pFieldiin", "Explore pField")),
        ("psite", "03", "pSite", t("Kenttäkatselu", "Field viewing"), t("Paikalliset mallit ja aineistot mukana Android-laitteella.", "Local models and project data on an Android device."), None, t("Android · kehitysvaihe", "Android · in development"), t("Tutustu pSiteen", "Explore pSite")),
    ]
    cards = ""
    for slug, num, name, kind, desc, img, status, cta in products:
        media = (f'<img src="{img}" alt="" loading="lazy">' if img else
                 f'<div class="card-placeholder" aria-hidden="true"><span>{num} / 03</span><strong>{name}</strong><small>{t("Kuvakaappaus tulossa", "Screenshot coming later")}</small></div>')
        cards += f"""
      <a class="product-card product-{slug}" href="{href(lang, slug)}">
        <div class="product-card-top"><span>{num} / 03</span><span class="status-dot">{status}</span></div>
        <div class="product-card-image">{media}</div>
        <div class="product-card-copy"><small>{kind}</small><h3>{name}</h3><p>{desc}</p><span class="text-link">{cta}<b aria-hidden="true">↗</b></span></div>
      </a>"""
    return f"""
<section class="home-hero">
  <div class="hero-orbit hero-orbit-one" aria-hidden="true"></div><div class="hero-orbit hero-orbit-two" aria-hidden="true"></div>
  <div class="shell hero-inner">
    <div class="hero-copy">
      {eyebrow("PT / 01", t("Rakentamisen ja infran työkalut", "Tools for construction and infrastructure"))}
      <h1>{t("Takeoffista lopulliseen", "From takeoff to final")} <em>{t("asentamiseen.", "installation.")}</em></h1>
      <p class="hero-lede">{t("Mittaa ja laske suunnitelmista. Suunnittele infraa 3D:ssä. Tarkastele malleja työmaalla.", "Measure and estimate from plans. Design infrastructure in 3D. View models on site.")}</p>
      <div class="action-row"><a class="button button-primary" href="#products">{t("Tutustu tuotteisiin", "Explore the products")} <span aria-hidden="true">↗</span></a><a class="button button-quiet" href="{href(lang, "beta")}">{t("Katso beta ja saatavuus", "See beta & availability")} <span aria-hidden="true">→</span></a></div>
      <p class="hero-note">{t("Kolme erillistä tuotetta. Näet jokaisen nykyisen tilanteen sen omalla sivulla.", "Three distinct products. Each product page shows its current availability.")}</p>
    </div>
    <div class="hero-stage" aria-label="{t("Tuoteperheen esikatselu", "Product family preview")}">
      <div class="stage-top"><span>pTakeoff / {t("tuoteperhe", "product family")}</span><span>01 — 03</span></div>
      <figure class="stage-main"><img src="/assets/hero_ui.png" alt="{t("pQuantin PDF-mittausnäkymä, jossa suunnitelman määrät näkyvät oikealla", "pQuant PDF takeoff view with measured quantities on the right")}" fetchpriority="high"><figcaption>01 / pQuant · PDF takeoff</figcaption></figure>
      <figure class="stage-field"><div class="stage-placeholder" aria-hidden="true"><strong>pField</strong><span>{t("Kuva tulossa", "Image to follow")}</span></div><figcaption>02 / pField · 3D CAD</figcaption></figure>
      <figure class="stage-site"><div class="stage-placeholder" aria-hidden="true"><strong>pSite</strong></div><figcaption>03 / pSite</figcaption></figure>
    </div>
  </div>
</section>
<section class="section products-section" id="products"><div class="shell">
  <div class="section-intro">{eyebrow("01 / 04", t("Tuoteperhe", "The product family"))}<div class="section-head"><h2>{tx(lang, "Kolme työkalua.<br>Yksi selkeä suunta.", "Three tools.<br>One clear direction.")}</h2><p>{t("Valitse työvaiheesi mukaan. Jokaisella tuotteella on oma käyttötarkoitus, alusta ja tämänhetkinen saatavuus.", "Choose the tool for your task. Each has its own role, platform and current availability.")}</p></div></div>
  <div class="products-grid">{cards}</div>
</div></section>
<section class="section workflow-section"><div class="shell">
  <div class="section-intro">{eyebrow("02 / 04", t("Työnkulku", "The workflow"))}<div class="section-head"><h2>{t("Suunnitelma kulkee työn mukana.", "Keep the plan close to the work.")}</h2><p>{t("Tuotteet vastaavat eri työvaiheisiin. Näytämme ne rinnakkain väittämättä automaattista tiedonsiirtoa niiden välillä.", "The products serve different stages of work. They are shown together without implying automatic data transfer between them.")}</p></div></div>
  <div class="workflow-line"><article><span>01</span><h3>{t("Laske", "Estimate")}</h3><p>{t("PDF-piirustuksen mitat ja kustannusreseptit pQuantissa.", "PDF measurements and cost recipes in pQuant.")}</p></article><article><span>02</span><h3>{t("Suunnittele", "Design")}</h3><p>{t("Pinnat, linjaukset ja verkostot pFieldissä.", "Surfaces, alignments and networks in pField.")}</p></article><article><span>03</span><h3>{t("Tarkastele", "Inspect")}</h3><p>{t("Aineistot ja 3D-kohteet pSitessä työmaalla.", "Project data and 3D objects in pSite on location.")}</p></article></div>
</div></section>
<section class="section proof-section"><div class="shell proof-grid"><div>{eyebrow("03 / 04", t("Tuotekuvat", "Product imagery"))}<h2>{t("Näytetään se, mitä tuote oikeasti tekee.", "Show what the product really does.")}</h2><p>{t("pQuantin näkymä on oikea ohjelmistokuva. pFieldin ja pSiten paikat täytetään myöhemmin itse otetuilla, nykyistä versiota vastaavilla kuvakaappauksilla.", "The pQuant view is a real software capture. We will fill the pField and pSite slots later with our own screenshots from the current versions.")}</p><a class="text-link" href="{href(lang, "pfield")}">{t("Katso pField tarkemmin", "See pField in detail")} ↗</a></div><div class="proof-image proof-placeholder" role="img" aria-label="{t("pFieldin kuvakaappaus lisätään myöhemmin", "pField screenshot will be added later")}"><div><small>02 / pField</small><strong>{t("Oikea ohjelmistokuva tulossa", "Real product image to follow")}</strong></div><span>pField / {t("kuvapaikka", "image slot")}</span></div></div></section>
<section class="section availability-strip"><div class="shell availability-inner"><div>{eyebrow("04 / 04", t("Beta ja saatavuus", "Beta & availability"))}<h2>{t("Kokeile sitä, mikä on saatavilla nyt.", "Try what is available now.")}</h2><p>{t("pQuantin kokeilu on ladattavissa. pFieldin beta on rajattu; pSiteä kehitetään Androidille. Päivitämme tilanteen tuotesivuille.", "The pQuant trial is available to download. pField has a limited beta; pSite is in development for Android. The product pages carry current status.")}</p></div><a class="button button-primary" href="{href(lang, "beta")}">{t("Katso nykyinen tilanne", "Check current status")} ↗</a></div></section>"""


def feature(label: str, title: str, body: str) -> str:
    return f'<article class="feature-block"><span>{label}</span><h3>{title}</h3><p>{body}</p></article>'


def image_slot(lang: str, product: str, subject: str, size: str, extra_class: str = "") -> str:
    pending = tag(lang, "Oma kuvakaappaus lisätään myöhemmin", "Our screenshot will be added later")
    class_name = "shot-placeholder" + (" " + extra_class if extra_class else "")
    return (f'<div class="{class_name}" role="img" aria-label="{product}: {subject}. {pending}">'
            f'<span>{product} / {pending}</span><strong>{subject}</strong>'
            f'<small>{tag(lang, "Kuvapaikka", "Image slot")} {size}</small></div>')


def product_page(lang: str, slug: str) -> str:
    t = lambda fi, en: tag(lang, fi, en)
    if slug == "pquant":
        number, category = "01", t("Määrälaskenta / Windows", "Quantity takeoff / Windows")
        headline = tx(lang, "Suunnitelman viivat.<br><em>Selkeät määrät.</em>", "Lines on a plan.<br><em>Quantities you can use.</em>")
        intro = t("Mittaa pituudet, pinta-alat ja kappaleet PDF-piirustuksista. Liitä määrät kustannusresepteihin ja vie tulokset muokattavaan Exceliin.", "Measure lengths, areas and counts from PDF drawings. Connect quantities to cost recipes and export editable Excel files.")
        status = t("Julkinen 30 päivän kokeilu · Windows x64", "Public 30-day trial · Windows x64")
        cta = f'<a class="button button-primary" href="{DOWNLOAD}" data-download="pquant">{t("Lataa pQuant-kokeilu", "Download pQuant trial")} ↗</a>'
        media = f'<img src="/assets/hero_ui.png" alt="{t("pQuantin PDF-mittausnäkymä", "pQuant PDF takeoff interface")}" fetchpriority="high">'
        media_caption = "pQuant / PDF takeoff"
        features = [
            feature("01", t("Mittaa suunnitelmasta", "Measure from the plan"), t("Kalibroi PDF-sivu ja mittaa viivoja, alueita sekä kappaleita suoraan piirustuksen päältä.", "Calibrate a PDF page and measure lines, areas and counts directly on the drawing.")),
            feature("02", t("Laske resepteillä", "Estimate with recipes"), t("Yhdistä mitatut määrät materiaaliin, työhön ja kalustoon. Näe laskelman rakenne.", "Connect measured quantities to materials, labour and equipment. See how the estimate is built.")),
            feature("03", t("Jatka Excelissä", "Continue in Excel"), t("Vie määräluettelo ja kustannusarvio muokattavaan .xlsx-tiedostoon.", "Export the quantity list and cost estimate to an editable .xlsx file.")),
        ]
        gallery = f'<figure class="media-frame"><img src="/assets/recipe_ui.png" alt="{t("pQuantin kustannusreseptin näkymä", "pQuant cost recipe view")}" loading="lazy"><figcaption>{t("Reseptit", "Recipes")}</figcaption></figure><figure class="media-frame"><img src="/assets/excel_ui.png" alt="{t("pQuantin Excel-viennin esikatselu", "pQuant Excel export preview")}" loading="lazy"><figcaption>Excel / .xlsx</figcaption></figure>'
        note = t("Kokeilu alkaa ensimmäisestä käynnistyksestä ja kestää 30 päivää. Beta-avainta voi pyytää erikseen. Asennuspaketti ja sen huomautukset löytyvät julkaisutietojen yhteydestä.", "The 30-day trial begins at first launch. A beta key can be requested separately. See the release page for installer details and notes.")
    elif slug == "pfield":
        number, category = "02", t("Infra ja CAD / Windows", "Infrastructure & CAD / Windows")
        headline = tx(lang, "Suunnittele infraa.<br><em>Näe rakenne 3D:ssä.</em>", "Design infrastructure.<br><em>See the structure in 3D.</em>")
        intro = t("pField yhdistää CAD-työn, suunnitelmapinnat, linjaukset, corridorit ja putkiverkot samaan malliin. Tutki geometriaa tasossa, leikkauksessa ja 3D-näkymässä.", "pField brings CAD work, design surfaces, alignments, corridors and pipe networks into one model. Inspect geometry in plan, section and 3D.")
        status = t("Rajattu beta · Windows", "Limited beta · Windows")
        cta = f'<a class="button button-primary" href="{href(lang, "beta")}?product=pfield#request">{t("Hae beta-pääsyä", "Request beta access")} ↗</a>'
        media = image_slot(lang, "pField", t("CAD ja infra 3D:ssä", "Infrastructure CAD in 3D"), "1600 × 1000", "hero-placeholder")
        media_caption = ""
        features = [
            feature("01", t("Linjaukset ja corridorit", "Alignments and corridors"), t("Luo ja tarkastele suunnitelmapintoja sekä linjauksiin sidottua corridor-geometriaa.", "Create and inspect design surfaces and corridor geometry tied to alignments.")),
            feature("02", t("Putket ja valaisinperustukset", "Pipes and lighting foundations"), t("Suunnittele putkiverkkoja ja kaivoja sekä mallinna valaisinperustukset erillisinä rakenteina.", "Design pipe networks and manholes, and model lighting foundations as separate structures.")),
            feature("03", t("CAD ja LandXML", "CAD and LandXML"), t("Työskentele CAD- ja LandXML/Inframodel-aineistojen kanssa tuotteen tukemissa rajatuissa työnkuluissa.", "Work with CAD and LandXML/Inframodel data through the product's supported workflows.")),
        ]
        gallery = (image_slot(lang, "pField", t("Putkiverkko tasossa", "Pipe network in plan view"), "1600 × 1000")
                   + image_slot(lang, "pField", t("Corridor ja pinta", "Corridor and surface"), "1600 × 1000"))
        note = t("Lisenssin suunniteltu 30 päivän kokeilu alkaa ensimmäisestä käynnistyksestä myös offline-tilassa. Beta jatkuu omistajan päättymisilmoituksen jälkeen 90 päivää. Windows-asentimen GitHub-latauslinkki lisätään ensimmäisen julkaisun ilmestyttyä.", "The planned 30-day trial begins on first launch, including offline. Beta access continues for 90 days after the owner's end notice. A GitHub download link for the Windows installer will be added when the first release is available.")
    else:
        number, category = "03", t("Kenttäkatselu / Android", "Field viewing / Android")
        headline = tx(lang, "Malli mukana.<br><em>Työmaa edessä.</em>", "The model in hand.<br><em>The site in view.</em>")
        intro = t("pSite tuo paikalliset suunnitelma-aineistot Android-laitteelle. Tarkastele 3D-mallia, tasoja, putkia ja kaivoja sekä pistepilven esikatselua paikan päällä.", "pSite brings local project data to an Android device. Inspect 3D models, layers, pipes, manholes and point-cloud previews on location.")
        status = t("Kehitysvaihe · Android", "In development · Android")
        cta = f'<a class="button button-primary" href="{href(lang, "beta")}?product=psite#request">{t("Seuraa testivaihetta", "Follow the testing phase")} ↗</a>'
        media = image_slot(lang, "pSite", t("Mallin katselu Androidilla", "Model viewing on Android"), "1080 × 2340", "hero-placeholder")
        media_caption = ""
        features = [
            feature("01", t("Avaa aineistot paikallisesti", "Open local data"), t("Valmistele aineistot laitteelle ja avaa projekti ilman jatkuvaa verkkoyhteyttä.", "Prepare data on the device and open the project without a continuous connection.")),
            feature("02", t("Tutki mallia", "Inspect the model"), t("Vaihda tasoja, liiku 3D-näkymässä ja avaa kohteen lähdetiedot Tutki-paneelissa.", "Switch layers, navigate the 3D view and inspect source object details.")),
            feature("03", t("Näe lähteen rajat", "See data limits"), t("Aineistoraportti kertoo, mikä piirtyi, mikä jäi pois ja miksi.", "The data report shows what was drawn, what was left out and why.")),
        ]
        gallery = (image_slot(lang, "pSite", t("3D-näkymä puhelimessa", "3D view on a phone"), "1080 × 2340")
                   + image_slot(lang, "pSite", t("Tasot ja Tutki", "Layers and Inspect"), "1080 × 2340"))
        note = t("pSite on katselutyökalu. Se ei tässä vaiheessa lupaa RTK-mittausta, tarkepisteiden tallennusta, asennuksen ohjausta tai työmaapäiväkirjaa. Julkinen lataus lisätään vasta, kun julkaisu on valmis.", "pSite is a viewing tool. It does not currently promise RTK surveying, as-built point capture, installation guidance or a site diary. A public download will be added when a release is ready.")
    caption = f"<figcaption>{media_caption}</figcaption>" if media_caption else ""
    return f"""
<section class="product-hero product-{slug}"><div class="shell product-hero-grid">
  <div class="product-hero-copy">{eyebrow(number + " / 03", category)}<h1>{headline}</h1><p class="hero-lede">{intro}</p><div class="action-row">{cta}<a class="button button-quiet" href="{href(lang, "contact")}">{t("Kysy tuotteesta", "Ask about the product")} →</a></div><p class="status-line"><span></span>{status}</p></div>
  <figure class="product-hero-media">{media}{caption}</figure>
</div></section>
<section class="section product-detail"><div class="shell"><div class="section-intro">{eyebrow("01 / 02", t("Mitä sillä tehdään", "What it does"))}<div class="section-head"><h2>{tx(lang, "Oikeat työvaiheet,<br>selkeästi esillä.", "Real work,<br>clearly shown.")}</h2><p>{t("Tärkeimmät nykyiset toiminnot ilman keksittyjä numeroita tai keskeneräisiä lupauksia.", "The key current capabilities, without invented figures or unfinished promises.")}</p></div></div><div class="feature-grid">{''.join(features)}</div><div class="gallery-grid">{gallery}</div></div></section>
<section class="section product-availability"><div class="shell availability-inner"><div>{eyebrow("02 / 02", t("Saatavuus", "Availability"))}<h2>{t("Tämänhetkinen tilanne.", "Where it stands today.")}</h2><p>{note}</p></div><a class="button button-primary" href="{href(lang, "beta")}">{t("Beta ja saatavuus", "Beta & availability")} ↗</a></div></section>
<section class="next-product"><div class="shell"><span>{t("Tutustu myös", "Also explore")}</span><div>{''.join(link(lang, p, p + ' ↗', 'next-link') for p in ('pquant','pfield','psite') if p != slug)}</div></div></section>"""


def beta_page(lang: str) -> str:
    t = lambda fi, en: tag(lang, fi, en)
    return f"""
<section class="page-intro"><div class="shell narrow">{eyebrow("PT / BETA", t("Nykyinen tilanne", "Current status"))}<h1>{t("Aloita siitä, mikä on", "Start with what is")} <em>{t("saatavilla.", "available.")}</em></h1><p class="hero-lede">{t("Jokaisella tuotteella on oma testivaiheensa. Alla näet alustat, kokeilutavan ja sen, milloin voit pyytää pääsyä.", "Each product has its own testing phase. See its platform, trial path and how to request access.")}</p></div></section>
<section class="section beta-section"><div class="shell"><div class="status-list">
  <article class="status-card product-pquant"><div><span class="status-index">01 / pQuant</span><h2>{t("Julkinen kokeilu", "Public trial")}</h2><p>{t("Windows x64. 30 päivää ensimmäisestä käynnistyksestä. Beta-avainta voi pyytää alla olevalla lomakkeella.", "Windows x64. 30 days from first launch. You can request a beta key using the form below.")}</p></div><a class="button button-outline" href="{DOWNLOAD}" data-download="pquant">{t("Lataa kokeilu", "Download trial")} ↗</a></article>
  <article class="status-card product-pfield"><div><span class="status-index">02 / pField</span><h2>{t("Rajattu beta", "Limited beta")}</h2><p>{t("Windows. Voit lähettää kiinnostuksesi alla. Ensimmäisen julkaisun GitHub-asentimen latauslinkki lisätään tälle sivulle, kun julkaisu on saatavilla. Beta jatkuu 90 päivää omistajan päättymisilmoituksen jälkeen.", "Windows. You can request access below. The GitHub installer link will be added here when the first release is available. Beta access continues 90 days after the owner's end notice.")}</p></div><a class="button button-outline" href="?product=pfield#request">{t("Hae pääsyä", "Request access")} ↓</a></article>
  <article class="status-card product-psite"><div><span class="status-index">03 / pSite</span><h2>{t("Kehitysvaihe", "In development")}</h2><p>{t("Android. Oikealla puhelimella on kokeiltu keskeisiä katselupolkuja, mutta julkista latausta ei ole vielä tarjolla. Voit jättää kiinnostusviestin.", "Android. Core viewing flows have been exercised on a real phone, but a public download is not yet available. You can send an interest message.")}</p></div><a class="button button-outline" href="?product=psite#request">{t("Jätä viesti", "Send interest")} ↓</a></article>
</div></div></section>
<section class="section form-section" id="request"><div class="shell form-layout"><div>{eyebrow("PT / ACCESS", t("Beta-pyyntö", "Beta request"))}<h2>{t("Haluatko mukaan testaamaan?", "Interested in testing?")}</h2><p>{t("Valitse tuote ja jätä sähköpostiosoitteesi. pQuantin beta-pyyntö käyttää nykyistä beta-rekisteriä. pFieldin ja pSiten kiinnostusviestit lähetetään nykyiseen palautekanavaan, joka ilmoittaa niistä kehittäjälle.", "Choose a product and leave your email. pQuant requests use the existing beta registry. pField and pSite interest messages use the current feedback channel, which notifies the developer.")}</p><p class="form-disclaimer">{t("Pyyntö ei vielä myönnä avainta tai takaa pääsyä. Vastaamme, kun tuotteen testausvaihe sallii sen.", "A request does not issue a key or guarantee access. We will reply when that product's testing phase allows it.")}</p></div>
<form id="beta-form" class="form-card" novalidate>
  <label for="beta-product">{t("Tuote", "Product")}</label><select id="beta-product" name="product" required><option value="pquant">pQuant — {t("beta-avain", "beta key")}</option><option value="pfield">pField — {t("beta-pääsy", "beta access")}</option><option value="psite">pSite — {t("kiinnostusviesti", "interest message")}</option></select>
  <label for="beta-email">{t("Sähköpostiosoite", "Email address")}</label><input id="beta-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@example.com" required>
  <div class="trap" aria-hidden="true"><label for="beta-company">Company</label><input id="beta-company" name="company" type="text" tabindex="-1" autocomplete="off"></div>
  <p class="form-privacy">{t("Käsittelemme osoitteen pyyntöä ja yhteydenottoa varten.", "We use your address to process the request and contact you.")} <a href="{'/tietosuoja.html' if lang == 'fi' else '/privacy.html'}">{t("Tietosuoja", "Privacy")}</a>.</p>
  <button class="button button-primary" type="submit">{t("Lähetä pyyntö", "Send request")} ↗</button><p id="beta-result" class="form-result" role="status" aria-live="polite"></p>
</form></div></section>"""


def contact_page(lang: str) -> str:
    t = lambda fi, en: tag(lang, fi, en)
    return f"""
<section class="page-intro"><div class="shell narrow">{eyebrow("PT / CONTACT", t("Palaute ja yhteys", "Feedback & contact"))}<h1>{t("Kerro, mikä toimii.", "Tell us what works.")}<br><em>{t("Ja mikä ei vielä.", "And what does not yet.")}</em></h1><p class="hero-lede">{t("Kysymys, virhe tai kehitysidea menee suoraan kehittäjälle. Virheraportin voi lähettää ilman yhteystietoa.", "Questions, bugs and ideas go directly to the developer. Bug reports can be sent without contact details.")}</p></div></section>
<section class="section form-section"><div class="shell form-layout"><div>{eyebrow("PT / MESSAGE", t("Suora viesti", "Direct message"))}<h2>{t("Otetaan asia käsittelyyn.", "Let's look into it.")}</h2><p>{t("Kerro mihin tuotteeseen viesti liittyy ja mitä tapahtui. Jos haluat vastauksen, lisää yhteystietosi. Kysymyksissä ja palautteessa yhteystieto on pakollinen.", "Tell us which product this concerns and what happened. Add your contact details if you want a reply. Contact details are required for questions and feedback.")}</p></div>
<form id="contact-form" class="form-card" novalidate>
  <label for="contact-product">{t("Tuote", "Product")}</label><select id="contact-product" name="product"><option value="general">pTakeoff / {t("yleinen", "general")}</option><option value="pquant">pQuant</option><option value="pfield">pField</option><option value="psite">pSite</option></select>
  <label for="contact-type">{t("Aihe", "Topic")}</label><select id="contact-type" name="type"><option value="bug">{t("Virheraportti", "Bug report")}</option><option value="question">{t("Kysymys", "Question")}</option><option value="feedback">{t("Palaute", "Feedback")}</option><option value="other">{t("Muu", "Other")}</option></select>
  <label for="contact-reply">{t("Yhteystieto", "Contact details")} <span id="reply-requirement">{t("(valinnainen virheraportissa)", "(optional for bug reports)")}</span></label><input id="contact-reply" name="replyTo" type="text" autocomplete="email" maxlength="200" placeholder="{t("Sähköposti, puhelin tai muu yhteystapa", "Email, phone or other contact method")}">
  <label for="contact-message">{t("Viesti", "Message")}</label><textarea id="contact-message" name="message" maxlength="3900" rows="7" placeholder="{t("Kerro lyhyesti, mitä tapahtui tai mitä haluaisit kysyä.", "Briefly tell us what happened or what you would like to ask.")}" required></textarea>
  <div class="trap" aria-hidden="true"><label for="contact-company">Company</label><input id="contact-company" name="company" type="text" tabindex="-1" autocomplete="off"></div>
  <p class="form-privacy">{t("Viesti tallennetaan ja siitä lähetetään ilmoitus kehittäjälle.", "Your message is stored and a notification is sent to the developer.")} <a href="{'/tietosuoja.html' if lang == 'fi' else '/privacy.html'}">{t("Tietosuoja", "Privacy")}</a>.</p>
  <button class="button button-primary" type="submit">{t("Lähetä viesti", "Send message")} ↗</button><p id="contact-result" class="form-result" role="status" aria-live="polite"></p>
</form></div></section>"""


PAGES = ("", "pquant", "pfield", "psite", "beta", "contact")


def build() -> None:
    for lang in ("fi", "en"):
        for page in PAGES:
            title = {
                "": tx(lang, "pTakeoff — suunnitelmasta työmaalle", "pTakeoff — from plans to site"),
                "pquant": tx(lang, "pQuant — PDF-määrälaskenta ja kustannusarviot", "pQuant — PDF takeoff and cost estimates"),
                "pfield": tx(lang, "pField — CAD ja infrasuunnittelu 3D:ssä", "pField — 3D infrastructure CAD"),
                "psite": tx(lang, "pSite — mallien katselu Androidilla", "pSite — Android field model viewer"),
                "beta": tx(lang, "Beta ja saatavuus — pTakeoff", "Beta & availability — pTakeoff"),
                "contact": tx(lang, "Palaute ja yhteys — pTakeoff", "Feedback & contact — pTakeoff"),
            }[page]
            description = {
                "": tx(lang, "pQuant, pField ja pSite: määrälaskenta, infrasuunnittelu ja mallien katselu työmaalla.", "pQuant, pField and pSite: takeoff, infrastructure design and field model viewing."),
                "pquant": tx(lang, "Mittaa PDF-suunnitelmista määrät, laske kustannusreseptit ja vie muokattavaan Exceliin.", "Measure PDF plans, estimate with cost recipes and export editable Excel."),
                "pfield": tx(lang, "CAD- ja infrasuunnittelu Windowsilla: pinnat, linjaukset ja putkiverkot 3D-mallissa.", "Windows infrastructure CAD for surfaces, alignments and pipe networks in 3D."),
                "psite": tx(lang, "Tarkastele paikallisia malleja, tasoja ja pistepilviä Android-laitteella työmaalla.", "View local models, layers and point clouds on an Android device in the field."),
                "beta": tx(lang, "Katso pQuantin, pFieldin ja pSiten kokeilu- ja beta-tilanne ja lähetä pyyntö.", "Check trial and beta availability for pQuant, pField and pSite and send a request."),
                "contact": tx(lang, "Lähetä kysymys, virheraportti tai palaute pTakeoff-tuotteista suoraan kehittäjälle.", "Send a question, bug report or feedback about pTakeoff products directly to the developer."),
            }[page]
            content = home(lang) if page == "" else (product_page(lang, page) if page in ("pquant", "pfield", "psite") else (beta_page(lang) if page == "beta" else contact_page(lang)))
            target = ROOT / ("en" if lang == "en" else "")
            target = target / page / "index.html" if page else target / "index.html"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(shell(lang, page, title, description, content), encoding="utf-8")
            print(target.relative_to(ROOT))
    sitemap_urls = [
        "https://ptakeoff.com" + href(lang, page)
        for lang in ("fi", "en")
        for page in PAGES
    ] + [
        "https://ptakeoff.com/" + name
        for name in ("ohjeet.html", "docs.html", "tietosuoja.html", "privacy.html", "ehdot.html", "terms.html", "evasteet.html", "cookies.html")
    ]
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += "".join(f"  <url><loc>{url}</loc></url>\n" for url in sitemap_urls)
    sitemap += "</urlset>\n"
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")


if __name__ == "__main__":
    build()
