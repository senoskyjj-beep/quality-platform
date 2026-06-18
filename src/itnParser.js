import * as XLSX from 'xlsx';

const INSPECTOR_CANONICAL = {
  harvey: 'Harvey Ntobeng', kamogelo: 'Kamogelo Lebethe',
  masande: 'Masande Pato', munashe: 'Munashe Mapokotera',
  joshua: 'Joshua Senosky',
};

const BUILDING_MAP = {
  'x10 - storage': 'X10 - Storage', 'x10 - west': 'X10 - Storage',
  'x4 - visitors': 'X4 - Visitors', 'x7 - admin': 'X7 - Admin',
  'x9 - process': 'X9 - Process', 'x9': 'X9 - Process',
  'xp - parking': 'XP - Parking',
};

function cleanText(v) { return v === null || v === undefined ? '' : String(v).trim(); }

function normaliseInspector(raw) {
  if (!raw) return '';
  const s = cleanText(raw).replace(/\d{3}\s?\d{3}\s?\d{4}/g, '').trim().toLowerCase();
  for (const key of Object.keys(INSPECTOR_CANONICAL)) {
    if (s.includes(key)) return INSPECTOR_CANONICAL[key];
  }
  return cleanText(raw).replace(/\d{3}\s?\d{3}\s?\d{4}/g, '').trim();
}

function normaliseBuilding(b) {
  const s = cleanText(b);
  return BUILDING_MAP[s.toLowerCase()] || s;
}

function normaliseInspectionType(t) {
  if (!t) return '';
  const s = cleanText(t), sl = s.toLowerCase();
  if (sl.includes('pre-concrete') || sl.includes('pre concrete')) return 'Pre-Concrete Inspection';
  if (sl.includes('post-concrete') || sl.includes('post concrete')) return 'Post-Concrete Inspection';
  if (sl.includes('reinforcement')) return 'Reinforcement Inspection';
  if (sl.includes('rebar')) return 'Rebar Inspection';
  if (sl.includes('punch')) return 'Punchlist Inspection';
  if (sl.includes('brick')) return 'Brickwork Inspection';
  if (sl.includes('drainage')) return 'Drainage Inspection';
  return s;
}

function timeFractionToStr(value) {
  if (value === null || value === undefined || value === '') return '';
  const v = Number(value);
  if (!isNaN(v) && v < 1) {
    const totalMin = Math.round(v * 24 * 60);
    const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
    const m = String(totalMin % 60).padStart(2, '0');
    return `${h}:${m}`;
  }
  return String(value);
}

function flag(v) { return (v === 1 || v === '1' || v === true) ? '1' : ''; }

export function parseITN(buffer, filename) {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: false });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  let itnNo = '', inspectionDate = '';
  const m1 = filename.match(/ITN_(\d+)_/); if (m1) itnNo = m1[1];
  const m2 = filename.match(/ITN_\d+_-_(\d{4}-\d{2}-\d{2})/); if (m2) inspectionDate = m2[1];

  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(15, rows.length); i++) {
    if (rows[i] && rows[i].some(c => String(c || '').trim() === 'Item No')) { headerRowIdx = i; break; }
  }
  if (headerRowIdx === -1) return [];

  const headerRow = rows[headerRowIdx] || [];
  const subHeaderRow = rows[headerRowIdx + 1] || [];
  const colMap = {};
  headerRow.forEach((h, i) => { if (h) colMap[String(h).trim().toLowerCase()] = i; });
  subHeaderRow.forEach((h, i) => { if (h) colMap[String(h).trim().toLowerCase()] = i; });

  function getCol(row, ...names) {
    for (const n of names) {
      const idx = colMap[n.toLowerCase()];
      if (idx !== undefined && row[idx] !== undefined && row[idx] !== null) return row[idx];
    }
    return null;
  }

  const records = [];
  for (let i = headerRowIdx + 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => c === null || c === undefined || c === '')) continue;
    const itemNo = cleanText(getCol(row, 'item no'));
    const building = normaliseBuilding(getCol(row, 'building'));
    const inspector = normaliseInspector(getCol(row, 'inspector'));
    if (!itemNo && !building && !inspector) continue;

    records.push({
      date: inspectionDate, itn_no: itnNo, item_no: itemNo,
      booking_source: 'I&TN xlsx upload',
      initial: flag(getCol(row, 'initial inspection')),
      repeat: flag(getCol(row, 'repeat inspection')),
      previous_itn: cleanText(getCol(row, 'previous i&tn no')),
      late_request: flag(getCol(row, 'late request')),
      itp_no: cleanText(getCol(row, 'itp no')),
      activity_no: cleanText(getCol(row, 'activity no')),
      structural: flag(getCol(row, 'structural')),
      architect: flag(getCol(row, 'architect')),
      other: flag(getCol(row, 'other')),
      building, area: cleanText(getCol(row, 'area')),
      item_description: cleanText(getCol(row, 'item/description/gridline', 'item / description / gridline')),
      inspection_type: normaliseInspectionType(getCol(row, 'inspection / test / activity')),
      time: timeFractionToStr(getCol(row, 'inspection time')),
      inspector, employer_rep: cleanText(getCol(row, 'employer representative')),
      status: flag(getCol(row, 'conformant')) === '1' ? 'Conformant' :
              flag(getCol(row, 'cancelled')) === '1' ? 'Cancelled' :
              flag(getCol(row, 'rejected')) === '1' ? 'Rejected' :
              flag(getCol(row, 'nonconformant')) === '1' ? 'Nonconformant' : '',
      status_reason: '', short_note: cleanText(getCol(row, 'qvr no')),
    });
  }
  return records;
}

export async function parseITNFiles(fileList) {
  const all = [];
  for (const file of fileList) {
    const buf = await file.arrayBuffer();
    all.push(...parseITN(buf, file.name));
  }
  return all;
}
