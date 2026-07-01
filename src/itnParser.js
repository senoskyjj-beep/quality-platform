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
  let wb;
  try {
    wb = XLSX.read(buffer, { type: 'array', cellDates: false });
  } catch (err) {
    const msg = String(err && err.message || err).toLowerCase();
    const isPasswordProtected = msg.includes('password') || msg.includes('encrypt');
    return {
      records: [],
      warnings: [isPasswordProtected
        ? `${filename}: this file is password-protected — remove the password (File → Save a Copy without a password, in Excel/Numbers) and upload again.`
        : `${filename}: couldn't open this file as a spreadsheet (${err.message || err}). It may be corrupted or not a real .xlsx file.`]
    };
  }
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  // Accepts "ITN_140_...", "ITN 140 - ...", "ITN140-...", etc. — any
  // separator (space, underscore, dash) between "ITN" and the number.
  let itnNo = '', inspectionDate = '';
  const m1 = filename.match(/ITN[\s_-]*#?(\d+)/i);
  if (m1) itnNo = m1[1];

  // Accepts a date anywhere in the filename, either "YYYY-MM-DD" or a
  // compact "YYYYMMDD" — whatever separator surrounds it.
  const dateDash = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  const dateCompact = !dateDash && filename.match(/(?<!\d)(\d{4})(\d{2})(\d{2})(?!\d)/);
  if (dateDash) inspectionDate = `${dateDash[1]}-${dateDash[2]}-${dateDash[3]}`;
  else if (dateCompact) inspectionDate = `${dateCompact[1]}-${dateCompact[2]}-${dateCompact[3]}`;

  const warnings = [];
  if (!itnNo) warnings.push(`${filename}: couldn't detect an I&TN number from the filename — expected something like "ITN 140" or "ITN_140" in the name.`);
  if (!inspectionDate) warnings.push(`${filename}: couldn't detect a date from the filename — expected a "YYYY-MM-DD" or "YYYYMMDD" date somewhere in the name. Rows will need a date filled in manually.`);

  // Case-insensitive, tolerant of "Item No.", "Item Number", "Item #".
  function isItemNoHeader(c) {
    const s = String(c || '').trim().toLowerCase().replace(/\.$/, '');
    return s === 'item no' || s === 'item number' || s === 'item #' || s === 'item no ';
  }
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(15, rows.length); i++) {
    if (rows[i] && rows[i].some(isItemNoHeader)) { headerRowIdx = i; break; }
  }
  if (headerRowIdx === -1) {
    warnings.push(`${filename}: couldn't find an "Item No" header row in the first 15 rows — no rows imported from this file. Check the file isn't password-protected and the column is labelled "Item No".`);
    return { records: [], warnings };
  }

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
  return { records, warnings };
}

export async function parseITNFiles(fileList) {
  const allRecords = [];
  const allWarnings = [];
  for (const file of fileList) {
    const buf = await file.arrayBuffer();
    const { records, warnings } = parseITN(buf, file.name);
    allRecords.push(...records);
    allWarnings.push(...warnings);
  }
  return { records: allRecords, warnings: allWarnings };
}
