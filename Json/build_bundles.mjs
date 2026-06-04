// build_bundles.mjs
// Generates the importable PQuant recipe bundles (RecipeBundle v1.0) from the
// raw legacy resource list plus the parametric recipe definitions below.
//
//   node build_bundles.mjs
//
// Outputs (same folder):
//   Infra2015_reseptikirjasto.json  — master bundle: resources + folders + recipes
//   Infra2015_reseptit.json         — recipes only (import after resources exist)
//   Infra2015_resurssit.json        — resources only
//   Infra2015_tarjousrivit.json      — 23 empty estimate rows for the recipes
// Also refreshes the built-in app assets under src/assets/calculation-templates.
//
// Every recipe component is either:
//   { code, q }  -> fixed_per_unit  (q = constant amount per base unit)
//   { code, f }  -> parameter_formula (f = per-base-unit formula over params)
// The formula grammar matches the app's evaluator EXACTLY: numbers, parameter
// identifiers and  + - * / ( )  only. No **, max(), ceil() or conditionals.
// Each formula must yield a quantity already expressed in the RESOURCE's own
// unit (e.g. tonnes for a tn-priced aggregate -> multiply the density param in).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_TEMPLATE_DIR = join(HERE, "..", "poitakeoff", "src", "assets", "calculation-templates");
const read = (name) => JSON.parse(readFileSync(join(HERE, name), "utf8"));

// ---------------------------------------------------------------------------
// Resources: map the raw legacy array to the bundle resource shape.
// ---------------------------------------------------------------------------
const rawResources = read("Resurssit_laajennettu_legacy.json");
const bundleResources = rawResources.map((r) => ({
  code: r.code,
  name: r.name,
  type: r.type,
  unit: r.unit,
  cost_price: r.costPrice,
  sell_price: r.sellPrice,
  category: r.category ?? undefined,
  supplier: r.supplier ?? undefined,
}));
const unitByCode = Object.fromEntries(rawResources.map((r) => [r.code, r.unit]));

// ---------------------------------------------------------------------------
// Parametric recipes. Each: { code, name, group, unit, input_type, tags,
//   description, params:[{key,label,unit,default,min,max}],
//   components:[{code, q|f, waste, note}] }
// ---------------------------------------------------------------------------
const P = (key, label, unit, def, min = 0, max = null) => ({ key, label, unit, default: def, min, max });

const recipes = [
  // === Maanleikkaus =========================================================
  {
    code: "1613",
    name: "Maaleikkaus ja läjitys / vastaanotto",
    group: "Maanleikkaus",
    unit: "m3_ktr",
    input_type: "manual",
    tags: ["1613", "leikkaus", "läjitys"],
    description:
      "Maan poisto, kuormaus, kuljetus ja vastaanotto/läjitys. Syötä leikkausmäärä (m³ ktr). Vastaanotto-osuutta säädetään parametrilla.",
    params: [
      P("excavator_productivity_m3_h", "Kaivun tuottavuus", "m3/h", 70, 1),
      P("truck_productivity_m3_h", "Kuljetuksen tuottavuus", "m3/h", 55, 1),
      P("survey_hours_per_1000m3", "Mittaus h / 1000 m³", "h", 2.0),
      P("disposal_share", "Vastaanottoon menevä osuus", "0-1", 1.0, 0, 1),
    ],
    components: [
      { code: "K02", f: "1 / excavator_productivity_m3_h", note: "Kaivu ja kuormaus" },
      { code: "K21", f: "1 / truck_productivity_m3_h", note: "Kuljetus" },
      { code: "T01", f: "0.35 / excavator_productivity_m3_h", note: "Perämies / avustava työ" },
      { code: "T03", f: "survey_hours_per_1000m3 / 1000", note: "Mittaus" },
      { code: "A08", f: "disposal_share", note: "Vastaanotto / läjitys (m³ per leikkaus-m³)" },
    ],
  },
  {
    code: "1612",
    name: "Maaleikkaus penkereeseen / täyttöön",
    group: "Maanleikkaus",
    unit: "m3_ktr",
    input_type: "manual",
    tags: ["1612", "1811", "leikkaus", "penger"],
    description:
      "Leikkaus ja käyttö suoraan penkereeseen. Syötä leikkausmäärä (m³ ktr). fill_ratio = täyttöön kelpaava osuus.",
    params: [
      P("excavator_productivity_m3_h", "Kaivun tuottavuus", "m3/h", 75, 1),
      P("transport_productivity_m3_h", "Kuljetuksen tuottavuus", "m3/h", 70, 1),
      P("spreading_productivity_m3_h", "Levityksen tuottavuus", "m3/h", 140, 1),
      P("compaction_productivity_m3_h", "Tiivistyksen tuottavuus", "m3/h", 180, 1),
      P("fill_ratio", "Penkereeseen kelpaava osuus", "0-1", 0.85, 0, 1),
    ],
    components: [
      { code: "K02", f: "1 / excavator_productivity_m3_h", note: "Kaivu ja kuormaus" },
      { code: "K21", f: "1 / transport_productivity_m3_h", note: "Kuljetus" },
      { code: "K09", f: "fill_ratio / spreading_productivity_m3_h", note: "Levitys penkereeseen" },
      { code: "K41", f: "fill_ratio / compaction_productivity_m3_h", note: "Tiivistys" },
      { code: "T01", f: "0.25 / excavator_productivity_m3_h + 0.15 * fill_ratio / spreading_productivity_m3_h", note: "Perämies / avustava työ" },
    ],
  },

  // === Putkikaivannot =======================================================
  {
    code: "1621",
    name: "Putki- ja johtokaivanto maassa",
    group: "Putkikaivannot",
    unit: "m",
    input_type: "line_length",
    tags: ["1621", "kaivanto", "putki"],
    description:
      "Trapetsikaivanto maahan. Poikkileikkaus lasketaan parametreista (syvyys, pohjaleveys, luiskat). Tuet pystysuoraksi: aseta luiskat 0.",
    params: [
      P("avg_depth_m", "Keskisyvyys", "m", 2.0, 0),
      P("bottom_width_m", "Pohjaleveys", "m", 1.2, 0),
      P("slope_left", "Vasen luiska (h/v)", "-", 0.5, 0),
      P("slope_right", "Oikea luiska (h/v)", "-", 0.5, 0),
      P("excavator_productivity_m3_h", "Kaivun tuottavuus", "m3/h", 35, 1),
    ],
    components: [
      { code: "K02", f: "(avg_depth_m * (bottom_width_m + bottom_width_m + avg_depth_m * (slope_left + slope_right)) / 2) / excavator_productivity_m3_h", note: "Kaivu kaivukoneella" },
      { code: "T01", f: "0.8 * (avg_depth_m * (bottom_width_m + bottom_width_m + avg_depth_m * (slope_left + slope_right)) / 2) / excavator_productivity_m3_h", note: "Perämies ja käsityö" },
      { code: "K62", q: 0.04, note: "Pumppausvaraus" },
      { code: "T03", q: 0.02, note: "Mittaus ja korkojen tarkistus" },
    ],
  },
  {
    code: "1831",
    name: "Putken asennusalusta",
    group: "Putkikaivannot",
    unit: "m",
    input_type: "line_length",
    tags: ["1831", "asennusalusta", "putki"],
    description: "Putken asennusalusta (hiekka/murske) annetulla leveydellä ja paksuudella.",
    params: [
      P("bedding_width_m", "Alustan leveys", "m", 1.0, 0),
      P("bedding_thickness_m", "Alustan paksuus", "m", 0.15, 0),
      P("density_tn_m3", "Materiaalin tiheys", "tn/m3", 1.8, 0.1),
      P("install_productivity_m3_h", "Levitystuottavuus", "m3/h", 18, 1),
    ],
    components: [
      { code: "M07", f: "bedding_width_m * bedding_thickness_m * density_tn_m3", waste: 5, note: "Asennushiekka (tn/m)" },
      { code: "K02", f: "bedding_width_m * bedding_thickness_m / install_productivity_m3_h", note: "Levitys kaivukoneella" },
      { code: "T02", f: "1.2 * bedding_width_m * bedding_thickness_m / install_productivity_m3_h", note: "Putkimies / tasaus" },
      { code: "K61", f: "bedding_width_m * bedding_thickness_m / install_productivity_m3_h", note: "Putkilaser" },
    ],
  },
  {
    code: "1837",
    name: "Johtokaivannon virtaussulku",
    group: "Putkikaivannot",
    unit: "kpl",
    input_type: "count",
    tags: ["1837", "virtaussulku"],
    description: "Virtaussulku kaivantoon. Määrä kappaleina; tilavuus lasketaan mitoista.",
    params: [
      P("dam_width_m", "Sulun leveys", "m", 1.2, 0),
      P("dam_height_m", "Sulun korkeus", "m", 1.5, 0),
      P("dam_thickness_m", "Sulun paksuus", "m", 0.5, 0),
      P("material_density_tn_m3", "Materiaalin tiheys", "tn/m3", 2.0, 0.1),
      P("install_hours_per_dam", "Asennustunnit / sulku", "h/kpl", 1.5, 0),
    ],
    components: [
      { code: "M03", f: "dam_width_m * dam_height_m * dam_thickness_m * material_density_tn_m3", note: "Sulkumateriaali (tn/kpl)" },
      { code: "K02", f: "install_hours_per_dam", note: "Asennus kaivukoneella" },
      { code: "T01", f: "install_hours_per_dam", note: "Käsityö ja muotoilu" },
    ],
  },

  // === Putkiasennus =========================================================
  {
    code: "3121",
    name: "Hulevesiviemäri muovia (asennus)",
    group: "Putkiasennus",
    unit: "m",
    input_type: "line_length",
    tags: ["3121", "hulevesi", "putki"],
    description: "Hulevesiviemäriputken (PE 315) asennus. Asennusalusta ja täyttö omina resepteinään.",
    params: [P("laying_productivity_m_h", "Asennustuottavuus", "m/h", 22, 1)],
    components: [
      { code: "M24", q: 1.02, note: "Hulevesiputki (sis. hukka 2 %)" },
      { code: "T02", f: "1 / laying_productivity_m_h", note: "Putkimies" },
      { code: "T01", f: "1 / laying_productivity_m_h", note: "Perämies / avustaja" },
      { code: "K02", f: "1 / laying_productivity_m_h", note: "Kaivukone nostoihin" },
      { code: "K61", f: "1 / laying_productivity_m_h", note: "Putkilaser" },
    ],
  },
  {
    code: "3111",
    name: "Jätevesiviemäri muovia (asennus)",
    group: "Putkiasennus",
    unit: "m",
    input_type: "line_length",
    tags: ["3111", "jätevesi", "viemäri", "putki"],
    description: "Jätevesiviemäriputken (PVC 160) asennus, sis. tarkemittaus ja TV-kuvausvaraus.",
    params: [
      P("laying_productivity_m_h", "Asennustuottavuus", "m/h", 18, 1),
      P("survey_hours_per_100m", "Mittaus h / 100 m", "h", 2.0),
    ],
    components: [
      { code: "M32", q: 1.02, note: "Jätevesiputki (sis. hukka 2 %)" },
      { code: "T02", f: "1 / laying_productivity_m_h", note: "Putkimies" },
      { code: "T01", f: "1 / laying_productivity_m_h", note: "Perämies / avustaja" },
      { code: "K02", f: "1 / laying_productivity_m_h", note: "Kaivukone nostoihin" },
      { code: "T03", f: "survey_hours_per_100m / 100", note: "Tarkemittaus" },
      { code: "A06", q: 1.0, note: "TV-kuvaus (m)" },
    ],
  },
  {
    code: "3131",
    name: "Vesijohto PE (asennus ja koestus)",
    group: "Putkiasennus",
    unit: "m",
    input_type: "line_length",
    tags: ["3131", "vesijohto", "PE", "painekoe"],
    description: "PE-vesijohdon (110 PN16) asennus, puskuhitsaus ja koeponnistusvaraus.",
    params: [
      P("install_productivity_m_h", "Asennustuottavuus", "m/h", 20, 1),
      P("welding_interval_m", "Hitsausväli (putkikangin pituus)", "m", 12, 0.1),
      P("tests_per_100m", "Painekokeita / 100 m", "kpl", 1, 0),
    ],
    components: [
      { code: "M27", q: 1.02, note: "PE-vesijohto (sis. hukka 2 %)" },
      { code: "T12", f: "0.5 / install_productivity_m_h + 0.35 / welding_interval_m", note: "PE-putkihitsaaja" },
      { code: "T02", f: "1 / install_productivity_m_h", note: "Putkimies" },
      { code: "K67", f: "0.35 / welding_interval_m", note: "PE-hitsauskalusto" },
      { code: "A20", f: "tests_per_100m / 100", note: "Koeponnistus / tiiveyskoe" },
    ],
  },
  {
    code: "1832",
    name: "Putkikaivannon alku- ja lopputäyttö",
    group: "Täytöt",
    unit: "m",
    input_type: "line_length",
    tags: ["1832", "1833", "täyttö", "tiivistys"],
    description:
      "Alku- ja lopputäyttö. Alkutäytöstä vähennetään putken syrjäyttämä ala. Alkutäyttömateriaali ostetaan; lopputäyttö oletuksena kaivumaista.",
    params: [
      P("bottom_width_m", "Kaivannon pohjaleveys", "m", 1.2, 0),
      P("pipe_diameter_m", "Putken ulkohalkaisija", "m", 0.315, 0),
      P("initial_fill_height_above_pipe_m", "Alkutäyttö putken päältä", "m", 0.3, 0),
      P("final_fill_height_m", "Lopputäytön korkeus", "m", 1.2, 0),
      P("initial_density_tn_m3", "Alkutäytön tiheys", "tn/m3", 1.85, 0.1),
      P("compaction_productivity_m3_h", "Tiivistyksen tuottavuus", "m3/h", 20, 1),
    ],
    components: [
      { code: "M07", f: "(bottom_width_m * (pipe_diameter_m + initial_fill_height_above_pipe_m) - 3.14159 * (pipe_diameter_m / 2) * (pipe_diameter_m / 2)) * initial_density_tn_m3", waste: 5, note: "Alkutäyttömateriaali (tn/m)" },
      { code: "K02", f: "0.8 * (bottom_width_m * (pipe_diameter_m + initial_fill_height_above_pipe_m) - 3.14159 * (pipe_diameter_m / 2) * (pipe_diameter_m / 2) + bottom_width_m * final_fill_height_m) / compaction_productivity_m3_h", note: "Täyttö kaivukoneella" },
      { code: "K42", f: "(bottom_width_m * (pipe_diameter_m + initial_fill_height_above_pipe_m) - 3.14159 * (pipe_diameter_m / 2) * (pipe_diameter_m / 2) + bottom_width_m * final_fill_height_m) / compaction_productivity_m3_h", note: "Tiivistys tärylevyllä" },
      { code: "T01", f: "(bottom_width_m * (pipe_diameter_m + initial_fill_height_above_pipe_m) - 3.14159 * (pipe_diameter_m / 2) * (pipe_diameter_m / 2) + bottom_width_m * final_fill_height_m) / compaction_productivity_m3_h", note: "Käsityö ja tiivistyksen apu" },
    ],
  },

  // === Kaivot ===============================================================
  {
    code: "3122",
    name: "Hulevesi- tai tarkastuskaivon asennus",
    group: "Kaivot",
    unit: "kpl",
    input_type: "count",
    tags: ["3122", "kaivo", "hulevesi"],
    description: "Kaivon (SVK 400) toimitus ja asennus alustoineen. Vaihda kaivon resurssi tarvittaessa.",
    params: [
      P("install_hours_per_manhole", "Asennustunnit / kaivo", "h/kpl", 3.5, 0),
      P("bedding_m3_per_manhole", "Alustamateriaali / kaivo", "m3/kpl", 0.8, 0),
      P("density_tn_m3", "Alustan tiheys", "tn/m3", 1.85, 0.1),
    ],
    components: [
      { code: "M51", q: 1.0, note: "Kaivo" },
      { code: "M07", f: "bedding_m3_per_manhole * density_tn_m3", note: "Alustamateriaali (tn/kpl)" },
      { code: "K02", f: "install_hours_per_manhole", note: "Kaivukone nostoihin" },
      { code: "T02", f: "0.9 * install_hours_per_manhole", note: "Putkimies / liitokset" },
      { code: "T01", f: "0.7 * install_hours_per_manhole", note: "Avustava työ" },
    ],
  },

  // === Rakennekerrokset =====================================================
  {
    code: "2111",
    name: "Suodatinkangas ja suodatinkerros",
    group: "Rakennekerrokset",
    unit: "m2",
    input_type: "area",
    tags: ["2111", "2112", "suodatinkerros", "kangas"],
    description: "Suodatinkangas (limityksineen) ja suodatinkerros annetulla paksuudella.",
    params: [
      P("layer_thickness_m", "Kerroksen paksuus", "m", 0.3, 0),
      P("material_density_tn_m3", "Materiaalin tiheys", "tn/m3", 1.95, 0.1),
      P("overlap_percent", "Kankaan limitys", "%", 10, 0),
      P("spreading_productivity_m3_h", "Levitystuottavuus", "m3/h", 80, 1),
    ],
    components: [
      { code: "M72", f: "1 + overlap_percent / 100", note: "Suodatinkangas (m²/m²)" },
      { code: "M03", f: "layer_thickness_m * material_density_tn_m3", waste: 5, note: "Suodatinkerros (tn/m²)" },
      { code: "K02", f: "layer_thickness_m / spreading_productivity_m3_h", note: "Levitys" },
      { code: "K41", f: "0.8 * layer_thickness_m / spreading_productivity_m3_h", note: "Tiivistys" },
      { code: "T01", q: 0.004, note: "Kankaan levitys ja avustava työ" },
    ],
  },
  {
    code: "2121",
    name: "Jakava kerros murskeesta",
    group: "Rakennekerrokset",
    unit: "m2",
    input_type: "area",
    tags: ["2121", "jakava", "murske"],
    description: "Jakava kerros (murske 0-63). Vaihda murskelaji suunnitelman mukaan.",
    params: [
      P("layer_thickness_m", "Kerrosvahvuus", "m", 0.4, 0),
      P("density_tn_m3", "Tiheys rakenteessa", "tn/m3", 2.0, 0.1),
      P("spreading_productivity_m3_h", "Levitystuottavuus", "m3/h", 100, 1),
    ],
    components: [
      { code: "M03", f: "layer_thickness_m * density_tn_m3", waste: 3, note: "Jakavan kerroksen murske (tn/m²)" },
      { code: "K08", f: "layer_thickness_m / spreading_productivity_m3_h", note: "Levitys pyöräkuormaajalla" },
      { code: "K41", f: "0.8 * layer_thickness_m / spreading_productivity_m3_h", note: "Tiivistys" },
      { code: "T03", q: 0.00067, note: "Mittaus ja tarkistus" },
    ],
  },
  {
    code: "2131",
    name: "Sitomaton kantava kerros",
    group: "Rakennekerrokset",
    unit: "m2",
    input_type: "area",
    tags: ["2131", "kantava", "murske", "laatu"],
    description: "Sitomaton kantava kerros (murske 0-32), sis. muotoilun, tiivistyksen ja laadunvarmistusvarauksen.",
    params: [
      P("layer_thickness_m", "Kerrosvahvuus", "m", 0.2, 0),
      P("density_tn_m3", "Tiheys rakenteessa", "tn/m3", 2.0, 0.1),
      P("grading_productivity_m2_h", "Muotoilun tuottavuus", "m2/h", 900, 1),
      P("qa_tests_per_m2", "Laadunvarmistuskokeita / m²", "kpl", 0.00033, 0),
    ],
    components: [
      { code: "M02", f: "layer_thickness_m * density_tn_m3", waste: 3, note: "Kantavan kerroksen murske (tn/m²)" },
      { code: "K10", f: "1 / grading_productivity_m2_h", note: "Muotoilu tiehöylällä" },
      { code: "K41", f: "0.7 / grading_productivity_m2_h", note: "Tiivistys valssijyrällä" },
      { code: "T03", q: 0.00083, note: "Mittaus / korkomalli" },
      { code: "A17", f: "qa_tests_per_m2", note: "Laadunvarmistuskoe" },
    ],
  },

  // === Päällysteet ==========================================================
  {
    code: "2141",
    name: "Asfalttipäällyste AB / ABK",
    group: "Päällysteet",
    unit: "m2",
    input_type: "area",
    tags: ["2141", "asfaltti", "päällyste"],
    description: "Asfalttipäällyste neliöinä; tonnivaraus mukana massatarkistusta varten.",
    params: [
      P("thickness_m", "Paksuus", "m", 0.05, 0),
      P("asphalt_density_tn_m3", "Asfaltin tiheys", "tn/m3", 2.5, 0.1),
    ],
    components: [
      { code: "A01", q: 1.0, note: "Asfaltointi (m²)" },
      { code: "A24", f: "thickness_m * asphalt_density_tn_m3", waste: 2, note: "Massan kuljetus/levitys (tn/m²)" },
    ],
  },

  // === Täytöt ===============================================================
  {
    code: "1811",
    name: "Louhepenger / louhetäyttö",
    group: "Täytöt",
    unit: "m3_rtr",
    input_type: "manual",
    tags: ["1811", "louhe", "penger"],
    description: "Louhetäyttö valmiina rakenteena (m³ rtr). Syötä rakennetilavuus.",
    params: [
      P("spreading_productivity_m3_h", "Levitystuottavuus", "m3/h", 120, 1),
      P("compaction_productivity_m3_h", "Tiivistystuottavuus", "m3/h", 180, 1),
    ],
    components: [
      { code: "M13", q: 1.0, note: "Louhe 0-300 (m³ rtr)" },
      { code: "K07", f: "1 / spreading_productivity_m3_h", note: "Louheen käsittely" },
      { code: "K09", f: "0.8 / spreading_productivity_m3_h", note: "Puskutraktori levitykseen" },
      { code: "K41", f: "1 / compaction_productivity_m3_h", note: "Tiivistys / yliajot" },
      { code: "T03", q: 0.002, note: "Pinnan ja kerrosten mittaus" },
    ],
  },

  // === Massanvaihto =========================================================
  {
    code: "1625",
    name: "Massanvaihto: kaivanto ja täyttö",
    group: "Massanvaihto",
    unit: "m3_rtr",
    input_type: "manual",
    tags: ["1625", "1836", "massanvaihto"],
    description: "Heikon maan poisto ja korvaava täyttö. Syötä vaihdettava tilavuus (m³ rtr).",
    params: [
      P("excavation_productivity_m3_h", "Kaivun tuottavuus", "m3/h", 55, 1),
      P("fill_productivity_m3_h", "Täytön tuottavuus", "m3/h", 90, 1),
      P("density_tn_m3", "Täyttömateriaalin tiheys", "tn/m3", 2.0, 0.1),
    ],
    components: [
      { code: "K03", f: "1 / excavation_productivity_m3_h", note: "Poistettavan maan kaivu" },
      { code: "K21", f: "1.2 / excavation_productivity_m3_h", note: "Poiskuljetus" },
      { code: "M03", f: "density_tn_m3", note: "Korvaava materiaali (tn/m³)" },
      { code: "K08", f: "1 / fill_productivity_m3_h", note: "Levitys" },
      { code: "K41", f: "0.8 / fill_productivity_m3_h", note: "Tiivistys" },
    ],
  },

  // === Louhinta =============================================================
  {
    code: "1711",
    name: "Kallioavoleikkaus / louhinta",
    group: "Louhinta",
    unit: "m3_ktr",
    input_type: "manual",
    tags: ["1711", "1712", "louhinta", "kallio"],
    description: "Kallion avolouhinta teoreettisena tilavuutena (m³ ktr). Louhinta alihankintana.",
    params: [
      P("drilling_productivity_m3_h", "Porauksen tuottavuus", "m3/h", 45, 1),
      P("loading_productivity_m3_h", "Louheen kuormaus", "m3/h", 80, 1),
      P("survey_hours_per_1000m3", "Mittaus h / 1000 m³", "h", 3.0),
      P("vibration_per_1000m3", "Tärinämittauksia / 1000 m³", "kpl", 1, 0),
    ],
    components: [
      { code: "A03", q: 1.0, note: "Kallion avolouhinta (alihankinta)" },
      { code: "K07", f: "1 / loading_productivity_m3_h", note: "Louheen käsittely / kuormaus" },
      { code: "T05", f: "0.35 / drilling_productivity_m3_h", note: "Panostaja / räjäyttäjä" },
      { code: "T03", f: "survey_hours_per_1000m3 / 1000", note: "Louhintamittaus" },
      { code: "A10", f: "vibration_per_1000m3 / 1000", note: "Tärinämittaus ja katselmukset" },
    ],
  },
  {
    code: "1721",
    name: "Kalliokanaali putkelle/johdolle",
    group: "Louhinta",
    unit: "m",
    input_type: "line_length",
    tags: ["1721", "kalliokanaali", "louhinta"],
    description: "Kapean kalliokanaalin louhinta. Tilavuus leveydestä ja syvyydestä.",
    params: [
      P("channel_width_m", "Kanaalin leveys", "m", 1.2, 0),
      P("channel_depth_m", "Louhintasyvyys", "m", 0.8, 0),
      P("rock_productivity_m3_h", "Kanaalilouhinnan tuottavuus", "m3/h", 18, 1),
    ],
    components: [
      { code: "A04", f: "channel_width_m * channel_depth_m", note: "Kanaali-/ojalouhinta (m³ rtr/m)" },
      { code: "K03", f: "channel_width_m * channel_depth_m / rock_productivity_m3_h", note: "Louheen poisto kanaalista" },
      { code: "K64", f: "0.3 * channel_width_m * channel_depth_m / rock_productivity_m3_h", note: "Kompressori / paineilma" },
      { code: "T05", f: "0.25 * channel_width_m * channel_depth_m / rock_productivity_m3_h", note: "Panostaja / räjäyttäjä" },
    ],
  },

  // === Kuivatusrakenteet ====================================================
  {
    code: "1431",
    name: "Salaojaputki ja salaojasepeli",
    group: "Kuivatusrakenteet",
    unit: "m",
    input_type: "line_length",
    tags: ["1431", "salaoja", "kuivatus"],
    description: "Salaojaputki, ympärystäytön sepeli ja suodatinkangas annetuilla mitoilla.",
    params: [
      P("gravel_width_m", "Sepelikaistan leveys", "m", 0.5, 0),
      P("gravel_height_m", "Sepelikaistan korkeus", "m", 0.5, 0),
      P("gravel_density_tn_m3", "Sepelin tiheys", "tn/m3", 1.55, 0.1),
      P("geotextile_m2_per_m", "Kangasta / metri", "m2/m", 1.5, 0),
    ],
    components: [
      { code: "M25", q: 1.02, note: "Salaojaputki (sis. hukka 2 %)" },
      { code: "M06", f: "gravel_width_m * gravel_height_m * gravel_density_tn_m3", note: "Salaojasepeli (tn/m)" },
      { code: "M72", f: "geotextile_m2_per_m", note: "Suodatinkangas (m²/m)" },
      { code: "K05", q: 0.05, note: "Pieni kaivukone / asennus" },
      { code: "T02", q: 0.056, note: "Asennustyö" },
    ],
  },
  {
    code: "1435",
    name: "Rumpuputki ja rumpukaivanto",
    group: "Kuivatusrakenteet",
    unit: "m",
    input_type: "line_length",
    tags: ["1435", "rumpu", "kuivatus"],
    description: "Muoviputkirumpu (500 mm) alustoineen. Lisää päätyrakenteet (M85) erikseen kappaleina.",
    params: [
      P("trench_width_m", "Rumpukaivannon leveys", "m", 1.5, 0),
      P("bedding_thickness_m", "Asennusalustan paksuus", "m", 0.2, 0),
      P("density_tn_m3", "Alustamateriaalin tiheys", "tn/m3", 1.85, 0.1),
    ],
    components: [
      { code: "M82", q: 1.02, note: "Rumpuputki (sis. hukka 2 %)" },
      { code: "M07", f: "trench_width_m * bedding_thickness_m * density_tn_m3", note: "Asennusalusta (tn/m)" },
      { code: "K02", q: 0.125, note: "Kaivu ja asennus" },
      { code: "T02", q: 0.1, note: "Asennustyö" },
    ],
  },

  // === Kaapelirakenteet =====================================================
  {
    code: "3321",
    name: "Kaapelisuojaputket kaivantoon",
    group: "Kaapelirakenteet",
    unit: "m",
    input_type: "line_length",
    tags: ["3321", "kaapeli", "suojaputki"],
    description: "Kaapelinsuojaputkien asennus. Materiaalipituus = linjapituus × putkien lukumäärä.",
    params: [
      P("duct_count", "Putkien lukumäärä", "kpl", 4, 1),
      P("install_productivity_m_h", "Asennustuottavuus", "m/h", 25, 1),
    ],
    components: [
      { code: "M31", f: "duct_count * 1.02", note: "Kaapelinsuojaputket (m/m, sis. hukka 2 %)" },
      { code: "M44", q: 1.0, note: "Varoitusnauha (m)" },
      { code: "T13", f: "1 / install_productivity_m_h", note: "Kaapeliasentaja / putkitus" },
      { code: "T01", f: "1 / install_productivity_m_h", note: "Avustava työ" },
      { code: "K02", f: "0.8 / install_productivity_m_h", note: "Kaivukone asennusapuna" },
    ],
  },

  // === Pintarakenteet =======================================================
  {
    code: "2112",
    name: "Suodatinkangas erillisenä työnä",
    group: "Rakennekerrokset",
    unit: "m2",
    input_type: "area",
    tags: ["2112", "suodatinkangas"],
    description: "Pelkkä suodatinkankaan asennus limityksineen.",
    params: [
      P("overlap_percent", "Limitys ja hukkavara", "%", 10, 0),
      P("installation_productivity_m2_h", "Asennustuottavuus", "m2/h", 250, 1),
    ],
    components: [
      { code: "M72", f: "1 + overlap_percent / 100", note: "Suodatinkangas (m²/m²)" },
      { code: "T01", f: "1 / installation_productivity_m2_h", note: "Kankaan levitys" },
      { code: "K05", f: "0.3 / installation_productivity_m2_h", note: "Pieni kone / avustus" },
    ],
  },
  {
    code: "2143",
    name: "Reunakiven asennus",
    group: "Pintarakenteet",
    unit: "m",
    input_type: "line_length",
    tags: ["2143", "reunakivi", "kiveys"],
    description: "Betonireunakiven asennus maakostealla betonilla.",
    params: [
      P("concrete_m3_per_m", "Asennusbetoni / metri", "m3/m", 0.035, 0),
      P("install_productivity_m_h", "Asennustuottavuus", "m/h", 8, 1),
    ],
    components: [
      { code: "M101", q: 1.02, note: "Betonireunakivi (sis. hukka 2 %)" },
      { code: "M91", f: "concrete_m3_per_m", note: "Maakostea asennusbetoni (m³/m)" },
      { code: "T06", f: "1 / install_productivity_m_h", note: "Reunakiviasentaja" },
      { code: "K05", f: "0.6 / install_productivity_m_h", note: "Minikaivukone / nostoapu" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Minimal formula evaluator — MUST mirror src/core/recipes/formulaEvaluator.ts
// (numbers, identifiers, + - * / and parentheses only).
// ---------------------------------------------------------------------------
function evalFormula(expr, vars) {
  let i = 0;
  const peek = () => expr[i];
  const skip = () => { while (i < expr.length && /\s/.test(expr[i])) i++; };
  function parseExpr() {
    let v = parseTerm();
    for (;;) {
      skip();
      const c = peek();
      if (c === "+") { i++; v += parseTerm(); }
      else if (c === "-") { i++; v -= parseTerm(); }
      else return v;
    }
  }
  function parseTerm() {
    let v = parseFactor();
    for (;;) {
      skip();
      const c = peek();
      if (c === "*") { i++; v *= parseFactor(); }
      else if (c === "/") { i++; const d = parseFactor(); if (d === 0) throw new Error("div by zero"); v /= d; }
      else return v;
    }
  }
  function parseFactor() {
    skip();
    const c = peek();
    if (c === "-") { i++; return -parseFactor(); }
    if (c === "+") { i++; return parseFactor(); }
    if (c === "(") { i++; const v = parseExpr(); skip(); if (peek() !== ")") throw new Error("unclosed paren"); i++; return v; }
    if (/[0-9.]/.test(c)) {
      const s = i; while (i < expr.length && /[0-9.]/.test(expr[i])) i++;
      return Number(expr.slice(s, i));
    }
    if (/[A-Za-z_]/.test(c)) {
      const s = i; while (i < expr.length && /[A-Za-z0-9_]/.test(expr[i])) i++;
      const id = expr.slice(s, i);
      if (!(id in vars)) throw new Error(`unknown variable ${id}`);
      return vars[id];
    }
    throw new Error(`unexpected token "${c}"`);
  }
  const result = parseExpr();
  skip();
  if (i !== expr.length) throw new Error("trailing tokens");
  return result;
}

// ---------------------------------------------------------------------------
// Build + validate assemblies into bundle shape.
// ---------------------------------------------------------------------------
const errors = [];
const codesSeen = new Set();
const usedFolders = new Set();

const assemblies = recipes.map((r) => {
  if (codesSeen.has(r.code)) errors.push(`Duplicate assembly code ${r.code}`);
  codesSeen.add(r.code);
  const folderPath = `INFRA 2015 / ${r.group}`;
  usedFolders.add(folderPath);

  const paramKeys = new Set((r.params ?? []).map((p) => p.key));
  const vars = Object.fromEntries((r.params ?? []).map((p) => [p.key, p.default]));

  const components = r.components.map((c, idx) => {
    const unit = unitByCode[c.code];
    if (!unit) errors.push(`${r.code}: unknown resource code ${c.code}`);
    const base = {
      resource_code: c.code,
      quantity_unit: unit ?? "kpl",
      output_unit: unit ?? "kpl",
      sort_order: idx,
    };
    if (c.waste != null) base.waste_percent = c.waste;
    if (c.note) base.note = c.note;

    if (c.f != null) {
      // formula-driven: every identifier must be a declared parameter
      const ids = c.f.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
      for (const id of ids) {
        if (!paramKeys.has(id)) errors.push(`${r.code}/${c.code}: formula references unknown parameter "${id}"`);
      }
      try {
        const val = evalFormula(c.f, vars);
        if (!Number.isFinite(val)) errors.push(`${r.code}/${c.code}: formula not finite`);
        if (val < 0) errors.push(`${r.code}/${c.code}: formula negative at defaults (${val})`);
      } catch (e) {
        errors.push(`${r.code}/${c.code}: formula error: ${e.message}`);
      }
      return { ...base, calculation_mode: "parameter_formula", formula_expression: c.f };
    }
    if (typeof c.q !== "number") errors.push(`${r.code}/${c.code}: missing q or f`);
    return { ...base, quantity: c.q };
  });

  return {
    code: r.code,
    name: r.name,
    unit: r.unit,
    input_type: r.input_type,
    description: r.description,
    folder_path: folderPath,
    tags: r.tags ?? [],
    parameters: (r.params ?? []).map((p) => ({
      key: p.key,
      label: p.label,
      unit: p.unit,
      default: p.default,
      min: p.min ?? undefined,
      max: p.max ?? undefined,
    })),
    components,
  };
});

if (errors.length) {
  console.error("VALIDATION FAILED:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

// Folder tree (parents first so ensureFolderPath builds cleanly).
const folders = [
  { path: "INFRA 2015" },
  ...[...usedFolders].sort().map((path) => ({ path })),
];

const meta = {
  version: "1.0",
  locale: "fi",
  infra_code_group: "1000-3999",
};

const master = {
  ...meta,
  name: "INFRA 2015 — Maanrakennuksen reseptikirjasto",
  description:
    "Panospohjainen resurssi- ja reseptikirjasto infra- ja maanrakennukseen. Parametriset reseptit (syvyys, leveys, tuottavuus). Viitehinnat 2025 — tarkista urakkakohtaisesti.",
  resources: bundleResources,
  folders,
  assemblies,
};

const recipesOnly = {
  ...meta,
  name: "INFRA 2015 — Reseptit (ilman resursseja)",
  description: "Pelkät reseptit. Tuo vasta kun resurssit (koodit T*/K*/M*/A*) ovat jo kirjastossa.",
  resources: [],
  folders,
  assemblies,
};

const resourcesOnly = {
  ...meta,
  name: "INFRA 2015 — Resurssikirjasto",
  description: "173 resurssia: työ, kalusto, materiaalit ja alihankinta. Viitehinnat 2025.",
  resources: bundleResources,
  folders: [],
  assemblies: [],
};

const litteraByRecipe = {
  "1612": "1610", "1613": "1610", "1621": "1620", "1625": "1620",
  "1711": "1700", "1721": "1700", "1811": "1810",
  "1831": "1830", "1832": "1830", "1837": "1830",
  "1431": "1400", "1435": "1400", "2111": "2110", "2112": "2110",
  "2121": "2120", "2131": "2130", "2141": "2140", "2143": "2140",
  "3111": "3110", "3121": "3120", "3122": "3120", "3131": "3130",
  "3321": "3300",
};

const estimateRowsOnly = {
  format: "pquant-calculation-template",
  version: "1.0",
  name: "INFRA 2015 — Perustarjousrivit",
  locale: "fi",
  description: "23 määrästä tyhjää tarjousriviä INFRA 2015 -reseptien pohjalta.",
  resource_folders: [],
  resources: [],
  assembly_folders: [],
  assemblies: [],
  littera_nodes: [],
  estimate_items: assemblies.map((assembly, index) => ({
    code: assembly.code,
    name: assembly.name,
    unit: assembly.unit,
    assembly_code: assembly.code,
    littera_code: litteraByRecipe[assembly.code],
    sort_order: index,
    group_label: assembly.folder_path.split("/").at(-1).trim(),
  })),
};

const write = (name, obj) => {
  writeFileSync(join(HERE, name), JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log(`  wrote ${name}`);
};

const writeAppAsset = (name, obj) => {
  mkdirSync(APP_TEMPLATE_DIR, { recursive: true });
  writeFileSync(join(APP_TEMPLATE_DIR, name), JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log(`  wrote app asset ${name}`);
};

console.log("OK — building bundles:");
write("Infra2015_reseptikirjasto.json", master);
write("Infra2015_reseptit.json", recipesOnly);
write("Infra2015_resurssit.json", resourcesOnly);
write("Infra2015_tarjousrivit.json", estimateRowsOnly);
writeAppAsset("infra2015_library.json", master);
writeAppAsset("infra2015_estimate_items.json", estimateRowsOnly);
console.log(
  `Done. ${bundleResources.length} resources, ${assemblies.length} recipes, ${folders.length} folders.`,
);
