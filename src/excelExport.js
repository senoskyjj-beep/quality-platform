import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToExcel({ project, inspections, findings, ncrs, cubes }) {
  const wb = XLSX.utils.book_new();

  // Master Inspection Register
  const mastHeaders = [
    'Date', 'I&TN No', 'Item No', 'Building', 'Area', 'Element',
    'Inspection Type', 'Time', 'Inspector', 'Employer Rep', 'Engineer',
    'Status', 'Status Reason', 'Short Note',
    'Has Finding?', 'Has NCR?', 'Has Cube?', 'Has Doc?'
  ];
  const mastRows = (inspections || []).map(r => [
    r.date, r.itn_no, r.item_no, r.building, r.area, r.item_description,
    r.inspection_type, r.time, r.inspector, r.employer_rep, r.engineer,
    r.status, r.status_reason, r.short_note,
    r.has_finding ? 'Yes' : '', r.has_ncr ? 'Yes' : '',
    r.has_cube ? 'Yes' : '', r.has_doc ? 'Yes' : '',
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([mastHeaders, ...mastRows]), 'Inspection Register');

  // Findings
  if (findings && findings.length) {
    const fH = ['Finding No', 'Date', 'Linked Inspection', 'Building', 'Area', 'Element', 'Defect Type', 'Severity', 'SANS Clause', 'Description', 'Action Required', 'Responsible', 'Target Date', 'Status', 'Promoted to NCR?'];
    const fR = findings.map(r => [r.finding_no, r.date, r.linked_inspection_id, r.building, r.area, r.element_ref, r.defect_type, r.severity, r.sans_clause, r.description, r.action_required, r.responsible_party, r.target_date, r.status, r.promoted_to_ncr ? 'Yes' : '']);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([fH, ...fR]), 'Findings');
  }

  // NCRs
  if (ncrs && ncrs.length) {
    const nH = ['NCR No', 'Date Raised', 'Raised by Role', 'Raised by Name', 'Linked Inspection', 'Building', 'Area', 'Element', 'Severity', 'SANS Clause', 'Description', 'Action Required', 'Target Closeout', 'Status'];
    const nR = ncrs.map(r => [r.ncr_no, r.date_raised, r.raised_by_role, r.raised_by_name, r.linked_inspection_id, r.building, r.area, r.element_ref, r.severity, r.sans_clause, r.description, r.action_required, r.target_closeout, r.status]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([nH, ...nR]), 'NCRs');
  }

  // Cubes
  if (cubes && cubes.length) {
    const cH = ['Cube ID', 'Cast Date', 'Building', 'Element', 'Batch No', 'Supplier', 'Spec MPa', 'Slump', '7-day Date', '7-day MPa', '28-day Date', '28-day MPa', 'Pass?', 'Cert Ref'];
    const cR = cubes.map(r => [r.cube_id, r.cast_date, r.building, r.element_location, r.batch_no, r.supplier, r.spec_mpa, r.slump_actual, r.test_date_7, r.result_7, r.test_date_28, r.result_28, r.pass_28, r.cert_ref]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([cH, ...cR]), 'Cubes');
  }

  // Project Info
  if (project) {
    const pR = Object.entries(project).map(([k, v]) => [k, v]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Field', 'Value'], ...pR]), 'Project Info');
  }

  const today = new Date().toISOString().split('T')[0];
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }),
    `QA_Master_Register_EC0148_${today}.xlsx`);
}
