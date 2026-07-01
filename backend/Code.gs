/**
 * QA Portal V2 Backend — Google Apps Script
 * Booking-first data model for Cape Town Logistics Warehouse Facility (EC0148)
 *
 * DEPLOY:
 *  1. Create Google Sheet → name it "QA Portal Data V2"
 *  2. Extensions → Apps Script → paste this entire file → Save
 *  3. Run setupSheets() once to create all tables + seed data
 *  4. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone
 *  5. Copy URL → paste into src/config.js as SCRIPT_URL
 */

const SHEET_SCHEMA = {
  Inspections: [
    'id', 'date', 'itn_no', 'item_no', 'booking_source', 'requested_by',
    'initial', 'repeat', 'previous_itn', 'late_request',
    'itp_no', 'activity_no', 'discipline',
    'structural', 'architect', 'other',
    'building', 'area', 'item_description',
    'inspection_type', 'time', 'inspector', 'employer_rep', 'engineer', 'foreman',
    'status', 'status_reason', 'short_note',
    'has_finding', 'has_ncr', 'has_cube', 'has_doc',
    'created_at', 'updated_at', 'deleted'
  ],
  Findings: [
    'id', 'finding_no', 'linked_inspection_id',
    'date', 'time', 'building', 'area', 'element_ref',
    'inspector', 'engineer', 'foreman',
    'defect_type', 'severity', 'description', 'sans_clause',
    'action_required', 'responsible_party', 'target_date',
    'status', 'closed_out', 'closeout_date', 'verified_by',
    'promoted_to_ncr', 'linked_ncr_id',
    'created_at', 'updated_at', 'deleted'
  ],
  NCRs: [
    'id', 'ncr_no', 'linked_inspection_id', 'linked_finding_id',
    'date_raised', 'raised_by_role', 'raised_by_name',
    'building', 'area', 'element_ref',
    'defect_type', 'severity', 'description', 'sans_clause',
    'foreman_issued', 'engineer_notified',
    'action_required', 'target_closeout', 'actual_closeout',
    'status', 'verified_by', 'word_filename', 'notes',
    'created_at', 'updated_at', 'deleted'
  ],
  Cubes: [
    'id', 'cube_id', 'linked_inspection_id',
    'cast_date', 'building', 'area', 'element_location',
    'spec_grade', 'spec_mpa', 'batch_no', 'supplier', 'truck_no',
    'slump_actual', 'ambient_temp',
    'test_date_7', 'result_7', 'pass_7',
    'test_date_21', 'result_21',
    'test_date_28', 'result_28', 'pass_28',
    'lab', 'cert_ref', 'cert_signed',
    'cube_taker', 'notes',
    'created_at', 'updated_at', 'deleted'
  ],
  Documents: [
    'id', 'linked_type', 'linked_id',
    'doc_type', 'filename', 'caption',
    'uploaded_by_role', 'uploaded_by_name',
    'base64_data', 'created_at'
  ],
  Photos: [
    'id', 'linked_type', 'linked_id',
    'filename', 'caption', 'base64_data',
    'uploaded_at', 'uploaded_by'
  ],
  ITPRegister: [
    'id', 'itp_no', 'itp_title', 'discipline', 'building',
    'total_inspections_required',
    'inspections_completed', 'conformant', 'cancelled', 'rejected', 'nonconformant',
    'cubes_required', 'cubes_received',
    'signed_off', 'signoff_date', 'signoff_by',
    'notes', 'created_at', 'updated_at'
  ],
  SetupData: ['category', 'value', 'phone'],
  ProjectInfo: ['key', 'value'],
  Audit: ['timestamp', 'action', 'table', 'record_id', 'user', 'details'],
};

// ============ Entry points ============

// Writes that modify the sheet run one-at-a-time via a lock,
// so two devices can't overwrite each other (no lost/duplicate saves).
var WRITE_ACTIONS = {
  saveSetup: true, saveInspection: true, bulkSaveInspections: true,
  deleteInspection: true, updateInspectionStatus: true, recomputeInspectionFlags: true,
  saveFinding: true, deleteFinding: true, promoteToNCR: true,
  saveNCR: true, deleteNCR: true, saveCube: true,
  saveDocument: true, deleteDocument: true, savePhoto: true, saveITP: true,
  submitBookingRequest: true
};

// ============ Public booking-link access control ============
// The shareable booking link (src/BookingRequestForm.js) has no login and is
// shared over WhatsApp to anyone on site. It must never be able to reach the
// full API surface (delete/overwrite/setup actions, PII in getSetup) — only
// these two actions are reachable without the internal API_KEY below.
// This key must match src/apiKey.js in the frontend, which is bundled ONLY
// into the main app (code-split away from the public booking page) so it is
// never shipped to anyone who only opens the booking link.
const API_KEY = 'ec0148-qa-9f3d7a2c5e816b4f0d9a3c7e2b5f8d1a';
var PUBLIC_ACTIONS = { ping: true, getBookingFormOptions: true, submitBookingRequest: true };

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  var lock = null;
  try {
    let params;
    if (e && e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = (e && e.parameter) || {};
      if (params.payload) {
        try { params = JSON.parse(params.payload); } catch (_) {}
      }
    }
    const action = params.action;
    if (!action) return jsonResponse({ ok: false, error: 'No action specified' });

    if (!PUBLIC_ACTIONS[action] && params.key !== API_KEY) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }

    // Serialize all write actions behind a script lock
    if (WRITE_ACTIONS[action]) {
      lock = LockService.getScriptLock();
      lock.waitLock(30000); // wait up to 30s for any in-progress write
    }

    let result;
    switch (action) {
      case 'ping': result = { ok: true, time: new Date().toISOString(), version: 'v2' }; break;
      case 'getSetup': result = getSetup(); break;
      case 'getBookingFormOptions': result = getBookingFormOptions(); break;
      case 'submitBookingRequest': result = submitBookingRequest(params.record); break;
      case 'saveSetup': result = saveSetup(params.data); break;
      case 'getAll': result = getAll(); break;
      case 'listInspections': result = listRecords('Inspections', params.filter); break;
      case 'saveInspection': result = saveInspection(params.record); break;
      case 'bulkSaveInspections': result = bulkSaveInspections(params.records); break;
      case 'deleteInspection': result = softDelete('Inspections', params.id); break;
      case 'updateInspectionStatus': result = updateInspectionStatus(params.id, params.status, params.reason, params.shortNote); break;
      case 'recomputeInspectionFlags': result = recomputeInspectionFlags(params.id); break;
      case 'listFindings': result = listRecords('Findings', params.filter); break;
      case 'saveFinding': result = saveFinding(params.record); break;
      case 'deleteFinding': result = softDelete('Findings', params.id); break;
      case 'promoteToNCR': result = promoteFindingToNCR(params.findingId, params.raisedByRole, params.raisedByName); break;
      case 'listNCRs': result = listRecords('NCRs', params.filter); break;
      case 'saveNCR': result = saveNCR(params.record); break;
      case 'deleteNCR': result = softDelete('NCRs', params.id); break;
      case 'listCubes': result = listRecords('Cubes', params.filter); break;
      case 'saveCube': result = saveRecord('Cubes', params.record); break;
      case 'listDocuments': result = listDocuments(params.linkedType, params.linkedId); break;
      case 'saveDocument': result = saveDocument(params.doc); break;
      case 'deleteDocument': result = softDelete('Documents', params.id); break;
      case 'savePhoto': result = savePhoto(params.photo); break;
      case 'listPhotos': result = listPhotos(params.linkedType, params.linkedId); break;
      case 'listITP': result = listRecords('ITPRegister', null); break;
      case 'saveITP': result = saveRecord('ITPRegister', params.record); break;
      case 'getDashboard': result = getDashboard(); break;
      case 'getAuditLog': result = getAuditLog(params.limit || 100); break;
      default: result = { ok: false, error: 'Unknown action: ' + action };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  } finally {
    if (lock) lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============ Setup ============

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEET_SCHEMA).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_SCHEMA[name]);
      sheet.getRange(1, 1, 1, SHEET_SCHEMA[name].length)
           .setFontWeight('bold').setBackground('#1F4E79').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
  });

  const setup = ss.getSheetByName('SetupData');
  if (setup.getLastRow() <= 1) {
    const defaults = [
      ['Inspectors', 'Joshua Senosky', ''],
      ['Inspectors', 'Harvey Ntobeng', ''],
      ['Inspectors', 'Kamogelo Lebethe', '066 022 8561'],
      ['Inspectors', 'Masande Pato', '066 562 3745'],
      ['Inspectors', 'Munashe Mapokotera', '063 556 6671'],
      ['Buildings', 'X4 - Visitors', ''],
      ['Buildings', 'X7 - Admin', ''],
      ['Buildings', 'X9 - Process', ''],
      ['Buildings', 'X10 - Storage', ''],
      ['Buildings', 'XP - Parking', ''],
      ['EmployerReps', 'Errol Tromp', ''],
      ['EmployerReps', 'Mark Chapman', ''],
      ['Engineers', 'T. Govender', ''],
      ['Engineers', 'S. Maluleke', ''],
      ['Foremen', 'P. Botha', ''],
      ['Foremen', 'L. Mahlangu', ''],
      ['InspectionTypes', 'Pre-Concrete Inspection', ''],
      ['InspectionTypes', 'Post-Concrete Inspection', ''],
      ['InspectionTypes', 'Reinforcement Inspection', ''],
      ['InspectionTypes', 'Rebar Inspection', ''],
      ['InspectionTypes', 'Brickwork Inspection', ''],
      ['InspectionTypes', 'Block Wall Inspection', ''],
      ['InspectionTypes', 'Drainage Inspection', ''],
      ['InspectionTypes', 'Punchlist Inspection', ''],
      ['Disciplines', 'Concrete', ''],
      ['Disciplines', 'Brickwork / Masonry', ''],
      ['Disciplines', 'Drainage', ''],
      ['Disciplines', 'Earthworks', ''],
      ['Disciplines', 'Finishes', ''],
      ['NCRRaisedByRoles', 'Quality Inspector (Joshua)', ''],
      ['NCRRaisedByRoles', 'Engineer', ''],
      ['NCRRaisedByRoles', 'Foreman', ''],
      ['NCRRaisedByRoles', 'Client / Employer Rep', ''],
      ['NCRRaisedByRoles', 'Quality Manager', ''],
      ['CancellationReasons', 'Weather', ''],
      ['CancellationReasons', 'Material not ready', ''],
      ['CancellationReasons', 'Engineer not available', ''],
      ['CancellationReasons', 'Finding raised — work not ready', ''],
      ['CancellationReasons', 'NCR open — pending close-out', ''],
      ['CancellationReasons', 'Site safety standdown', ''],
      ['CancellationReasons', 'Other', ''],
      ['RejectionReasons', 'Quality not acceptable', ''],
      ['RejectionReasons', 'Documentation incomplete', ''],
      ['RejectionReasons', 'Survey set-out not signed off', ''],
      ['RejectionReasons', 'Materials non-conformant', ''],
      ['RejectionReasons', 'Other', ''],
      ['DocumentTypes', 'Cube test certificate', ''],
      ['DocumentTypes', 'Material delivery note', ''],
      ['DocumentTypes', 'Survey set-out sheet', ''],
      ['DocumentTypes', 'Engineer instruction', ''],
      ['DocumentTypes', 'Site photo', ''],
      ['DocumentTypes', 'Sign-off sheet', ''],
      ['DocumentTypes', 'Other', ''],
      ['UploadedByRoles', 'Quality Inspector (Joshua)', ''],
      ['UploadedByRoles', 'Client / Employer Rep', ''],
      ['UploadedByRoles', 'Engineer', ''],
      ['UploadedByRoles', 'Foreman', ''],
      ['UploadedByRoles', 'Quality Manager', ''],
      ['UploadedByRoles', 'Lab / Testing Authority', ''],
    ];
    defaults.forEach(row => setup.appendRow(row));
  }

  const proj = ss.getSheetByName('ProjectInfo');
  if (proj.getLastRow() <= 1) {
    const pi = [
      ['project_name', 'Cape Town Logistics Warehouse Facility – Main Works'],
      ['project_number', 'EC0148'],
      ['document_no', 'ECCJV-CON-QA-OPS-F034'],
      ['revision_no', '00'],
      ['main_contractor', 'Concor / Enza JV'],
      ['current_phase', 'Foundation – Columns & Slabs'],
      ['inspector_name', 'Joshua Senosky'],
      ['inspector_phone', ''],
    ];
    pi.forEach(row => proj.appendRow(row));
  }
  return 'Setup complete (V2). Sheets created: ' + Object.keys(SHEET_SCHEMA).join(', ');
}

// ============ Generic record ops ============

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name + '. Run setupSheets() first.');
  return sheet;
}
function getHeaders(sheet) {
  const lastCol = sheet.getLastColumn();
  return lastCol === 0 ? [] : sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}
function rowToObject(row, headers) {
  const obj = {};
  headers.forEach((h, i) => { obj[h] = row[i]; });
  return obj;
}
function objectToRow(obj, headers) {
  return headers.map(h => escapeFormulaValue(obj[h] !== undefined ? obj[h] : ''));
}

// Prevents spreadsheet formula injection (e.g. =IMPORTXML(...), +HYPERLINK(...))
// from any text field — internal or public — by forcing such values to be
// treated as literal text instead of a formula when the sheet renders them.
// Plain signed numbers (temperatures, mm deviations like "-5", "+12.3") are
// left untouched so they still store as real numbers, not text.
function escapeFormulaValue(v) {
  if (typeof v !== 'string') return v;
  if (!/^[=+\-@]/.test(v)) return v;
  if (/^[+-]?\d+(\.\d+)?$/.test(v)) return v;
  return "'" + v;
}

function listRecords(sheetName, filter) {
  const sheet = getSheet(sheetName);
  const headers = getHeaders(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: true, records: [], headers };
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  let records = data.map(row => rowToObject(row, headers))
                    .filter(r => !(r.deleted === true || r.deleted === 'TRUE' || r.deleted === 'true'));
  if (filter && typeof filter === 'object') {
    Object.keys(filter).forEach(key => {
      records = records.filter(r => String(r[key]) === String(filter[key]));
    });
  }
  return { ok: true, records, headers };
}

function saveRecord(sheetName, record) {
  if (!record) return { ok: false, error: 'No record provided' };
  const sheet = getSheet(sheetName);
  const headers = getHeaders(sheet);
  const now = new Date().toISOString();

  if (!record.id) {
    record.id = Utilities.getUuid();
    record.created_at = now;
    record.updated_at = now;
    sheet.appendRow(objectToRow(record, headers));
    audit('CREATE', sheetName, record.id, record);
    return { ok: true, record, mode: 'created' };
  }

  const lastRow = sheet.getLastRow();
  const idCol = headers.indexOf('id') + 1;
  const ids = sheet.getRange(2, idCol, Math.max(1, lastRow - 1), 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(record.id)) {
      record.updated_at = now;
      const existing = rowToObject(sheet.getRange(i + 2, 1, 1, headers.length).getValues()[0], headers);
      if (existing.created_at && !record.created_at) record.created_at = existing.created_at;
      sheet.getRange(i + 2, 1, 1, headers.length).setValues([objectToRow(record, headers)]);
      audit('UPDATE', sheetName, record.id, record);
      return { ok: true, record, mode: 'updated' };
    }
  }
  record.created_at = now;
  record.updated_at = now;
  sheet.appendRow(objectToRow(record, headers));
  audit('CREATE', sheetName, record.id, record);
  return { ok: true, record, mode: 'created_new_id' };
}

function softDelete(sheetName, id) {
  if (!id) return { ok: false, error: 'No id' };
  const sheet = getSheet(sheetName);
  const headers = getHeaders(sheet);
  const idCol = headers.indexOf('id') + 1;
  const delCol = headers.indexOf('deleted') + 1;
  const lastRow = sheet.getLastRow();
  const ids = sheet.getRange(2, idCol, Math.max(1, lastRow - 1), 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      if (delCol > 0) sheet.getRange(i + 2, delCol).setValue(true);
      else {
        sheet.getRange(1, headers.length + 1).setValue('deleted');
        sheet.getRange(i + 2, headers.length + 1).setValue(true);
      }
      audit('DELETE', sheetName, id, {});
      return { ok: true, id };
    }
  }
  return { ok: false, error: 'Record not found' };
}

// ============ Inspection-specific ============

function saveInspection(record) {
  const res = saveRecord('Inspections', record);
  if (res.ok && record && record.inspection_type) {
    const t = String(record.inspection_type).toLowerCase();
    const isPour = t.includes('pre-concrete') || t.includes('post-concrete') || t.includes('pour');
    if (isPour) {
      const existing = listRecords('Cubes', { linked_inspection_id: res.record.id });
      if (existing.records.length === 0) {
        const cube = {
          linked_inspection_id: res.record.id,
          cast_date: res.record.date,
          building: res.record.building,
          area: res.record.area,
          element_location: res.record.item_description,
          batch_no: '', spec_mpa: '', supplier: '',
          cube_taker: '', notes: 'Auto-created from inspection booking',
        };
        saveRecord('Cubes', cube);
        const insp = Object.assign({}, res.record, { has_cube: '1' });
        saveRecord('Inspections', insp);
      }
    }
  }
  return res;
}

function bulkSaveInspections(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return { ok: false, error: 'No records provided' };
  }
  const results = [];
  records.forEach(rec => {
    try { results.push(saveInspection(rec)); }
    catch (err) { results.push({ ok: false, error: err.toString(), record: rec }); }
  });
  return { ok: true, count: results.length, results };
}

function updateInspectionStatus(id, status, reason, shortNote) {
  const sheet = getSheet('Inspections');
  const headers = getHeaders(sheet);
  const idCol = headers.indexOf('id') + 1;
  const lastRow = sheet.getLastRow();
  const ids = sheet.getRange(2, idCol, Math.max(1, lastRow - 1), 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      const existing = rowToObject(sheet.getRange(i + 2, 1, 1, headers.length).getValues()[0], headers);
      existing.status = status;
      existing.status_reason = reason || '';
      if (shortNote !== undefined) existing.short_note = shortNote;
      existing.updated_at = new Date().toISOString();
      sheet.getRange(i + 2, 1, 1, headers.length).setValues([objectToRow(existing, headers)]);
      audit('UPDATE_STATUS', 'Inspections', id, { status, reason });
      return { ok: true, record: existing };
    }
  }
  return { ok: false, error: 'Inspection not found' };
}

function recomputeInspectionFlags(id) {
  const sheet = getSheet('Inspections');
  const headers = getHeaders(sheet);
  const idCol = headers.indexOf('id') + 1;
  const lastRow = sheet.getLastRow();
  const ids = sheet.getRange(2, idCol, Math.max(1, lastRow - 1), 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      const existing = rowToObject(sheet.getRange(i + 2, 1, 1, headers.length).getValues()[0], headers);
      existing.has_finding = listRecords('Findings', { linked_inspection_id: id }).records.length > 0 ? '1' : '';
      existing.has_ncr = listRecords('NCRs', { linked_inspection_id: id }).records.length > 0 ? '1' : '';
      existing.has_cube = listRecords('Cubes', { linked_inspection_id: id }).records.length > 0 ? '1' : '';
      existing.has_doc = listRecords('Documents', { linked_type: 'Inspection', linked_id: id }).records.length > 0 ? '1' : '';
      existing.updated_at = new Date().toISOString();
      sheet.getRange(i + 2, 1, 1, headers.length).setValues([objectToRow(existing, headers)]);
      return { ok: true, record: existing };
    }
  }
  return { ok: false, error: 'Not found' };
}

// ============ Findings ============

function saveFinding(record) {
  const res = saveRecord('Findings', record);
  if (res.ok && record && record.linked_inspection_id) {
    recomputeInspectionFlags(record.linked_inspection_id);
    if (record.description) {
      const sheet = getSheet('Inspections');
      const headers = getHeaders(sheet);
      const idCol = headers.indexOf('id') + 1;
      const lastRow = sheet.getLastRow();
      const ids = sheet.getRange(2, idCol, Math.max(1, lastRow - 1), 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(record.linked_inspection_id)) {
          const existing = rowToObject(sheet.getRange(i + 2, 1, 1, headers.length).getValues()[0], headers);
          const shortDesc = String(record.description || '').substring(0, 80);
          const prefix = '⚠ Finding: ';
          const newNote = existing.short_note && !existing.short_note.includes(shortDesc)
            ? existing.short_note + ' | ' + prefix + shortDesc : prefix + shortDesc;
          existing.short_note = newNote;
          existing.has_finding = '1';
          existing.updated_at = new Date().toISOString();
          sheet.getRange(i + 2, 1, 1, headers.length).setValues([objectToRow(existing, headers)]);
          break;
        }
      }
    }
  }
  return res;
}

function promoteFindingToNCR(findingId, raisedByRole, raisedByName) {
  const finding = listRecords('Findings', null).records.find(f => f.id === findingId);
  if (!finding) return { ok: false, error: 'Finding not found' };
  const ncr = {
    linked_inspection_id: finding.linked_inspection_id,
    linked_finding_id: finding.id,
    date_raised: new Date().toISOString().split('T')[0],
    raised_by_role: raisedByRole || 'Quality Inspector (Joshua)',
    raised_by_name: raisedByName || 'Joshua Senosky',
    building: finding.building, area: finding.area, element_ref: finding.element_ref,
    defect_type: finding.defect_type, severity: finding.severity,
    description: finding.description, sans_clause: finding.sans_clause,
    foreman_issued: finding.foreman, engineer_notified: finding.engineer,
    action_required: finding.action_required, target_closeout: finding.target_date,
    status: 'Open',
    notes: 'Promoted from Finding ' + (finding.finding_no || (finding.id ? finding.id.substring(0, 8) : ''))
  };
  const res = saveNCR(ncr);
  if (!res.ok) return res;
  finding.promoted_to_ncr = '1';
  finding.linked_ncr_id = res.record.id;
  saveRecord('Findings', finding);
  return { ok: true, ncr: res.record, finding };
}

// ============ NCRs ============

function saveNCR(record) {
  const res = saveRecord('NCRs', record);
  if (res.ok && record && record.linked_inspection_id) {
    recomputeInspectionFlags(record.linked_inspection_id);
    const sheet = getSheet('Inspections');
    const headers = getHeaders(sheet);
    const idCol = headers.indexOf('id') + 1;
    const lastRow = sheet.getLastRow();
    const ids = sheet.getRange(2, idCol, Math.max(1, lastRow - 1), 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(record.linked_inspection_id)) {
        const existing = rowToObject(sheet.getRange(i + 2, 1, 1, headers.length).getValues()[0], headers);
        const ncrTag = '📋 NCR: ' + (record.ncr_no || '(draft)');
        const newNote = existing.short_note && !existing.short_note.includes(ncrTag)
          ? existing.short_note + ' | ' + ncrTag : ncrTag;
        existing.short_note = newNote;
        existing.has_ncr = '1';
        existing.updated_at = new Date().toISOString();
        sheet.getRange(i + 2, 1, 1, headers.length).setValues([objectToRow(existing, headers)]);
        break;
      }
    }
  }
  return res;
}

// ============ Documents ============

function saveDocument(doc) {
  if (!doc) return { ok: false, error: 'No document' };
  doc.id = doc.id || Utilities.getUuid();
  doc.created_at = new Date().toISOString();
  const sheet = getSheet('Documents');
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(doc, headers));
  audit('CREATE', 'Documents', doc.id, { filename: doc.filename, linked_type: doc.linked_type });
  if (doc.linked_type === 'Inspection' && doc.linked_id) {
    recomputeInspectionFlags(doc.linked_id);
  }
  return { ok: true, doc };
}

function listDocuments(linkedType, linkedId) {
  return listRecords('Documents', linkedType && linkedId ? { linked_type: linkedType, linked_id: linkedId } : null);
}

// ============ Photos ============

function savePhoto(photo) {
  if (!photo || !photo.base64_data) return { ok: false, error: 'No photo data' };
  const sheet = getSheet('Photos');
  const headers = getHeaders(sheet);
  photo.id = photo.id || Utilities.getUuid();
  photo.uploaded_at = new Date().toISOString();
  sheet.appendRow(objectToRow(photo, headers));
  audit('CREATE', 'Photos', photo.id, { filename: photo.filename });
  return { ok: true, id: photo.id };
}

function listPhotos(linkedType, linkedId) {
  return listRecords('Photos', linkedType && linkedId ? { linked_type: linkedType, linked_id: linkedId } : null);
}

// ============ Setup ============

function getSetup() {
  const setup = getSheet('SetupData');
  const proj = getSheet('ProjectInfo');
  const setupRows = setup.getLastRow() > 1
    ? setup.getRange(2, 1, setup.getLastRow() - 1, 3).getValues() : [];
  const projRows = proj.getLastRow() > 1
    ? proj.getRange(2, 1, proj.getLastRow() - 1, 2).getValues() : [];
  const lists = {
    Inspectors: [], Engineers: [], Foremen: [], Buildings: [], Areas: [],
    ITPs: [], InspectionTypes: [], EmployerReps: [], Disciplines: [],
    NCRRaisedByRoles: [], CancellationReasons: [], RejectionReasons: [],
    DocumentTypes: [], UploadedByRoles: [],
  };
  const phones = {};
  setupRows.forEach(row => {
    const cat = row[0], val = row[1], phone = row[2];
    if (!cat || !val) return;
    if (lists[cat]) lists[cat].push(val);
    if (phone) phones[val] = phone;
  });
  const project = {};
  projRows.forEach(r => { if (r[0]) project[r[0]] = r[1]; });
  return { ok: true, setup: lists, phones, project };
}

// Restricted read for the public booking link — deliberately excludes
// phone numbers, engineers, employer reps, and project info that getSetup()
// returns for the internal app.
function getBookingFormOptions() {
  const full = getSetup();
  return {
    ok: true,
    foremen: full.setup.Foremen || [],
    areas: full.setup.Areas || [],
    inspectionTypes: full.setup.InspectionTypes || [],
  };
}

const BOOKING_FIELDS = ['date', 'time', 'area', 'item_description', 'inspection_type', 'foreman', 'requested_by'];
const BOOKING_FIELD_MAX_LEN = 300;

// Restricted write for the public booking link. Only ever inserts a new
// Inspections row — the caller-supplied record can never carry an id, so it
// can never overwrite an existing booking, finding, NCR, etc. Every field is
// length-capped and formula-escaped since this is the one action reachable
// with no login at all.
function submitBookingRequest(record) {
  if (!record || typeof record !== 'object') return { ok: false, error: 'No booking data provided' };
  const clean = {};
  BOOKING_FIELDS.forEach(f => {
    const v = record[f];
    clean[f] = typeof v === 'string' ? v.substring(0, BOOKING_FIELD_MAX_LEN) : '';
  });
  if (!clean.date || !clean.inspection_type || !clean.foreman) {
    return { ok: false, error: 'Date, inspection type and foreman are required' };
  }
  clean.status = 'Pending';
  clean.booking_source = 'Shareable Link';
  return saveInspection(clean);
}

function saveSetup(data) {
  if (!data) return { ok: false, error: 'No data' };
  const setupSheet = getSheet('SetupData');
  const projSheet = getSheet('ProjectInfo');
  if (data.setup) {
    if (setupSheet.getLastRow() > 1) setupSheet.getRange(2, 1, setupSheet.getLastRow() - 1, 3).clearContent();
    const phones = data.phones || {};
    Object.keys(data.setup).forEach(cat => {
      (data.setup[cat] || []).forEach(val => {
        if (val) setupSheet.appendRow([cat, val, phones[val] || '']);
      });
    });
  }
  if (data.project) {
    if (projSheet.getLastRow() > 1) projSheet.getRange(2, 1, projSheet.getLastRow() - 1, 2).clearContent();
    Object.keys(data.project).forEach(k => projSheet.appendRow([k, data.project[k] || '']));
  }
  audit('UPDATE', 'Setup', 'all', {});
  return { ok: true };
}

function getAll() {
  return {
    ok: true,
    setup: getSetup(),
    inspections: listRecords('Inspections').records,
    findings: listRecords('Findings').records,
    ncrs: listRecords('NCRs').records,
    cubes: listRecords('Cubes').records,
    itp: listRecords('ITPRegister').records,
  };
}

// ============ Dashboard ============

function getDashboard() {
  const insp = listRecords('Inspections').records;
  const findings = listRecords('Findings').records;
  const ncrs = listRecords('NCRs').records;
  const cubes = listRecords('Cubes').records;
  const total = insp.length;
  const conf = insp.filter(r => r.status === 'Conformant').length;
  const nonc = insp.filter(r => r.status === 'Nonconformant').length;
  const canc = insp.filter(r => r.status === 'Cancelled').length;
  const rej = insp.filter(r => r.status === 'Rejected').length;
  const pending = insp.filter(r => !r.status).length;
  return {
    ok: true,
    totals: { total, conf, nonc, canc, rej, pending },
    findings: {
      total: findings.length,
      open: findings.filter(f => f.status !== 'Closed' && f.status !== 'Verified').length,
      promoted: findings.filter(f => f.promoted_to_ncr === '1').length,
    },
    ncrs: {
      total: ncrs.length,
      open: ncrs.filter(n => n.status === 'Open' || n.status === 'Draft').length,
      in_progress: ncrs.filter(n => n.status === 'In progress').length,
      closed: ncrs.filter(n => n.status === 'Closed' || n.status === 'Verified').length,
    },
    cubes: {
      total: cubes.length,
      awaiting_7: cubes.filter(c => !c.result_7).length,
      awaiting_28: cubes.filter(c => !c.result_28).length,
    },
  };
}

// ============ Audit ============

function audit(action, table, recordId, details) {
  try {
    const sheet = getSheet('Audit');
    sheet.appendRow([
      new Date().toISOString(), action, table, recordId || '', 'portal',
      typeof details === 'object' ? JSON.stringify(details).substring(0, 5000) : String(details)
    ]);
  } catch (e) {}
}

function getAuditLog(limit) {
  const sheet = getSheet('Audit');
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: true, records: [] };
  const start = Math.max(2, lastRow - limit + 1);
  const data = sheet.getRange(start, 1, lastRow - start + 1, 6).getValues();
  return {
    ok: true,
    records: data.map(r => ({
      timestamp: r[0], action: r[1], table: r[2], record_id: r[3], user: r[4], details: r[5]
    })).reverse()
  };
}
