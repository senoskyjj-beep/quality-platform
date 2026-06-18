/**
 * SANS Standards Clauses Dictionary
 * Filtered by inspection type. Used by Finding & NCR forms.
 *
 * Only clause numbers + topic + brief description (NO copyrighted SANS text).
 * Joshua writes the actual non-conformance description in his own words.
 */

export const SANS_CLAUSES = [
  // ============ SANS 1200 A — General ============
  { ref: 'SANS 1200 A clause 3', topic: 'Scope & definitions', desc: 'General obligations of contractor, definitions applying to all SANS 1200 series', categories: ['general'] },
  { ref: 'SANS 1200 A clause 4', topic: 'Materials – General requirements', desc: 'Materials to be new, undamaged, as specified; storage and handling requirements', categories: ['general'] },
  { ref: 'SANS 1200 A clause 5', topic: 'Workmanship – General', desc: 'Execution in accordance with drawings and spec; qualified personnel and supervision', categories: ['general'] },
  { ref: 'SANS 1200 A clause 6', topic: 'Setting out', desc: 'Accuracy of setting out, use of surveying equipment, tolerance on position', categories: ['general'] },
  { ref: 'SANS 1200 A clause 7', topic: 'Inspections & records', desc: 'Hold points, witness points, notification periods for inspections, record keeping', categories: ['general'] },

  // ============ SANS 1200 C — Site Clearance ============
  { ref: 'SANS 1200 C clause 5.1', topic: 'Clearing & grubbing', desc: 'Removal of vegetation, stumps, roots; cleared area boundaries', categories: ['site-clearance'] },
  { ref: 'SANS 1200 C clause 5.2', topic: 'Demolition & strip-out', desc: 'Safe demolition sequence, shoring, dust and noise control', categories: ['site-clearance'] },
  { ref: 'SANS 1200 C clause 5.3', topic: 'Topsoil strip & storage', desc: 'Depth of topsoil strip, stockpile location, contamination prevention', categories: ['site-clearance', 'earthworks'] },
  { ref: 'SANS 1200 C clause 6.1', topic: 'Disposal of cleared material', desc: 'Approved disposal sites, burning restrictions, record of quantities removed', categories: ['site-clearance'] },

  // ============ SANS 1200 D — Earthworks ============
  { ref: 'SANS 1200 D clause 4.1', topic: 'Earthworks materials', desc: 'Classification of excavated material, imported fill specification', categories: ['earthworks'] },
  { ref: 'SANS 1200 D clause 5.1', topic: 'Excavation depth & alignment', desc: 'Tolerance on excavation, side slopes, dewatering', categories: ['earthworks', 'drainage'] },
  { ref: 'SANS 1200 D clause 5.2', topic: 'Formation levels', desc: 'Finished subgrade level tolerance, proof rolling before fill', categories: ['earthworks'] },
  { ref: 'SANS 1200 D clause 6.1', topic: 'Backfill & compaction', desc: 'Layer thickness (max 150 mm loose), compaction ≥93% Mod AASHTO, moisture content', categories: ['earthworks', 'drainage'] },
  { ref: 'SANS 1200 D clause 6.2', topic: 'Fill around structures', desc: 'Compaction adjacent to walls/columns, restriction on heavy plant near structures', categories: ['earthworks', 'concrete'] },
  { ref: 'SANS 1200 D clause 7.1', topic: 'Compaction testing', desc: 'Frequency of density tests, nuclear gauge or sand replacement method', categories: ['earthworks'] },

  // ============ SANS 1200 DB — Pipe Subsoil Drainage ============
  { ref: 'SANS 1200 DB clause 5.1', topic: 'Trench excavation', desc: 'Trench width, depth, side support requirements', categories: ['drainage', 'earthworks'] },
  { ref: 'SANS 1200 DB clause 5.2', topic: 'Subsoil drain pipes', desc: 'Perforated pipe type, joint gap, filter sock requirements', categories: ['drainage'] },
  { ref: 'SANS 1200 DB clause 6.1', topic: 'Pipe bedding & backfill', desc: 'Granular bedding material, compaction zones around pipe, geotextile wrapping', categories: ['drainage'] },
  { ref: 'SANS 1200 DB clause 6.2', topic: 'Inspection eyes & outlets', desc: 'Spacing of rodding eyes, outlet protection, fall on drain', categories: ['drainage'] },

  // ============ SANS 1200 LB / LE ============
  { ref: 'SANS 1200 LB clause 5.1', topic: 'Bedding classes', desc: 'Class A/B/C bedding for different pipe types', categories: ['drainage'] },
  { ref: 'SANS 1200 LE clause 5.1', topic: 'Stormwater pipe laying', desc: 'Pipe alignment, joints, fall and grading', categories: ['drainage'] },
  { ref: 'SANS 1200 LE clause 6.1', topic: 'Manholes & inlets', desc: 'Manhole construction, benching, step-irons, covers', categories: ['drainage'] },

  // ============ SANS 1200 F — Piling ============
  { ref: 'SANS 1200 F clause 4.1', topic: 'Piling materials', desc: 'Concrete class, reinforcement, casing or tube specifications for piles', categories: ['piling', 'concrete'] },
  { ref: 'SANS 1200 F clause 5.1', topic: 'Setting out – Pile position', desc: 'Tolerance on plan position (±75 mm), plumb tolerance, cut-off level', categories: ['piling'] },
  { ref: 'SANS 1200 F clause 5.2', topic: 'Boring & drilling', desc: 'Borehole diameter, depth, cleanliness of base before concreting', categories: ['piling'] },
  { ref: 'SANS 1200 F clause 5.3', topic: 'Pile reinforcement cage', desc: 'Cage length, cover, cage centralisation during concreting', categories: ['piling', 'rebar'] },
  { ref: 'SANS 1200 F clause 6.1', topic: 'Concreting piles', desc: 'Tremie concreting, workability, rise rate, top-up after settlement', categories: ['piling', 'concrete'] },
  { ref: 'SANS 1200 F clause 6.2', topic: 'Driven piles', desc: 'Hammer type, set, penetration rate, final set records', categories: ['piling'] },
  { ref: 'SANS 1200 F clause 7.1', topic: 'Pile head preparation', desc: 'Bush-hammering to sound concrete, exposing starter bars, pile cap construction joint', categories: ['piling', 'concrete'] },
  { ref: 'SANS 1200 F clause 8.1', topic: 'Pile load testing', desc: 'Static load test frequency, maintained load procedure, acceptance criteria', categories: ['piling'] },
  { ref: 'SANS 1200 F clause 8.2', topic: 'Integrity testing', desc: 'Sonic echo / PDA test requirements for driven and bored piles', categories: ['piling'] },

  // ============ SANS 1200 G — Concrete Structural ============
  { ref: 'SANS 1200 G clause 5.2', topic: 'Materials – Cement & aggregates', desc: 'Cement type, fine and coarse aggregate quality and grading requirements', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 5.3', topic: 'Concrete mix design', desc: 'Mix proportions, water/cement ratio, target strength and workability', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 5.4', topic: 'Cover to reinforcement', desc: 'Minimum concrete cover to rebar based on exposure class', categories: ['concrete', 'rebar'] },
  { ref: 'SANS 1200 G clause 5.5', topic: 'Reinforcement placement', desc: 'Bar spacing, laps, bends, tolerance on position and chairs', categories: ['concrete', 'rebar'] },
  { ref: 'SANS 1200 G clause 6.1', topic: 'Formwork & falsework', desc: 'Strength, alignment, surface finish requirements for formwork', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 6.2', topic: 'Formwork release & striking', desc: 'Minimum time and strength before stripping forms', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 7.1', topic: 'Concrete placement', desc: 'Methods of placing, drop heights, segregation control', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 7.2', topic: 'Compaction & defects', desc: 'Vibration requirements, honeycomb, voids, cold joints', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 7.3', topic: 'Finishing & curing', desc: 'Surface finish classes and curing methods', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 8.1', topic: 'Tolerances – Vertical & horizontal', desc: 'Permissible deviation on plumb, level, and dimension', categories: ['concrete'] },
  { ref: 'SANS 1200 G clause 9.1', topic: 'Testing – Cube tests', desc: 'Sampling frequency, test ages (7-day, 28-day), acceptance criteria', categories: ['concrete'] },
  // SANS 1200 GA
  { ref: 'SANS 1200 GA clause 5.1', topic: 'Batching plant requirements', desc: 'Accuracy of weigh-batching, calibration, mixer condition', categories: ['concrete'] },
  { ref: 'SANS 1200 GA clause 5.2', topic: 'Mixing time & uniformity', desc: 'Minimum mixing time, slump uniformity, temperature limits', categories: ['concrete'] },
  { ref: 'SANS 1200 GA clause 6.1', topic: 'Delivery & slump', desc: 'Time from batching to placing, slump on arrival, water addition', categories: ['concrete'] },
  // SANS 1200 GB
  { ref: 'SANS 1200 GB clause 5.1', topic: 'Surface finish classes', desc: 'Class F1/F2/F3 off-shutter requirements, smoothness and blemish limits', categories: ['concrete'] },
  { ref: 'SANS 1200 GB clause 5.2', topic: 'Scabbling & roughening', desc: 'Surface preparation between pours for bond, depth of scabble', categories: ['concrete'] },
  { ref: 'SANS 1200 GB clause 5.3', topic: 'Patching & repair', desc: 'Approved repair mortars, surface preparation, curing of repairs', categories: ['concrete'] },
  { ref: 'SANS 1200 GB clause 6.1', topic: 'Curing methods', desc: 'Wet curing, curing compound, plastic sheeting, minimum duration', categories: ['concrete'] },

  // ============ SANS 1200 L — Layerworks ============
  { ref: 'SANS 1200 L clause 4.1', topic: 'Layerworks materials', desc: 'G-material classification (G1–G7), grading, plasticity index limits', categories: ['roads'] },
  { ref: 'SANS 1200 L clause 5.1', topic: 'Subgrade preparation', desc: 'Proof rolling, soft spot treatment, in-situ reworking requirements', categories: ['roads', 'earthworks'] },
  { ref: 'SANS 1200 L clause 5.2', topic: 'Subbase layer construction', desc: 'Layer thickness, compaction (93–95% Mod AASHTO), moisture content', categories: ['roads'] },
  { ref: 'SANS 1200 L clause 5.3', topic: 'Base layer construction', desc: 'Crushed stone base, compaction ≥98% Mod AASHTO, level tolerance', categories: ['roads'] },
  { ref: 'SANS 1200 L clause 6.1', topic: 'Layerworks testing', desc: 'CBR, density, moisture, material compliance — frequency and sampling', categories: ['roads'] },

  // ============ SANS 1200 M — Roads (Surfacing) ============
  { ref: 'SANS 1200 M clause 4.1', topic: 'Bituminous surfacing materials', desc: 'Binder grade, aggregate quality, mix design requirements', categories: ['roads'] },
  { ref: 'SANS 1200 M clause 5.1', topic: 'Preparation of base', desc: 'Prime coat application, base cleanliness and compaction before surfacing', categories: ['roads'] },
  { ref: 'SANS 1200 M clause 5.2', topic: 'Surface dressing / seal', desc: 'Binder rate, aggregate size and spread rate, rolling', categories: ['roads'] },
  { ref: 'SANS 1200 M clause 5.3', topic: 'Asphalt surfacing', desc: 'Laying temperature, lift thickness, joint construction, compaction', categories: ['roads'] },
  { ref: 'SANS 1200 M clause 6.1', topic: 'Surfacing tolerances', desc: 'Ride quality (3 m straightedge ≤10 mm), crossfall, pavement level', categories: ['roads'] },

  // ============ SANS 2001-CC1 / CC2 ============
  { ref: 'SANS 2001-CC1 clause 4.2', topic: 'Concrete constituent materials', desc: 'Cement, aggregate, water, admixture quality', categories: ['concrete'] },
  { ref: 'SANS 2001-CC1 clause 4.4', topic: 'Concrete production & supply', desc: 'Ready-mix supply, transport, delivery time limits', categories: ['concrete'] },
  { ref: 'SANS 2001-CC1 clause 5.2', topic: 'Concrete placing & compaction', desc: 'Placement temperature, lift heights, vibrator type', categories: ['concrete'] },
  { ref: 'SANS 2001-CC1 clause 5.4', topic: 'Concrete curing', desc: 'Initial curing period, methods, temperature protection', categories: ['concrete'] },
  { ref: 'SANS 2001-CC1 clause 6.1', topic: 'Strength testing', desc: 'Cube sampling rate, testing, action on low results', categories: ['concrete'] },
  { ref: 'SANS 2001-CC2 clause 4.1', topic: 'Formwork materials & strength', desc: 'Form face material, falsework calculations', categories: ['concrete'] },
  { ref: 'SANS 2001-CC2 clause 4.3', topic: 'Formwork tolerances', desc: 'Alignment, plumb, surface dimension tolerances', categories: ['concrete'] },
  { ref: 'SANS 2001-CC2 clause 5.1', topic: 'Reinforcement cutting & bending', desc: 'Bending radii, cutting accuracy, scheduling', categories: ['rebar'] },
  { ref: 'SANS 2001-CC2 clause 5.3', topic: 'Reinforcement fixing & cover', desc: 'Tying, spacing chairs, cover blocks, tolerance', categories: ['rebar', 'concrete'] },

  // ============ SANS 2001-CM1 — Masonry ============
  { ref: 'SANS 2001-CM1 clause 4.1', topic: 'Masonry materials & mortar', desc: 'Brick/block type, mortar mix class, cement content', categories: ['brickwork'] },
  { ref: 'SANS 2001-CM1 clause 4.3', topic: 'Masonry bond patterns', desc: 'Stretcher/header bond, overlap requirements, perpends', categories: ['brickwork'] },
  { ref: 'SANS 2001-CM1 clause 5.1', topic: 'Masonry building practice', desc: 'Course levels, plumb, gauge, bed/perpend joint thickness', categories: ['brickwork'] },
  { ref: 'SANS 2001-CM1 clause 5.2', topic: 'Masonry movement joints', desc: 'Location and detailing of expansion/contraction joints', categories: ['brickwork'] },
  { ref: 'SANS 2001-CM1 clause 5.4', topic: 'Masonry damp-proofing', desc: 'DPC type, lap, position, protection', categories: ['brickwork'] },
  { ref: 'SANS 2001-CM1 clause 6.1', topic: 'Reinforced masonry walls', desc: 'Bed-joint reinforcement, ties, anchors, grouted cavities', categories: ['brickwork'] },
  { ref: 'SANS 2001-CM1 clause 7.1', topic: 'Masonry tolerances', desc: 'Plumb, level, alignment limits for finished walls', categories: ['brickwork'] },

  // ============ SANS 2001-CM2 / DP1 ============
  { ref: 'SANS 2001-CM2 clause 4.1', topic: 'Strip footings foundation prep', desc: 'Ground bearing, trench bottom, blinding', categories: ['concrete', 'earthworks'] },
  { ref: 'SANS 2001-CM2 clause 5.1', topic: 'Strip footings concrete placement', desc: 'Foundation concrete class, placement, finishing', categories: ['concrete'] },
  { ref: 'SANS 2001-DP1 clause 5.1', topic: 'Pipelines pipe laying', desc: 'Alignment, jointing, anchorage of pipes', categories: ['drainage', 'plumbing'] },
  { ref: 'SANS 2001-DP1 clause 6.1', topic: 'Pipelines testing', desc: 'Pressure and leak testing procedures', categories: ['drainage', 'plumbing'] },

  // ============ SANS 10400 — National Building Regulations ============
  { ref: 'SANS 10400-B clause 4', topic: 'Structural design – General', desc: 'Strength, stability and serviceability of structural elements', categories: ['concrete', 'brickwork'] },
  { ref: 'SANS 10400-K clause 4.1', topic: 'Walls construction', desc: 'Wall thickness, lateral support, openings', categories: ['brickwork'] },
  { ref: 'SANS 10400-K clause 5.1', topic: 'Walls lintels', desc: 'Lintel bearing length, load distribution', categories: ['brickwork'] },
  { ref: 'SANS 10400-K clause 6.1', topic: 'Walls movement joints', desc: 'Provisions for thermal and moisture movement', categories: ['brickwork'] },
  { ref: 'SANS 10400-L clause 4', topic: 'Roofs structural support', desc: 'Wall plate anchoring, truss support, bracing', categories: ['brickwork'] },
  { ref: 'SANS 10400-M clause 4.1', topic: 'Stairways geometry', desc: 'Tread, riser, going, handrail requirements', categories: ['concrete', 'brickwork'] },
  { ref: 'SANS 10400-P clause 4', topic: 'Drainage – sanitary fittings', desc: 'Trap requirements, minimum grades, vent pipe provisions', categories: ['plumbing'] },
  { ref: 'SANS 10400-P clause 5.1', topic: 'Drainage – pipe sizing', desc: 'Discharge units, pipe diameter selection, slope', categories: ['plumbing'] },
  { ref: 'SANS 10400-P clause 6.1', topic: 'Drainage – testing', desc: 'Water test and air test for drainage installations', categories: ['plumbing'] },
  { ref: 'SANS 10400-R clause 5', topic: 'Stormwater disposal', desc: 'Surface drainage, gully positions, discharge points', categories: ['drainage'] },
  { ref: 'SANS 10400-T clause 4.1', topic: 'Fire – compartmentation', desc: 'Fire compartment sizes, separation walls and floors, fire resistance ratings', categories: ['fire'] },
  { ref: 'SANS 10400-T clause 4.2', topic: 'Fire – escape routes', desc: 'Exit widths, travel distance, final exit requirements', categories: ['fire'] },
  { ref: 'SANS 10400-T clause 4.3', topic: 'Fire – structural elements', desc: 'Fire resistance periods for structural members, columns, beams, slabs', categories: ['fire', 'concrete'] },
  { ref: 'SANS 10400-T clause 4.4', topic: 'Fire – fire doors & dampers', desc: 'Fire door ratings, installation, self-closing devices, intumescent strips', categories: ['fire'] },
  { ref: 'SANS 10400-T clause 5.1', topic: 'Fire detection & suppression', desc: 'Smoke detectors, sprinkler system requirements, portable extinguishers', categories: ['fire'] },
  { ref: 'SANS 10400-W clause 4', topic: 'Wet areas – waterproofing', desc: 'Waterproofing of shower, bathroom, wet-area floors and walls', categories: ['plumbing', 'concrete'] },
  { ref: 'SANS 10400-X clause 4', topic: 'Glazing safety', desc: 'Safety glazing requirements in critical locations', categories: ['general'] },

  // ============ SANS 10252 — Plumbing / Water Installations ============
  { ref: 'SANS 10252-1 clause 4', topic: 'Water supply – pipe materials', desc: 'Approved pipe materials and fittings for potable water, pressure ratings', categories: ['plumbing'] },
  { ref: 'SANS 10252-1 clause 5.1', topic: 'Water supply – pipe laying', desc: 'Minimum cover, thrust blocks, pipe jointing and support', categories: ['plumbing'] },
  { ref: 'SANS 10252-1 clause 5.2', topic: 'Water supply – valves & fittings', desc: 'Isolating valves, non-return valves, pressure reducing valves', categories: ['plumbing'] },
  { ref: 'SANS 10252-1 clause 6.1', topic: 'Water supply – pressure testing', desc: 'Hydrostatic test pressure (1.5× working), test duration, acceptance', categories: ['plumbing'] },
  { ref: 'SANS 10252-2 clause 4', topic: 'Drainage – waste pipe materials', desc: 'uPVC, cast iron, HDPE drainage pipe standards, joint types', categories: ['plumbing'] },
  { ref: 'SANS 10252-2 clause 5.1', topic: 'Drainage – stack & branch sizing', desc: 'Discharge unit method, stack diameter, branch pipe fall', categories: ['plumbing'] },
  { ref: 'SANS 10252-2 clause 6.1', topic: 'Drainage – testing & commissioning', desc: 'Water test (50 mm head retained 15 min), odour test, smoke test', categories: ['plumbing'] },

  // ============ SANS 10142-1 — Electrical Wiring ============
  { ref: 'SANS 10142-1 clause 4.1', topic: 'Electrical – wiring materials', desc: 'Cable types approved for concealed and exposed wiring, voltage ratings', categories: ['electrical'] },
  { ref: 'SANS 10142-1 clause 4.2', topic: 'Electrical – conduit & trunking', desc: 'Conduit material, fixing centres, bending radius, fill ratio', categories: ['electrical'] },
  { ref: 'SANS 10142-1 clause 5.1', topic: 'Electrical – circuit protection', desc: 'MCB/MCCB ratings, earth fault protection, RCD requirements', categories: ['electrical'] },
  { ref: 'SANS 10142-1 clause 5.2', topic: 'Electrical – distribution boards', desc: 'DB construction, busbar sizing, labelling, IP rating', categories: ['electrical'] },
  { ref: 'SANS 10142-1 clause 5.3', topic: 'Electrical – earthing & bonding', desc: 'Earthing conductor sizing, earth electrode resistance, bonding of metalwork', categories: ['electrical'] },
  { ref: 'SANS 10142-1 clause 6.1', topic: 'Electrical – inspection & testing', desc: 'Pre-energisation inspection, insulation resistance, earth continuity, COC requirements', categories: ['electrical'] },
  { ref: 'SANS 10142-1 clause 6.2', topic: 'Electrical – Certificate of Compliance', desc: 'COC issuance requirements, registered installer, scope of work', categories: ['electrical'] },

  // ============ SANS 10173 / SANS 1238 — HVAC ============
  { ref: 'SANS 10173 clause 4.1', topic: 'HVAC – ductwork materials', desc: 'Sheet metal gauge, duct class (low/medium/high pressure), sealing requirements', categories: ['hvac'] },
  { ref: 'SANS 10173 clause 4.2', topic: 'HVAC – duct installation', desc: 'Support spacing, duct alignment, flexible connection requirements', categories: ['hvac'] },
  { ref: 'SANS 10173 clause 5.1', topic: 'HVAC – equipment installation', desc: 'AHU/FCU mounting, vibration isolation, clearances for maintenance access', categories: ['hvac'] },
  { ref: 'SANS 10173 clause 5.2', topic: 'HVAC – refrigerant pipework', desc: 'Copper pipe sizing, support, insulation thickness, brazing procedure', categories: ['hvac'] },
  { ref: 'SANS 10173 clause 6.1', topic: 'HVAC – testing & commissioning', desc: 'Duct leakage test, airflow balancing, temperature control verification', categories: ['hvac'] },
  { ref: 'SANS 10173 clause 6.2', topic: 'HVAC – fire dampers', desc: 'Fire damper installation at fire boundaries, access for resetting, test certification', categories: ['hvac', 'fire'] },
  { ref: 'SANS 1238 clause 4', topic: 'HVAC – ventilation rates', desc: 'Minimum outside air supply rates per occupancy type, CO₂ concentration limits', categories: ['hvac'] },

  // ============ SANS 10198 — ICT / CNI Cabling ============
  { ref: 'SANS 10198-4 clause 4', topic: 'ICT – cabling installation', desc: 'Structured cabling installation practices, bend radius, cable support, segregation from power', categories: ['ict'] },
  { ref: 'SANS 10198-4 clause 5.1', topic: 'ICT – containment & conduit', desc: 'Cable tray sizing, fill ratio, earthing of metallic containment', categories: ['ict'] },
  { ref: 'SANS 10198-4 clause 5.2', topic: 'ICT – fibre optic installation', desc: 'Fibre cable minimum bend radius, splice enclosure, OTDR test requirements', categories: ['ict'] },
  { ref: 'SANS 10198-4 clause 6.1', topic: 'ICT – testing & certification', desc: 'Channel/link testing per TIA-568, test report format, pass/fail criteria', categories: ['ict'] },
  { ref: 'SANS 10198-6 clause 4', topic: 'ICT – earthing of cabling', desc: 'Telecommunications earthing, bonding of racks and containment', categories: ['ict', 'electrical'] },

  // ============ SANRAL Drainage Manual (6th Edition) ============
  { ref: 'SANRAL Drainage Manual Ch.2', topic: 'Hydrology – runoff estimation', desc: 'Rational method, catchment area, runoff coefficient and rainfall intensity for drainage sizing', categories: ['drainage'] },
  { ref: 'SANRAL Drainage Manual Ch.3', topic: 'Hydraulics – pipe flow & channels', desc: 'Manning equation, pipe full-flow capacity, open channel freeboard requirements', categories: ['drainage'] },
  { ref: 'SANRAL Drainage Manual Ch.4 §4.2', topic: 'Culvert – type selection & sizing', desc: 'Culvert hydraulic design, headwater depth, outlet velocity, scour potential', categories: ['drainage', 'earthworks'] },
  { ref: 'SANRAL Drainage Manual Ch.4 §4.4', topic: 'Culvert – installation', desc: 'Bedding class, backfill compaction, pipe alignment, headwall construction', categories: ['drainage', 'earthworks'] },
  { ref: 'SANRAL Drainage Manual Ch.4 §4.5', topic: 'Culvert – inlet & outlet protection', desc: 'Apron slab, wingwalls, scour protection at inlet and outlet', categories: ['drainage', 'earthworks'] },
  { ref: 'SANRAL Drainage Manual Ch.7 §7.2', topic: 'Erosion protection – riprap', desc: 'Rock size, layer thickness, filter layer requirements for riprap protection', categories: ['drainage', 'earthworks'] },
  { ref: 'SANRAL Drainage Manual Ch.7 §7.3', topic: 'Erosion protection – gabions', desc: 'Wire basket type, rock fill grading, lacing and connection requirements', categories: ['drainage', 'earthworks'] },
  { ref: 'SANRAL Drainage Manual Ch.7 §7.4', topic: 'Erosion protection – concrete lining', desc: 'Lining thickness, reinforcement, expansion joints, surface finish for lined channels', categories: ['drainage', 'concrete'] },
  { ref: 'SANRAL Drainage Manual Ch.8 §8.2', topic: 'Stormwater – kerb inlets & gullies', desc: 'Inlet capacity, spacing, gully type selection, trap requirements', categories: ['drainage'] },
  { ref: 'SANRAL Drainage Manual Ch.8 §8.3', topic: 'Stormwater – retention & detention', desc: 'Retention pond design criteria, outlet control structure, safety requirements', categories: ['drainage'] },
  { ref: 'SANRAL Drainage Manual Ch.9 §9.2', topic: 'Side drains – construction', desc: 'Roadside drain dimensions, gradient, lining requirements, outfall spacing', categories: ['drainage', 'roads'] },
  { ref: 'SANRAL Drainage Manual Ch.9 §9.3', topic: 'Subsurface drainage – installation', desc: 'Subsoil drain depth, gradient, geotextile wrap, outlet to daylight requirements', categories: ['drainage', 'earthworks'] },

  // ============ NHBRC Home Building Manual ============
  { ref: 'NHBRC Part 2.1.1', topic: 'Site investigation & soil report', desc: 'Geotechnical report required before foundation design, soil classification, bearing capacity', categories: ['earthworks', 'concrete'] },
  { ref: 'NHBRC Part 2.1.2', topic: 'Foundation types – selection', desc: 'Strip, pad, raft and piled foundation selection based on soil conditions and loading', categories: ['concrete', 'piling'] },
  { ref: 'NHBRC Part 2.1.3', topic: 'Foundation dimensions & depths', desc: 'Minimum foundation depth, width requirements, founding on undisturbed soil', categories: ['concrete', 'earthworks'] },
  { ref: 'NHBRC Part 2.1.4', topic: 'Foundation concrete & reinforcement', desc: 'Minimum concrete class, reinforcement requirements for various foundation types', categories: ['concrete', 'rebar'] },
  { ref: 'NHBRC Part 2.2.1', topic: 'Ground floor slab – preparation', desc: 'Subbase compaction, DPM installation, ground preparation before slab pour', categories: ['concrete', 'earthworks'] },
  { ref: 'NHBRC Part 2.2.2', topic: 'Ground floor slab – construction', desc: 'Slab thickness (min 100 mm), reinforcement mesh, concrete class, curing requirements', categories: ['concrete'] },
  { ref: 'NHBRC Part 2.2.3', topic: 'Ground floor slab – tolerances', desc: 'Surface level tolerance ±6 mm under 3 m straight edge, crack control', categories: ['concrete'] },
  { ref: 'NHBRC Part 2.3.1', topic: 'Masonry – materials', desc: 'Approved brick/block types, minimum compressive strength, mortar class requirements', categories: ['brickwork'] },
  { ref: 'NHBRC Part 2.3.2', topic: 'Masonry – construction', desc: 'Wall thickness, lateral support spacing, lintel bearing, movement joint spacing', categories: ['brickwork'] },
  { ref: 'NHBRC Part 2.3.3', topic: 'Masonry – waterproofing', desc: 'DPC position, cavity trays, wall ties, external render requirements', categories: ['brickwork'] },
  { ref: 'NHBRC Part 2.4.1', topic: 'Roof structure – timber', desc: 'Timber quality, truss installation, bracing, connection to wall plates and ring beam', categories: ['brickwork'] },
  { ref: 'NHBRC Part 2.4.2', topic: 'Roof covering – installation', desc: 'Roof cladding fixing, lap requirements, ridge and valley detailing, waterproofing', categories: ['general'] },
  { ref: 'NHBRC Part 3.1.1', topic: 'Drainage – above ground', desc: 'PVC pipe grades, fixing and support, air admittance valves, access points', categories: ['plumbing', 'drainage'] },
  { ref: 'NHBRC Part 3.1.2', topic: 'Drainage – underground', desc: 'Minimum cover depths, bedding, pipe jointing, inspection eyes spacing', categories: ['plumbing', 'drainage'] },
  { ref: 'NHBRC Part 3.1.3', topic: 'Drainage – testing', desc: 'Water and air test requirements, test pressure, duration and acceptance criteria', categories: ['plumbing'] },
  { ref: 'NHBRC Part 3.2.1', topic: 'Water supply – pipe materials & joints', desc: 'CPVC, HDPE, copper pipe approvals, joint types, pressure class for cold/hot water', categories: ['plumbing'] },
  { ref: 'NHBRC Part 3.2.2', topic: 'Water supply – geysers & pressure', desc: 'Geyser installation height, pressure limiting valve, drip tray, discharge to outside', categories: ['plumbing'] },
  { ref: 'NHBRC Part 3.3.1', topic: 'Electrical – installation compliance', desc: 'All electrical work by registered person, COC required, SANS 10142-1 applies throughout', categories: ['electrical'] },
  { ref: 'NHBRC Part 3.3.2', topic: 'Electrical – DB & earthing', desc: 'DB location, main earth, bonding of water pipes, compliance with SANS 10142-1', categories: ['electrical'] },
  { ref: 'NHBRC Part 3.4.1', topic: 'Fire protection – residential', desc: 'Smoke detectors required in all sleeping areas, heat detector in kitchen, interconnection', categories: ['fire'] },
];

export const COMMON_DEFECTS = [
  // Concrete
  { name: 'Honeycombing', category: 'concrete', suggested_clause: 'SANS 1200 G clause 7.2', tip: 'Voids/exposed aggregate from poor compaction' },
  { name: 'Cold joint', category: 'concrete', suggested_clause: 'SANS 1200 G clause 7.1', tip: 'Discontinuity from delayed placement' },
  { name: 'Insufficient cover to rebar', category: 'concrete', suggested_clause: 'SANS 1200 G clause 5.4', tip: 'Cover less than spec at top/bottom/side face' },
  { name: 'Incorrect scabbling', category: 'concrete', suggested_clause: 'SANS 1200 GB clause 5.2', tip: 'Surface preparation between pours not adequate' },
  { name: 'Surface defect / Class F finish', category: 'concrete', suggested_clause: 'SANS 1200 GB clause 5.1', tip: 'Blemishes, fins, blowholes beyond tolerance' },
  { name: 'Curing not done', category: 'concrete', suggested_clause: 'SANS 1200 G clause 7.3', tip: 'Surface dried before adequate strength gain' },
  { name: 'Formwork misalignment', category: 'concrete', suggested_clause: 'SANS 1200 G clause 6.1', tip: 'Out of plumb, level or dimension' },
  { name: 'Early formwork stripping', category: 'concrete', suggested_clause: 'SANS 1200 G clause 6.2', tip: 'Forms removed before minimum strength' },
  { name: 'Rebar lap insufficient', category: 'rebar', suggested_clause: 'SANS 1200 G clause 5.5', tip: 'Lap length below specified bar diameter multiples' },
  { name: 'Low cube strength', category: 'concrete', suggested_clause: 'SANS 1200 G clause 9.1', tip: 'Cube test below 28-day target' },
  { name: 'Out of tolerance - dimension/position', category: 'concrete', suggested_clause: 'SANS 1200 G clause 8.1', tip: 'Element size or position outside permissible deviation' },
  { name: 'Out of plumb (verticality)', category: 'concrete', suggested_clause: 'SANS 1200 G clause 8.1', tip: 'Column/wall verticality exceeds tolerance' },
  { name: 'Out of square', category: 'concrete', suggested_clause: 'SANS 1200 G clause 8.1', tip: 'Corners / setting-out not at correct angle' },
  { name: 'Out of level (surface/slab)', category: 'concrete', suggested_clause: 'SANS 1200 G clause 8.1', tip: 'Slab or surface level outside permissible deviation' },
  // Brickwork
  { name: 'Bond failure / wrong pattern', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 4.3', tip: 'Stretcher/header bond not followed' },
  { name: 'Mortar joint too thick / thin', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 5.1', tip: 'Bed/perpend joint outside 10mm ±2mm' },
  { name: 'Wall out of plumb', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 7.1', tip: 'Wall verticality outside tolerance' },
  { name: 'Efflorescence', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 4.1', tip: 'Salt deposits indicating moisture / mortar issue' },
  { name: 'DPC missing or damaged', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 5.4', tip: 'Damp-proof course missing/torn/wrong position' },
  // Drainage
  { name: 'Pipe fall incorrect', category: 'drainage', suggested_clause: 'SANS 1200 LE clause 5.1', tip: 'Pipe gradient outside spec' },
  { name: 'Bedding inadequate', category: 'drainage', suggested_clause: 'SANS 1200 LB clause 5.1', tip: 'Wrong bedding class or insufficient compaction' },
  // Earthworks
  { name: 'Compaction failed', category: 'earthworks', suggested_clause: 'SANS 1200 D clause 6.1', tip: 'Density test result below required Mod AASHTO %' },
  { name: 'Layer thickness exceeded', category: 'earthworks', suggested_clause: 'SANS 1200 D clause 6.1', tip: 'Loose layer thicker than 150 mm maximum' },
  { name: 'Formation level out of tolerance', category: 'earthworks', suggested_clause: 'SANS 1200 D clause 5.2', tip: 'Subgrade level outside ±25 mm tolerance' },
  // Piling
  { name: 'Pile out of position', category: 'piling', suggested_clause: 'SANS 1200 F clause 5.1', tip: 'Pile centre deviates more than 75 mm from design position' },
  { name: 'Pile cut-off level incorrect', category: 'piling', suggested_clause: 'SANS 1200 F clause 5.1', tip: 'Pile cut-off not at specified level ±25 mm' },
  { name: 'Pile head not prepared', category: 'piling', suggested_clause: 'SANS 1200 F clause 7.1', tip: 'Laitance not removed, starter bars not exposed correctly' },
  { name: 'Insufficient pile length / set', category: 'piling', suggested_clause: 'SANS 1200 F clause 6.2', tip: 'Driven pile set or bored pile depth not reached' },
  // Roads
  { name: 'Base layer compaction failed', category: 'roads', suggested_clause: 'SANS 1200 L clause 5.3', tip: 'Density test below 98% Mod AASHTO for base course' },
  { name: 'Layer thickness out of tolerance', category: 'roads', suggested_clause: 'SANS 1200 L clause 5.2', tip: 'Layer thickness outside ±15 mm of design thickness' },
  { name: 'Asphalt laid at wrong temperature', category: 'roads', suggested_clause: 'SANS 1200 M clause 5.3', tip: 'Mat temperature below minimum at time of compaction' },
  { name: 'Surface level out of tolerance', category: 'roads', suggested_clause: 'SANS 1200 M clause 6.1', tip: '3 m straightedge gap exceeds 10 mm' },
  // Plumbing
  { name: 'Drainage fall incorrect', category: 'plumbing', suggested_clause: 'SANS 10400-P clause 5.1', tip: 'Pipe gradient outside minimum specified fall' },
  { name: 'Pressure test failed', category: 'plumbing', suggested_clause: 'SANS 10252-1 clause 6.1', tip: 'Pressure drop during hydrostatic test — leak present' },
  { name: 'Water test failed (drainage)', category: 'plumbing', suggested_clause: 'SANS 10252-2 clause 6.1', tip: '50 mm head not retained for 15 minutes' },
  { name: 'Trap missing or incorrectly installed', category: 'plumbing', suggested_clause: 'SANS 10400-P clause 4', tip: 'Trap absent, wrong type, or trap seal insufficient' },
  // Electrical
  { name: 'Insulation resistance failure', category: 'electrical', suggested_clause: 'SANS 10142-1 clause 6.1', tip: 'IR test below 1 MΩ — cable damaged or wrongly terminated' },
  { name: 'Earth continuity failure', category: 'electrical', suggested_clause: 'SANS 10142-1 clause 5.3', tip: 'Earth continuity resistance exceeds limits' },
  { name: 'Conduit overfilled', category: 'electrical', suggested_clause: 'SANS 10142-1 clause 4.2', tip: 'Cable fill ratio exceeds 40% of conduit CSA' },
  { name: 'RCD / ELCB missing', category: 'electrical', suggested_clause: 'SANS 10142-1 clause 5.1', tip: 'Earth fault protection not installed as required' },
  // Fire
  { name: 'Fire door not self-closing', category: 'fire', suggested_clause: 'SANS 10400-T clause 4.4', tip: 'Self-closer missing, defective or door wedged open' },
  { name: 'Fire penetration not sealed', category: 'fire', suggested_clause: 'SANS 10400-T clause 4.1', tip: 'Pipe/cable penetration through fire wall not intumescent sealed' },
  { name: 'Sprinkler head clearance violation', category: 'fire', suggested_clause: 'SANS 10400-T clause 5.1', tip: 'Obstruction within 450 mm below sprinkler head' },
  // HVAC
  { name: 'Duct leakage test failed', category: 'hvac', suggested_clause: 'SANS 10173 clause 6.1', tip: 'Duct leakage exceeds Class B limits' },
  { name: 'Fire damper not accessible', category: 'hvac', suggested_clause: 'SANS 10173 clause 6.2', tip: 'No access panel provided at fire damper location' },
  { name: 'Flexible connection missing', category: 'hvac', suggested_clause: 'SANS 10173 clause 4.2', tip: 'Rigid connection directly to AHU — vibration isolation not provided' },
  // ICT / CNI
  { name: 'Cable test failed (ICT)', category: 'ict', suggested_clause: 'SANS 10198-4 clause 6.1', tip: 'Channel/link test result FAIL — check terminations, bend radius or damage' },
  { name: 'Bend radius violation (fibre)', category: 'ict', suggested_clause: 'SANS 10198-4 clause 5.2', tip: 'Fibre optic cable bent beyond minimum radius — potential signal loss' },
  { name: 'Cable tray overfilled', category: 'ict', suggested_clause: 'SANS 10198-4 clause 5.1', tip: 'Cable tray fill ratio exceeds recommended 50% capacity' },
  // SANRAL / Drainage structures
  { name: 'Culvert misaligned', category: 'drainage', suggested_clause: 'SANRAL Drainage Manual Ch.4 §4.4', tip: 'Culvert pipe not on design alignment or gradient' },
  { name: 'Culvert outlet unprotected', category: 'drainage', suggested_clause: 'SANRAL Drainage Manual Ch.4 §4.5', tip: 'No apron or scour protection at culvert outlet' },
  { name: 'Riprap undersized / absent', category: 'drainage', suggested_clause: 'SANRAL Drainage Manual Ch.7 §7.2', tip: 'Rock size too small or riprap layer not placed at erosion-prone area' },
  { name: 'Gabion lacing defective', category: 'drainage', suggested_clause: 'SANRAL Drainage Manual Ch.7 §7.3', tip: 'Gabion basket lacing gaps > 100 mm or connection wires missing' },
  { name: 'Side drain gradient insufficient', category: 'drainage', suggested_clause: 'SANRAL Drainage Manual Ch.9 §9.2', tip: 'Roadside drain gradient below minimum — ponding risk' },
  // NHBRC
  { name: 'No geotechnical report', category: 'earthworks', suggested_clause: 'NHBRC Part 2.1.1', tip: 'Foundation design commenced without approved site investigation report' },
  { name: 'Foundation too shallow', category: 'concrete', suggested_clause: 'NHBRC Part 2.1.3', tip: 'Foundation depth does not reach stable, undisturbed soil' },
  { name: 'DPM missing under slab', category: 'concrete', suggested_clause: 'NHBRC Part 2.2.1', tip: 'Damp-proof membrane not laid before ground floor slab pour' },
  { name: 'Slab level tolerance exceeded', category: 'concrete', suggested_clause: 'NHBRC Part 2.2.3', tip: 'Floor slab surface deviation exceeds ±6 mm under 3 m straight edge' },
  { name: 'Smoke detector missing', category: 'fire', suggested_clause: 'NHBRC Part 3.4.1', tip: 'Smoke detector absent in sleeping area or required zone' },
  { name: 'Geyser installation non-compliant', category: 'plumbing', suggested_clause: 'NHBRC Part 3.2.2', tip: 'No pressure limiting valve, no drip tray, or discharge not directed outside' },
];

export function getClausesForCategory(categories) {
  if (!categories || categories.length === 0) return SANS_CLAUSES;
  const cats = Array.isArray(categories) ? categories : [categories];
  return SANS_CLAUSES.filter(c => c.categories.some(cat => cats.includes(cat)));
}

export function suggestClauseForDefect(defectName) {
  const d = COMMON_DEFECTS.find(x => x.name.toLowerCase() === (defectName || '').toLowerCase());
  return d ? d.suggested_clause : '';
}

export function categoriesForInspectionType(type) {
  if (!type) return ['concrete'];
  const t = type.toLowerCase();
  if (t.includes('pre-concrete') || t.includes('post-concrete') || t.includes('pour')) return ['concrete'];
  if (t.includes('rebar') || t.includes('reinforcement')) return ['concrete', 'rebar'];
  if (t.includes('brick') || t.includes('block') || t.includes('masonry')) return ['brickwork'];
  if (t.includes('drain') || t.includes('stormwater')) return ['drainage'];
  if (t.includes('subsoil') || t.includes('subsoil drain')) return ['drainage', 'earthworks'];
  if (t.includes('pipe') || t.includes('plumb') || t.includes('sanitary') || t.includes('water supply')) return ['plumbing', 'drainage'];
  if (t.includes('earthwork') || t.includes('excavation') || t.includes('backfill') || t.includes('compaction')) return ['earthworks'];
  if (t.includes('pil') || t.includes('pile cap')) return ['piling', 'concrete'];
  if (t.includes('road') || t.includes('layer') || t.includes('asphalt') || t.includes('surfacing')) return ['roads'];
  if (t.includes('site clear') || t.includes('demolit')) return ['site-clearance'];
  if (t.includes('electrical') || t.includes('cabling') || t.includes('wiring')) return ['electrical'];
  if (t.includes('fire') || t.includes('sprinkler') || t.includes('suppression')) return ['fire'];
  if (t.includes('hvac') || t.includes('duct') || t.includes('air') || t.includes('mechanical')) return ['hvac'];
  if (t.includes('ict') || t.includes('cni') || t.includes('fibre') || t.includes('data') || t.includes('network')) return ['ict'];
  if (t.includes('culvert') || t.includes('riprap') || t.includes('gabion') || t.includes('erosion') || t.includes('side drain')) return ['drainage', 'earthworks'];
  if (t.includes('nhbrc') || t.includes('slab') || t.includes('floor slab')) return ['concrete', 'earthworks'];
  return ['concrete'];
}

export function getDefectsForCategory(categories) {
  if (!categories || categories.length === 0) return COMMON_DEFECTS;
  const cats = Array.isArray(categories) ? categories : [categories];
  return COMMON_DEFECTS.filter(d => cats.includes(d.category));
}
