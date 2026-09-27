# pTakeoff.com — tuoteperheen verkkosivuston suunnitelma

**26.9.2026 · Suunnitelma, ei julkaistu sivusto.** Tämä jalostaa [alustavaa suunnitelmaa](ptakeoff_website_plan.md). pTakeoff.com on pQuantin, pFieldin ja pSiten yhteinen koti. Nykyinen julkaistu etusivu kertoo käytännössä vain Takeoffista.

## 1. Päätös ja viestihierarkia

Rakennetaan nopeasti latautuva **monisivuinen sivusto**. Etusivu kertoo tuoteperheen idean ja ohjaa oikeaan tuotteeseen; kullakin tuotteella on oma löydettävä sivu, nykyinen saatavuus, alusta, oikeat kuvat ja yksi ensisijainen toiminto. Yhteinen brändi ei itsessään tarkoita yhteistä lisenssiä, pilvisynkronointia tai automaattista tiedonsiirtoa.

1. Brändilause ja H1: **Takeoffista lopulliseen asentamiseen.**
2. Välitön konkretia: **pQuant mittaa ja laskee PDF-suunnitelmista. pField suunnittelee infraa 3D:ssä. pSite auttaa tarkastelemaan malleja työmaalla.**
3. Lähellä ensimmäistä CTA:ta: tuotteet ovat aktiivisessa kehityksessä; jokaisen saatavuus kerrotaan erikseen.

Lause kuvaa tavoiteltua työn kokonaisuutta. pSiteä ei esitetä asennuksen mittaus- tai toteumahyväksyntätyökaluna. Tuotteiden väliset tiedostopolut esitellään vasta, kun juuri kyseinen polku on kokeiltu oikealla aineistolla.

## 2. Tuoteväitteiden hyväksyntä

| Tuote | Turvallinen pääviesti | Kuvaan sopiva oikea toiminto | Vältettävä ennen erillistä todentamista |
| --- | --- | --- | --- |
| **pQuant** | Windowsin PDF-määrälaskenta: mittaus, kustannusreseptit ja muokattava Excel-vienti. | PDF:stä mitattu määrä → resepti → Excel. | Yleinen 3D-määrälaskenta, täydellinen pilvitiimityö, automaattinen AI-suoritus tai vahvistamaton hinta. |
| **pField** | Windowsin CAD- ja infratyökalu: linjaukset, pinnat/corridorit, putkiverkot ja rakenteiden mallinnus. LandXML/Inframodel-vientiä on toteutettu rajatuin hyväksyntäporttein. | Saman esimerkin tasokuva, 3D-pinta ja putkiverkko. | RTK FIX -tarkkuus, yleinen GNSS/takymetri-yhteensopivuus, kenttäkelpoinen tabletti, kaikkien formaattien täydellinen tuki, koneohjauskelpoisuus. |
| **pSite** | Android-kenttäkatselin: paikalliset aineistot, 3D-näkymä, tasot, putkikohteiden tarkastelu ja pistepilven esikatselu. | Oikean puhelimen projekti-, 3D- ja Tutki-näkymät. | Työmaaraportointi yleisessä merkityksessä, RTK-mittaus, asennukseen ohjaus, AR tai automaattinen pilvisynkronointi. Aineistoraportti ei ole työmaapäiväkirja. |

**Lisenssit:** pQuantin 30 päivän kokeilun kello alkaa ensimmäisestä käynnistyksestä. pFieldin vahvistettu periaate on offline-ensikäynnistyksestä 30 päivää, beta omistajan päättymisilmoitukseen ja sen jälkeen **täsmälleen 90 päivää**, sekä ostetun lisenssin pysyvä oikeus rajattuun versiolinjaan. pFieldin asennus- ja julkaisuportit ovat silti auki. Nykyinen pTakeoff-sivu sanoo betan jatkoajaksi **2 kuukautta**; tämä ristiriita korjataan ennen uuden kokonaisuuden julkaisua. Tuotekohtaiset hinta, alennus ja jälleenmyyntiehdot vahvistetaan erikseen.

## 3. Sivukartta ja käyttäjäpolut

| Sivu | Tehtävä | Ensisijainen toiminto |
| --- | --- | --- |
| `/` | Tuoteperhe ja valinta kolmesta työkalusta. | Tutustu tuotteisiin. |
| `/pquant/` | PDF-mittaus → reseptit → Excel, alusta ja kokeilu. | Lataa nykyinen kokeilu. |
| `/pfield/` | Infrasuunnittelun työnkulku, todellinen projekti, formaattirajat. | Katso beta-saatavuus tai hae pääsyä todellisen jakelutavan mukaan. |
| `/psite/` | Kenttäkatselu, tuetut aineistot, Android-tilanne. | Katso testivaiheen tila; lataus vain oikealle julkaistulle paketille. |
| `/beta/` | Tuotekohtainen status, versio, alusta, kokeilutapa, lisenssit ja tunnetut rajat. | Siirry juuri kyseisen tuotteen toimivaan polkuun. |
| `/ohjeet/` sekä laki-/yhteyssivut | Käytön ohjeet ja luottamus. | Avaa ohje tai lähetä palaute. |

Määrälaskija tulee etusivulta pQuantiin ja kokeilun lataukseen. Infrasuunnittelija näkee pFieldissä yhden oikean projektin ja saatavuuden. Työmaakäyttäjä näkee pSiten aidon puhelinnäkymän ja sen rajat. Jokaiselta tuotesivulta pääsee muihin tuotteisiin sekä ohjeisiin.

## 4. Etusivun käsikirjoitus

```text
┌ pTakeoff ─ Tuotteet ─ Työnkulku ─ Beta ─ Ohjeet ─ FI/EN ┐
│ TAKEOFFISTA LOPULLISEEN ASENTAMISEEN.                  │
│ Mittaa ja laske. Suunnittele. Tarkastele työmaalla.    │
│ [Tutustu tuotteisiin] [Katso beta ja saatavuus]         │
│             [oikeista tuotekuvista tehty pääkompositio] │
├ Kolme valintaa: pQuant → pField → pSite ────────────────┤
│ rooli · alusta · tila · oikea kuva · oma tuotelinkki     │
├ Yksi esimerkkihanke: PDF | inframalli | kenttäkatselu ─┤
├ Tuotekohtaiset syväosiot, kuva + kolme olennaista hyötyä ┤
├ Beta ja saatavuus, tuotekohtaisesti ja päivättynä ─────┤
├ FAQ: alustat, aineistot, lisenssit ─────────────────────┤
└ Yhteys, ohjeet, lakisivut, versiot ──────────────────────┘
```

**Hero-teksti:** yläteksti `pTakeoff / rakentamisen ja infran työkalut`; H1 yllä; ingressi `pQuant auttaa laskemaan suunnitelmista määrät ja kustannukset. pFieldissä suunnittelet infraa 3D:ssä. pSitellä tarkastelet aineistoa työmaalla Android-laitteella.` Pää-CTA `Tutustu tuotteisiin`, toinen `Katso beta ja saatavuus`. Korttien nimet: `Suunnitelmasta määriksi`, `Suunnitelmasta malliksi`, `Malli mukana työmaalla`.

Hero pidetään lyhyenä. Päävisuaali näyttää ohjelmistot. Koordinaattiverkko ja ohut reittiviiva voivat sitoa näkymät yhteen, mutta käyttöliittymän sisällön pitää tulla oikeista sovelluksista. Kolmen vaiheen osio kuvaa työrooleja, ei lupaa automaattista integraatiota.

## 5. Visuaalinen järjestelmä

Suunta on **tarkka digitaalinen työpöytä + oikea infra-aineisto**: suunnitelmaviivat, pisteet, mittatiedot ja pinnan kerrokset. Ilme on tumma ja rauhallinen. Geneerinen neonputkivideo ei ole hero, koska se peittäisi tuotteen.

| Osa | Ohje |
| --- | --- |
| Pohja ja teksti | Sinimusta `#0B1018`, kohotettu pinta `#141D29`, rajaus `#29384A`; pääteksti `#F4F7FA`, sekundääri `#B6C3D1`. |
| Tuotevärit | pQuant oranssi `#F29A38`, pField sininen `#54A8FF`, pSite vihreä `#77C6A1`. Väri tunnistaa tuotteen, eikä täytä kokonaisia sivuja. |
| Typografia | Otsikoissa Manrope, tekstissä Inter, koordinaateissa IBM Plex Mono; itse hostatut WOFF2-tiedostot ja järjestelmävarat. |
| Sommittelu | Sisällön maksimi 1280 px; desktop 12, tablet 8, puhelin 4 palstaa. Hero noin 60/40 teksti/kuva, mobiilissa teksti ensin. Marginaalit 24–64 px. |
| Kuvat | Desktopin pääkuvat 16:10, puhelimen 9:19.5; 16 px kulmat, hieno rajaus ja hillitty varjo. UI luettavissa ilman koristeita. |
| Liike | Hover ja sisääntulo 120–240 ms. Ei jatkuvaa taustaliikettä; `prefers-reduced-motion` poistaa efektit. Lasiefekti vain pieniin päällekkeisiin. |

Mobiilissa otsikko aloitetaan noin 38–48 px, teksti 17–18 px ja painikkeet vähintään 44 px korkeina. Tuotteet ovat pystysuoria valintakortteja, eivät pakollinen vaakakaruselli. Desktopin H1 noin 64–76 px. Arvot tarkennetaan oikeassa selainrenderissä. Näppäimistöfokus, kontrasti, selkeät alt-tekstit, otsikkohierarkia ja tekstimuotoinen saatavuus kuuluvat peruslaatuun; tavoitteena WCAG 2.1 AA.

## 6. Kuvapankki ja tarkat mockup-paikat

| Sijainti | Jo löytynyt lähde | Kuvaustarve |
| --- | --- | --- |
| pQuant | `assets/hero_ui.png`, `assets/recipe_ui.png`, `assets/excel_ui.png` tässä repossa. | Ota nykybuildistä yhtenäinen PDF → resepti → Excel -sarja; varmista piirustuspohjan julkaisuoikeus. |
| pField | `C:/Github/3DPandaCad/docs/phases/phase59_shots/s4_iso.png` on oikea kapea 3D-mallinäkymä, ei täysi tuotekuva. | Ota nykybuildin kokonainen CAD-näkymä, jossa UI ja sama hanke näkyvät; lisäksi corridor/pinta ja putkiverkko. |
| pSite | `C:/Github/PSite/docs/evidence/2026-09-14-point-cloud/phone-overview.png` ja `phone-detail.png` ovat oikean Android-laitteen kehityskuvia. | Uusi terävä kuva projektista, 3D:stä ja Tutki-paneelista nykybuildillä. |

Jos uutta kuvaa ei saada, sivupohjaan jää nimetty, oikean kokoinen **kuvapaikka**:

```text
[HERO 1440×900: oikeat pQuant-, pField- ja pSite-kuvat kompositiossa]
[PQUANT 1600×1000: PDF + valittu määrä + mittauslista]
[PFIELD 1600×1000: sama projekti, corridor/pinta + putket]
[PSITE 1080×2340: oikea Android 3D + tasot/Tutki]
[BETA 1600×900: todellisen lisenssipolun kuva vasta kun polku on olemassa;
 siihen asti toimitusvaihekaavio, ei käyttöliittymäksi naamioitu portaali]
```

Säilytä alkuperäinen kuvakaappaus, poista henkilötiedot ja avaimet, kirjaa sovellusversio sekä kuvauspäivä, vie WebP/AVIF ja alt-teksti. Mallikehys saa lisätä laitteen reunat mutta ei keksiä painikkeita, RTK-tarkkuuksia tai muita ominaisuuksia.

## 7. Beta ja yhteydenotto

Beta-sivu näyttää tuotteittain **tilan, version, alustan, kokeilun sisällön, hankintatavan, päivämäärän ja tunnetut rajat**. pQuantin nykyinen CTA osoittaa GitHub-julkaisuun. pFieldin painike sidotaan vasta tarkistettuun asentimeen tai oikeaan hakulomakkeeseen. pSitelle ei tehdä latausnappia ilman oikeaa julkaisua.

Nykyinen sivu käyttää Vercelin `POST /api/request-beta` ja `POST /api/contact` -reittejä. Lomakkeet otetaan uuteen sivuun vasta tuotetunnisteella, tarkistetulla tietosuojatekstillä ja onnistuneella päästä päähän -kokeella. Lisenssiportaali on mahdollinen myöhempi ominaisuus. Vanha Stripe-simulaatio ja demoavain eivät kuulu julkaistavaan ostopolkuun.

## 8. Toteutustapa ja siirtymä

Nykyinen julkaisu on HTML/CSS/JS-repo, jonka `CNAME` osoittaa ptakeoff.comiin. **Suositus: Astro + tavallinen CSS, staattinen build nykyiseen julkaisuputkeen.** Se tuottaa valmiin HTML:n eri tuotesivuille, pitää sivun kevyenä ja tarvitsee JavaScriptiä vain valikkoon tai lomakkeisiin. Next.js:n palvelinmallia ei tarvita ennen oikeaa portaalia. Valinta varmistetaan etusivun ja pField-sivun prototyypillä sekä deployn tarkistuksella.

- Yksi tuotesisältömalli: nimi, kolme todistettua hyötyä, alusta, tila ja päivä, CTA, kuva/alt, väitteen evidenssi ja FI/EN-tekstit. Sama tila näkyy etusivulla ja beta-sivulla.
- FI/EN tehdään erillisillä löydettävillä osoitteilla ja `hreflang`-merkinnöillä. Jokaiselle sivulle oma title, description, canonical, Open Graph -kuva ja oikea schema; tuoteperheen etusivua ei merkitä yhdeksi Windows-sovellukseksi.
- Vanhojen `*.html`-osoitteiden ja ankkurien toimivuus säilytetään tai ohjataan. Lakisivut ja nykyiset ohjeet kartoitetaan siirtymässä.
- Kuville responsiiviset koot, WebP/AVIF, alempien kuvien lazy loading ja hero-kuvan priorisointi. Videolle vain oikea sovellusnauhoite, pysäytys ja staattinen varakuva.
- Lomakkeiden salaisuudet pysyvät palvelimella. Evästevalinnat, analytiikka ja tietosuojateksti tarkistetaan todellista toimintaa vasten.

## 9. Vaiheet ja hyväksyntäportit

| Vaihe | Tuotos | Hyväksyntä |
| --- | --- | --- |
| **S0 Väiterekisteri** | Tuotekohtaiset ominaisuudet, alustat, CTA:t, kaupalliset ehdot ja kuvien oikeudet. | Omistaja vahvistaa ehdot; 2 kk / 90 pv -ristiriita ratkaistu; mitään kenttätarkkuutta ei arvata. |
| **S1 Sisältö ja kuvat** | FI/EN-tekstit, kuvakäsikirjoitus, raakakuvat tai mitoitetut paikat. | Jokainen kuvateksti vastaa oikeaa versiota; julkiseen sivuun ei feikki-UI:ta. |
| **S2 Visuaalinen prototyyppi** | Etusivu ja pField-sivu desktopissa sekä mobiilissa. | 1440, 1024, 390 ja 360 px katselmointi; rooli, tuote ja saatavuus ymmärretään nopeasti. |
| **S3 Sivusto** | Kaikki tuotesivut, beta, ohjeet, yhteys, FI/EN ja metadata. | Navigaatio, vanhat URL:t, lataukset ja lomakepolut toimivat. |
| **S4 Julkaisukoe** | Staging, oikeat lataus- ja lomakekokeet, mobiili- ja saavutettavuuskatselmus. | Näppäimistö, ruudunlukijan peruspolku, kontrasti, lomakevirheet, selaimet ja mitattu suorituskyky hyväksytty. |
| **S5 Julkaisu** | Hallittu julkaisu, sisällön päivitysohje ja palautuspolku. | Oikean ympäristön lataus- ja yhteydenottopolku havaittu; statuspäivityksille omistaja. |

Seurataan siirtymistä etusivulta oikealle tuotesivulle, toimivia kokeilu-/beta-toimintoja, lomakkeiden onnistumisia ja mobiilinopeutta. Pelkkä kävijämäärä ei kerro, löysikö käyttäjä oikean tuotteen.

## 10. Ensimmäinen toteutuserä

1. Lukitaan S0:n väitteet ja kuvien käyttö. Vanhan `mockups/pfield.html`-luonnoksen RTK FIX-, tarkkuus-, tabletti- ja yleisiä GNSS-lupauksia ei siirretä.
2. Tehdään etusivusta ja pField-sivusta staattinen prototyyppi näillä teksteillä, aidolla kuvasuunnalla ja valmiiksi mitoitetuilla kuvapaikoilla.
3. Katselmoidaan ne oikeilla ruutukoilla. Sen jälkeen toteutetaan pQuant, pSite, beta ja nykyisen sivun siirtymä.

Tämä suunnitelma korvaa aiemman pelkän “tumma premium-SPA” -promptin toteutuksen ohjeena.

## 11. Toteutuksen tila 26.9.2026

Sivuston ensimmäinen toimiva versio on toteutettu nykyiseen staattiseen julkaisurepoon ilman uutta frameworkia. `scripts/build_site.py` luo kuusi suomenkielistä ja kuusi englanninkielistä sivua. `site.css` ja `site.js` pitävät ulkoasun ja lomakkeet yhteisinä. Ratkaisu säilyttää nykyisen jakelupolun ja vähentää riippuvuuksia; Astro on edelleen mahdollinen myöhempi sisältötyökalun valinta, jos ylläpito sitä tarvitsee.

Etusivu ja pQuant-sivu näyttävät pQuantin nykyiset ohjelmistokuvat. pFieldin ja pSiten kuvat ovat käyttäjän päätöksen mukaisesti tummia, nimettyjä kuvapaikkoja, kunnes otamme omat kuvakaappaukset julkaisuversioista. Beta-sivu ohjaa pQuantin nykyiseen beta-rekisteriin ja pFieldin/pSiten kiinnostuspyynnöt nykyiseen palauterajapintaan. Palaute käyttää samaa nykyistä rajapintaa. Tuotantorajapinnan ilmoitussähköpostin asetukset ovat olemassa; rajapinnan hyväksyntä ei kuitenkaan todista viestin saapumista omistajan postilaatikkoon.

Paikalliset FI/EN-linkit ja lomakesopimukset on tarkistettu automaattisesti, ja sivuja on katsottu työpöytä- ja puhelinleveyksillä. pFieldin Windows-asentimen latauslinkki lisätään vasta, kun ensimmäinen GitHub-julkaisu on oikeasti olemassa ja URL on tarkistettu. Julkaisua ennen ovat vielä avoinna omat lopulliset tuotekuvat, omistajan vahvistama ilmoituksen perillemeno, vanhojen FI/EN-tietosuoja- ja evästetekstien tarkistus sekä pQuantin vanhojen lisenssiehtojen hinta-/Stripe-väitteet. Näistä nykyinen repo ei anna riittävää näyttöä julkaistavaksi vahvistettuina kaupallisina tai juridisina tietoina.
