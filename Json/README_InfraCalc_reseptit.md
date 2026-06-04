# INFRA 2015 -reseptikirjasto PQuant-ohjelmaan

Tämä kansio sisältää PQuant 2026 -ohjelmaan **suoraan tuotavat** resurssi- ja
reseptikirjastot. Tiedostot ovat ohjelman oikeassa `RecipeBundle v1.0`
-muodossa (sama muoto kuin `poitakeoff/src/assets/recipe-bundles/`).

## Tuotavat tiedostot

| Tiedosto | Sisältö | Käyttö |
|----------|---------|--------|
| **`Infra2015_reseptikirjasto.json`** | **Master**: 173 resurssia + 23 reseptiä + kansiot | **Suositeltu** – tuo tämä, niin saat kaiken kerralla |
| `Infra2015_resurssit.json` | Vain 173 resurssia | Jos haluat pelkän resurssikirjaston |
| `Infra2015_reseptit.json` | Vain 23 reseptiä (ei resursseja) | Tuo vasta kun resurssit ovat jo kirjastossa |
| `Infra2015_tarjousrivit.json` | 23 tyhjää tarjousriviä resepti- ja litteraviittauksineen | Tuo Laskentapohjat-dialogista reseptikirjaston jälkeen |

### Tuonti ohjelmassa

`Reseptit` (Assemblies) → **Tuo reseptejä** → välilehti **Tuo tiedostosta** →
raahaa tai valitse `Infra2015_reseptikirjasto.json`. Tuonti on idempotentti:
resurssit ja reseptit tunnistetaan `code`-kentästä, joten saman tiedoston voi
tuoda uudelleen päivittääkseen kirjaston.

## Lähde- ja apuvtiedostot (ei tuotavia)

| Tiedosto | Mitä on |
|----------|---------|
| `Resurssit_laajennettu_legacy.json` | Raaka resurssilista (generaattorin syöte) |
| `build_bundles.mjs` | Generaattori, joka tuottaa yllä olevat tiedostot ja sovelluksen sisäiset INFRA-assetit |
| `resepti_laskuri_esimerkki.py` | Vanha Python-prototyypin laskuriesimerkki |

Tiedostojen uudelleenrakennus (esim. hintojen tai reseptien muokkauksen jälkeen):

```bash
node build_bundles.mjs
```

Generaattori validoi automaattisesti, että jokainen resurssikoodi löytyy ja
jokainen kaava viittaa vain määriteltyihin parametreihin ja antaa järkevän
(äärellisen, ei-negatiivisen) arvon oletusarvoilla. Sama validointi ajetaan
ohjelman testeissä (`src/core/recipes/bundleData.test.ts`).

---

## Reseptien toimintamalli (tärkeä)

PQuantin laskenta on **panospohjainen ja parametrinen**. Resepti ei ole yksi
kiinteä €/yksikkö, vaan rakenne:

```text
mittaus (m / m² / kpl / m³) = perusmäärä
  → reseptin parametrit (syvyys, leveys, luiska, tuottavuus, tiheys…)
  → komponenttirivit (työ, kalusto, materiaali, alihankinta)
  → kustannus + myynti + kate
```

Jokainen komponenttirivi laskee **määrän yhtä perusmittausyksikköä kohti**.
Lopullinen määrä = `perusmäärä × rivin per-yksikkömäärä`.

### Kaksi laskentatapaa per komponentti

1. **`fixed_per_unit`** – kiinteä vakiomäärä per yksikkö
   (esim. putki 1,02 m / linjametri, sis. 2 % hukka).
2. **`parameter_formula`** – kaava reseptin parametreista. Kaava palauttaa
   **per-yksikkömäärän** ja saa käyttää vain `+ - * / ( )` ja parametrien nimiä.
   Mittauksen perusmäärää (pituus/ala/kpl) **ei** kirjoiteta kaavaan – ohjelma
   kertoo sillä automaattisesti.

> Kaavakielessä **ei ole** `**`-potenssia, `max`/`min`/`ceil`-funktioita eikä
> ehtolauseita. Esim. ympyrän ala kirjoitetaan `3.14159 * (d/2) * (d/2)`.

### Esimerkki – putkikaivanto (`1621`, yksikkö m)

Parametrit: syvyys, pohjaleveys, vasen/oikea luiska, kaivun tuottavuus.
Kaivukoneen tunnit / metri:

```text
(avg_depth_m * (bottom_width_m + bottom_width_m
   + avg_depth_m * (slope_left + slope_right)) / 2) / excavator_productivity_m3_h
```

Tämä on trapetsin poikkileikkausala (m²/m = m³/m) jaettuna tuottavuudella.
Käyttäjä säätää syvyyttä, leveyttä ja luiskia projektikohtaisesti; tunnit ja
materiaalit päivittyvät automaattisesti.

## Reseptien pääryhmät (kansiot)

`INFRA 2015 / …`: Maanleikkaus, Putkikaivannot, Putkiasennus, Täytöt,
Rakennekerrokset, Päällysteet, Louhinta, Kuivatusrakenteet, Kaapelirakenteet,
Massanvaihto, Kaivot, Pintarakenteet. (23 reseptiä yhteensä.)

## Yksiköt

`h`, `d`, `m`, `m2`, `m3`, `m3_ktr` (kiintoteoreettinen / leikkaus),
`m3_rtr` (rakenneteoreettinen / valmis rakenne), `tn`, `kpl`, `tnkm`.

## Muista

Oletushinnat (2025-taso), tuottavuudet, tiheydet ja kertoimet ovat
**muokattavia laskentapohjia**. Ne eivät korvaa urakka-asiakirjoja, Infra 2015
-määrämittausohjetta, InfraRYL-vaatimuksia tai materiaalitoimittajan tietoja.
Säädä projektikohtaisesti vähintään: kaivannon mitat ja luiskat,
kerrospaksuudet, materiaalit ja tiheydet, työsaavutukset, kuljetusmatkat ja
laadunvarmistusmäärät.
```
