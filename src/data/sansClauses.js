/**
 * SANS Standards Clauses Dictionary
 * Filtered by inspection type. Used by Finding & NCR forms.
 *
 * Only clause numbers + topic + brief description (NO copyrighted SANS text).
 * Joshua writes the actual non-conformance description in his own words.
 */

export const SANS_CLAUSES = [
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
  // SANS 1200 D / DB / LB / LE
  { ref: 'SANS 1200 D clause 5.1', topic: 'Excavation depth & alignment', desc: 'Tolerance on excavation, side slopes, dewatering', categories: ['earthworks', 'drainage'] },
  { ref: 'SANS 1200 D clause 6.1', topic: 'Backfill & compaction', desc: 'Layer thickness, compaction percentage, moisture content', categories: ['earthworks', 'drainage'] },
  { ref: 'SANS 1200 DB clause 5.1', topic: 'Trench excavation', desc: 'Trench width, depth, side support requirements', categories: ['drainage'] },
  { ref: 'SANS 1200 DB clause 6.1', topic: 'Pipe bedding & backfill', desc: 'Bedding material, compaction zones around pipe', categories: ['drainage'] },
  { ref: 'SANS 1200 LB clause 5.1', topic: 'Bedding classes', desc: 'Class A/B/C bedding for different pipe types', categories: ['drainage'] },
  { ref: 'SANS 1200 LE clause 5.1', topic: 'Stormwater pipe laying', desc: 'Pipe alignment, joints, fall and grading', categories: ['drainage'] },
  { ref: 'SANS 1200 LE clause 6.1', topic: 'Manholes & inlets', desc: 'Manhole construction, benching, step-irons, covers', categories: ['drainage'] },

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
  { ref: 'SANS 2001-DP1 clause 5.1', topic: 'Pipelines pipe laying', desc: 'Alignment, jointing, anchorage of pipes', categories: ['drainage'] },
  { ref: 'SANS 2001-DP1 clause 6.1', topic: 'Pipelines testing', desc: 'Pressure and leak testing procedures', categories: ['drainage'] },

  // ============ SANS 10400 — National Building Regulations ============
  { ref: 'SANS 10400-B clause 4', topic: 'Structural design – General', desc: 'Strength, stability and serviceability of structural elements', categories: ['concrete', 'brickwork'] },
  { ref: 'SANS 10400-K clause 4.1', topic: 'Walls construction', desc: 'Wall thickness, lateral support, openings', categories: ['brickwork'] },
  { ref: 'SANS 10400-K clause 5.1', topic: 'Walls lintels', desc: 'Lintel bearing length, load distribution', categories: ['brickwork'] },
  { ref: 'SANS 10400-K clause 6.1', topic: 'Walls movement joints', desc: 'Provisions for thermal and moisture movement', categories: ['brickwork'] },
  { ref: 'SANS 10400-L clause 4', topic: 'Roofs structural support', desc: 'Wall plate anchoring, truss support, bracing', categories: ['brickwork'] },
  { ref: 'SANS 10400-M clause 4.1', topic: 'Stairways geometry', desc: 'Tread, riser, going, handrail requirements', categories: ['concrete', 'brickwork'] },
  { ref: 'SANS 10400-R clause 5', topic: 'Stormwater disposal', desc: 'Surface drainage, gully positions, discharge points', categories: ['drainage'] },
];

export const COMMON_DEFECTS = [
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
  { name: 'Bond failure / wrong pattern', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 4.3', tip: 'Stretcher/header bond not followed' },
  { name: 'Mortar joint too thick / thin', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 5.1', tip: 'Bed/perpend joint outside 10mm ±2mm' },
  { name: 'Wall out of plumb', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 7.1', tip: 'Wall verticality outside tolerance' },
  { name: 'Efflorescence', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 4.1', tip: 'Salt deposits indicating moisture / mortar issue' },
  { name: 'DPC missing or damaged', category: 'brickwork', suggested_clause: 'SANS 2001-CM1 clause 5.4', tip: 'Damp-proof course missing/torn/wrong position' },
  { name: 'Pipe fall incorrect', category: 'drainage', suggested_clause: 'SANS 1200 LE clause 5.1', tip: 'Pipe gradient outside spec' },
  { name: 'Bedding inadequate', category: 'drainage', suggested_clause: 'SANS 1200 LB clause 5.1', tip: 'Wrong bedding class or insufficient compaction' },
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
  if (t.includes('drain') || t.includes('pipe') || t.includes('stormwater')) return ['drainage'];
  if (t.includes('earthwork') || t.includes('excavation')) return ['earthworks', 'concrete'];
  return ['concrete'];
}

export function getDefectsForCategory(categories) {
  if (!categories || categories.length === 0) return COMMON_DEFECTS;
  const cats = Array.isArray(categories) ? categories : [categories];
  return COMMON_DEFECTS.filter(d => cats.includes(d.category));
}
