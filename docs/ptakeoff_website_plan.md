# pTakeoff.com - Verkkosivuston Suunnitelma ja Prompti

Tämä dokumentti sisältää kattavan suunnitelman ja tekoälylle/kehittäjälle suunnatun promptin **pTakeoff.com** -pääsivuston luomiseksi. Sivuston tarkoituksena on toimia näyttävänä, myyvänä ja modernina hubina kolmelle ohjelmistolle: **pQuant**, **pField** ja **pSite**.

---

## Osa 1: Verkkosivuston Konsepti ja Suunnitelma

### 1. Sivuston Tavoite

Sivuston tulee olla erittäin visuaalinen, premium-tason markkinointisivu, joka kiteyttää ohjelmistojen arvolupauksen: *"Takeoffista lopulliseen asentamiseen"*. Sivuston tulee välittömästi viestiä ammattimaisuutta, edelläkävijyyttä ja luotettavuutta.

### 2. Pääviestit ja Rakenne

Sivusto on yksisivuinen (Single Page Application -tyylinen) scrollattava kokonaisuus tai selkeillä alasivuilla varustettu sivusto, joka koostuu seuraavista osioista:

1. **Hero-osio (Etusivu):**

   - **Otsikko:** "Takeoffista lopulliseen asentamiseen."
   - **Alaotsikko:** Uuden sukupolven työkalut rakentamisen ja infran ammattilaisille.
   - **Call-to-Action (CTA):** "Kokeile Beta-versioita" / "Hae lisenssiä".
   - **Visuaalisuus:** Upea, tummanpuhuva 3D-taustavideo tai -animaatio, jossa risteilee putkiverkostoja ja mittatietoja.
2. **Ohjelmistojen Esittely (Tuoteperhe):**

   - **pQuant:**
     - *Teema:* Määrälaskennan ja kustannusarvioinnin tarkkuus.
     - *Sisältö:* Esitellään kuinka helposti 2D/3D-kuvista saadaan tarkat määrät.
   - **pField:**
     - *Teema:* Infran ja mallinnuksen monipuolisuus.
     - *Sisältö:* Korostetaan LandXML-corridoreja, putkiverkostojen suunnittelua, valaisinperustuksia ja valaisimien mallinnusta. Ohjelmiston monipuolisuus tuodaan selkeästi esiin.
   - **pSite:**
     - *Teema:* Työmaa taskussasi.
     - *Sisältö:* Mobiilisovelluksen kyvykkyys (raportointi, mallien katselu työmaalla).
3. **Beta-vaihe & Lisenssinhallinta:**

   - Selkeä osio, jossa kerrotaan kaikkien ohjelmistojen olevan tällä hetkellä Beta-vaiheessa.
   - Näyttävä mockup / käyttöliittymäkuva lisenssiportaalista, josta yritykset voivat hakea testilisenssejä.

### 3. Visuaalinen Ilme (UI/UX)

- **Värimaailma:** Tumma teema (Dark Mode), jossa on brändin värejä (esim. sähkönsininen, neonvihreä, oranssi korostusvärinä) tuomassa teknologista tuntumaa.
- **Efektit:** Glassmorphism (lasiefektit), pehmeät gradientit, leijuvat elementit.
- **Typografia:** Moderni ja selkeä, esim. *Inter*, *Outfit* tai *Roboto*.
- **Kuvitus:** Korkealaatuiset, myyvät screenshotit ja mockupit ohjelmistoista.

### 4. Tekniset Vaatimukset

- Kehys: Next.js, Vite + React tai Nuxt.js.
- Tyylitys: Tailwind CSS (tai moderni Vanilla CSS).
- Animaatiot: Framer Motion tai vastaava tuomaan mikroanimaatioita (esim. scroll-reveal).

---

## Osa 2: Kehittäjän / Tekoälyn Prompti (Kopioi tämä!)

Alla on valmis prompti, jonka voit syöttää tekoälylle (esim. minulle uuteen taskiin tai Cline/Cursor-työkaluun) aloittaaksesi sivuston koodaamisen.

```markdown
Olet kokenut Frontend-kehittäjä ja UI/UX-suunnittelija. Tehtävänäsi on luoda premium-tason markkinointisivusto osoitteeseen ptakeoff.com.

## Konteksti
pTakeoff on ohjelmistoperhe rakennus- ja infra-alalle. Perheeseen kuuluu kolme ohjelmistoa, jotka ovat kaikki Beta-vaiheessa:
1. **pQuant** - Määrälaskenta ja kustannusarviointi.
2. **pField** - Monipuolinen maasto- ja infrasuunnittelu (putkiverkostot, LandXML corridorit, valaisinperustukset jne.).
3. **pSite** - Mobiilisovellus työmaalle ja raportointiin.

## Pääviesti
Sivuston kantava teema ja pääotsikko on: "Takeoffista lopulliseen asentamiseen."

## Suunnitteluvaatimukset (CRITICAL)
- **Aesthetic First:** Sivuston TÄYTYY näyttää erittäin modernilta ja myyvältä. Älä tee perus "Bootstrap"-näköistä sivua.
- **Teema:** Dark mode (tumma teema). Käytä tyylikkäitä gradientteja, glassmorphism-efektejä (sumennetut lasitaustat korteissa) ja hienovaraisia mikroanimaatioita (esim. hover-efektit, scrollatessa sisään liukuvat elementit).
- **Rakenne:**
  1. Näyttävä Hero-osio (otsikko, lyhyt kuvaus, "Hae Beta-lisenssiä" -nappi).
  2. Tuote-esittelyosiot (jokaiselle ohjelmalle oma osio, jossa teksti toisella puolella ja näyttävä kuvapaikka toisella puolella). 
  3. pFieldin osiossa korosta monipuolisuutta (LandXML, putket, mallinnetut valaisimet).
  4. Lisenssinhallinta-osio: Kerro Beta-vaiheesta ja näytä "mockup"-tyylinen UI siitä, miten lisenssi haetaan.
  5. Footer, jossa yhteystiedot ja linkit.

## Tekninen toteutus
- Käytä modernia frameworkia (esim. Next.js tai Vite + React) ja Tailwind CSS:ää.
- Tee koodista modulaarista: luo omat komponentit Hero-, Tuote- ja Beta/Lisenssi -osioille.
- Laita kuvien tilalle placeholderit, mutta tee kuvapaikoista valmiiksi oikean kokoisia ja muotoisia (esim. kevyesti pyöristetyt kulmat ja drop-shadow).

Aloita luomalla projektin perusrakenne ja toteuta ensin Hero-osio sekä pFieldin tuote-esittelyosio parhaalla mahdollisella visuaalisella ilmeellä.
```

---
