import React from 'react';
import { styles, colors } from '../styles';

/**
 * Read-only project specifications reference.
 * Values captured from the EC0148 drawing title-block notes
 * (architectural general notes, drainage, glass, HVAC, ventilation).
 *
 * For quick on-site lookup. These are project-specific requirements —
 * always defer to the latest issued drawing / engineer's instruction if in doubt.
 */

const SPEC_GROUPS = [
  {
    title: 'Concrete — Classes (strength/aggregate)',
    color: colors.redDark,
    items: [
      ['Standards', 'All concrete to comply with SANS 1200-G, SANS 2001-CC1, SANS 2001-CC2'],
      ['Slabs', '30/19'],
      ['Beams', '30/19'],
      ['Columns', '40/19'],
      ['Walls', '40/19'],
      ['Retaining Walls', '30/19'],
      ['Raft Foundations', '30/19'],
      ['Pile Caps', '30/19'],
      ['Piles', 'By others'],
      ['Surface Beds', '30/19'],
      ['Infill Concrete', '25/19'],
      ['Blinding', '10/19'],
    ],
  },
  {
    title: 'Concrete — Cover to Reinforcement',
    color: colors.orangeDark,
    items: [
      ['Roof Slabs', '50mm'],
      ['Beams', '40mm'],
      ['Columns', '30mm'],
      ['Walls', '30mm'],
      ['Raft Foundations', '50mm'],
      ['Pile Caps', '75mm'],
      ['Footings', '50mm'],
      ['Ground Beams', '40mm'],
      ['Surface Beds', '30mm'],
      ['Internal Slabs', '40mm'],
      ['Retaining Walls', '50mm'],
      ['Piles', 'By others'],
    ],
  },
  {
    title: 'Concrete — Pouring, Cubes & Curing',
    color: colors.navy,
    items: [
      ['Foundation excavations', 'Inspected by Geotechnical Engineer prior to casting concrete'],
      ['Inspection notice', 'Engineer requires 48 hours notice for all inspections'],
      ['Cube sampling', '6 cubes per every 50 m³ of concrete — 3 tested at 7 days, 3 at 28 days; results forwarded to engineer for acceptance'],
      ['Pile caps', 'To cast without cold joints'],
      ['Heat of hydration', 'To be controlled in all concrete casts'],
      ['Thermal shock', 'Avoid when removing formwork'],
      ['Formwork — loosening', 'Loosened and kept in place for 24 hours before being fully removed'],
      ['Formwork — min strip time', 'Not to be removed before 48 hours after the pour'],
      ['Curing', 'All structural concrete cured min 5 days, unless noted otherwise'],
      ['Safe bearing pressure', 'Minimum 100 kPa required, unless noted otherwise'],
    ],
  },
  {
    title: 'Brickwork (Structural)',
    color: colors.greenDark,
    items: [
      ['Standard', 'All brickwork per SANS 10400 Part K'],
      ['Plaster interfaces', 'Brickwork/plaster interfaces to receive V-Joints'],
      ['Strength & absorption', 'Min 14 MPa compressive strength, absorption < 7%, on Class II mortar (per SANS 10164-1)'],
      ['Brickforce — general', 'Every 4th course, except first 5 courses above strip footing and above all windows/doors'],
      ['Brickforce — openings', 'Every course above door & window openings'],
      ['Brickforce — base', 'Every course of brickwork above strip footings for first 5 courses'],
    ],
  },
  {
    title: 'Structural Steelwork',
    color: colors.purple,
    items: [
      ['Standards', 'SANS 1200-H & SANS 2001-CS1'],
      ['Grade', 'Grade S355JR, SABS 1431 approved'],
      ['Mill certificate', 'Required by engineer prior to installation'],
      ['Site connections', 'Min Grade 8.8 M16 bolts, unless noted otherwise'],
      ['Welds', 'Min 6mm continuous fillet welds; NO welded connections permitted on site'],
      ['Drilling/cutting', 'No drilling or cutting on site — all holes predrilled'],
      ['Galvanizing', 'All structural steel hot dip galvanized'],
      ['Fabrication drawings', 'Forwarded to engineer for acceptance prior to fabrication'],
      ['Discrepancies', 'Contractor to notify engineer prior to fabrication, casting or erection'],
    ],
  },
  {
    title: 'General / Building',
    color: colors.navy,
    items: [
      ['Governing regs', 'National Building Regulations (Act 103 of 1977) incl. amendments + local authority by-laws'],
      ['Site verification', 'All levels, dimensions & steps to be checked and verified on site before commencing any work'],
      ['Discrepancies', 'Any indistinctness or discrepancy to be pointed out to the Architect for rectification before construction'],
      ['Scaling', 'Drawings are NOT to be scaled'],
      ['Wall dimensions', 'All wall dimensions are from FINISHED surfaces'],
      ['Plaster finish', 'All plaster finishes to be flush with off-shutter concrete columns and beams'],
    ],
  },
  {
    title: 'Brickwork & DPC',
    color: colors.greenDark,
    items: [
      ['Brickforce', 'To be installed every 5 courses of brickwork'],
      ['DPC', 'Provide DPC to wall at slab level, under all cills, and at all changes in floor levels'],
    ],
  },
  {
    title: 'Concrete Columns — Edges',
    color: colors.orangeDark,
    items: [
      ['Columns in walls', 'To be UN-chamfered'],
      ['Free-standing & exposed column edges', 'To have chamfers'],
      ['Off-shutter finish', 'Plaster to finish flush with off-shutter concrete columns & beams'],
    ],
  },
  {
    title: 'Drainage',
    color: colors.navy,
    items: [
      ['Compliance', 'All plumbing & drainage and sanitary fittings to comply with local authority by-laws & requirements'],
      ['Min fall — drain pipes', '1:40 minimum'],
      ['Inspection eyes (I.E.)', 'Provide at all bends & junctions, with suitable markers at ground level; fully accessible at all times'],
      ['Anti-emptying (A.E.)', 'Provide to foot of all soil stacks'],
      ['Reseal traps', 'Approved reseal traps to all waste fittings'],
      ['Pipes under building/footings', 'Encase in concrete, minimum 100mm thickness all round pipe'],
      ['Condensate drains (HVAC)', 'Acceptable fall 1:80 minimum; shortest possible route'],
    ],
  },
  {
    title: 'Glass / Glazing',
    color: colors.purple,
    items: [
      ['0 – 0.75 m²', '3mm glass'],
      ['0.75 – 1.5 m²', '4mm glass'],
      ['Over 1.5 m²', '6mm glass'],
      ['Windows/sidelights < 300mm from floor', '6mm SAFETY glass'],
      ['Sliding / French doors', '6mm SAFETY glass with safety indicators'],
    ],
  },
  {
    title: 'HVAC / Mechanical',
    color: colors.redDark,
    items: [
      ['Ducting', 'Galvanised mild steel with mezz-flanges; supported per SABS 0193; joints sealed & airtight'],
      ['Toilet doors (mech vent)', 'Undercut minimum 20mm'],
      ['Noise limit', 'Artificial ventilation not to cause ambient noise > 50 dBA at property boundary'],
      ['Mountings', 'All equipment on anti-vibration mountings'],
      ['Fire dampers', '350mm long, Electrovent or equal approved; close on fire signal'],
      ['Sound attenuators', '75mm air gaps; selected for NC40 at 1m from any outlet'],
      ['Builder — penetrations', 'Provide penetrations through slabs & brick walls; fire-stop & seal to Architect detail'],
      ['Door grilles', '500x300 (unless noted) supplied by A/C contractor, cut & fitted by builder'],
      ['External penetrations', 'Complete with burglar bars'],
    ],
  },
  {
    title: 'Ventilation Fans',
    color: colors.greenDark,
    items: [
      ['Mounting', 'Galvanised channel brackets c/w anti-vibration spring mountings'],
      ['Insulation', 'Fans wrapped in 100mm Armaflex, clad with galvanised sheetmetal'],
      ['Smoke extract fans', 'Rated 300°C for 60 min, EN 12101 certified, fed from essential power'],
      ['Motors', 'Premium efficiency; variable speed controlled'],
      ['Pressurisation fans', 'VSD control via pressure sensors to maintain 25 Pa'],
      ['Example — EAF-XP-G.1 (ICT Room)', 'In-wall exhaust, Ø150, 10 L/s, 50 Pa, 0.01 kW, 2500 rpm'],
    ],
  },
];

export default function SpecsTab() {
  return (
    <>
      <div style={styles.card}>
        <div style={{ ...styles.banner, ...styles.bannerInfo }}>
          📐 Project Specifications — EC0148 drawing notes (quick reference)
        </div>
        <p style={{ fontSize: 12, color: colors.greyDark, lineHeight: 1.5 }}>
          Captured from the architectural &amp; services drawing title-block notes for this project.
          For on-site lookup only — always defer to the latest issued drawing or the engineer's
          written instruction where there is any doubt or conflict.
        </p>
      </div>

      {SPEC_GROUPS.map(group => (
        <div key={group.title} style={styles.card}>
          <div style={{ ...styles.sectionTitle, color: group.color }}>{group.title}</div>
          <table style={styles.table}>
            <tbody>
              {group.items.map(([label, value], i) => (
                <tr key={i}>
                  <td style={{ ...styles.td, fontWeight: 600, width: '38%', verticalAlign: 'top' }}>{label}</td>
                  <td style={{ ...styles.td }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={styles.card}>
        <p style={{ fontSize: 11, color: colors.greyDark, fontStyle: 'italic' }}>
          Note: project drawings are the client's copyright (Copyright Act 98 of 1978). These values are
          held here as a private working reference for EC0148 site quality control.
        </p>
      </div>
    </>
  );
}
