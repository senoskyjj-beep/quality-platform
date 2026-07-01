import React, { useState, useMemo } from 'react';
import { styles, colors, statBadge } from '../styles';
import { api } from '../api';
import { parseITNFiles } from '../itnParser';
import { categoriesForInspectionType, getClausesForCategory, getDefectsForCategory, suggestClauseForDefect } from '../data/sansClauses';
import { generateNCR } from '../ncrGenerator';

function shiftDate(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return d.toISOString().split('T')[0];
}

export default function TodayTab({ inspections, setInspections, findings, setFindings, ncrs, setNcrs, cubes, setCubes, setupData, refresh }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAllDates, setShowAllDates] = useState(false);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingFinding, setEditingFinding] = useState(null);
  const [editingNCR, setEditingNCR] = useState(null);
  const [editingCube, setEditingCube] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [uploadingITN, setUploadingITN] = useState(false);

  const setup = setupData.setup || {};
  const dayBookings = useMemo(() => {
    const list = showAllDates ? inspections.slice() : inspections.filter(i => i.date === selectedDate);
    return list.sort((a, b) => showAllDates
      ? ((b.date || '').localeCompare(a.date || '') || (a.time || '').localeCompare(b.time || ''))
      : (a.time || '').localeCompare(b.time || ''));
  }, [inspections, selectedDate, showAllDates]);

  const handleITNUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingITN(true);
    try {
      const { records, warnings } = await parseITNFiles(files);
      if (records.length === 0) {
        alert('No rows found in files.' + (warnings.length ? '\n' + warnings.join('\n') : ' Check the filename matches the expected I&TN format.'));
        return;
      }
      const r = await api.bulkSaveInspections(records);
      if (r && r.results) {
        const ok = r.results.filter(x => x.ok).length;
        const failed = r.results.filter(x => !x.ok);
        let msg = `Uploaded ${ok} of ${r.results.length} row(s).`;
        if (warnings.length > 0) msg += `\n⚠ ` + warnings.join('\n⚠ ');
        if (failed.length > 0) {
          msg += `\n${failed.length} row(s) failed:\n` + failed.slice(0, 5)
            .map(f => `• ${(f.record && (f.record.item_description || f.record.building)) || '(row)'}: ${f.error}`)
            .join('\n');
          if (failed.length > 5) msg += `\n…and ${failed.length - 5} more.`;
        }
        alert(msg);
        refresh();
      }
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploadingITN(false); }
  };

  return (
    <>
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={styles.label}>Date</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={styles.btnSec} disabled={showAllDates}
                onClick={() => setSelectedDate(d => shiftDate(d, -1))}>‹</button>
              <input type="date" style={{ ...styles.input, width: 160 }} value={selectedDate} disabled={showAllDates}
                onChange={e => setSelectedDate(e.target.value)} />
              <button style={styles.btnSec} disabled={showAllDates}
                onClick={() => setSelectedDate(d => shiftDate(d, 1))}>›</button>
              <button style={styles.btnSec} disabled={showAllDates}
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>Today</button>
            </div>
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button style={styles.btn} onClick={() => setShowNewBooking(true)}>+ New Booking</button>
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <label style={styles.btnSec}>
              📁 Upload I&TN xlsx
              <input type="file" multiple accept=".xlsx" onChange={handleITNUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <label style={{ alignSelf: 'flex-end', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="checkbox" checked={showAllDates} onChange={e => setShowAllDates(e.target.checked)} />
            Show all bookings (any date)
          </label>
          <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 13, color: colors.greyDark }}>
            {dayBookings.length} booking(s)
          </div>
        </div>
        {uploadingITN && <div style={{ marginTop: 8, color: colors.greyDark }}>Uploading…</div>}
      </div>

      {dayBookings.length === 0 && (
        <div style={styles.card}>
          <p style={{ color: colors.greyDark, textAlign: 'center' }}>
            {showAllDates ? 'No bookings found at all yet.' : `No bookings for ${selectedDate}.`} Tap <b>+ New Booking</b> to add one from the engineer's WhatsApp, or <b>Upload I&TN xlsx</b>.
            {!showAllDates && <> Can't find a booking? Tick <b>Show all bookings</b> above.</>}
          </p>
        </div>
      )}

      {dayBookings.map(b => (
        <BookingCard key={b.id} booking={b}
          showDate={showAllDates}
          findings={findings.filter(f => f.linked_inspection_id === b.id)}
          ncrs={ncrs.filter(n => n.linked_inspection_id === b.id)}
          cubes={cubes.filter(c => c.linked_inspection_id === b.id)}
          setup={setup}
          onSetStatus={async (status, reason) => {
            await api.updateInspectionStatus(b.id, status, reason, b.short_note);
            refresh();
          }}
          onAddFinding={() => setEditingFinding({ linked_inspection_id: b.id,
            date: b.date, building: b.building, area: b.area, element_ref: b.item_description,
            inspector: b.inspector, engineer: b.engineer, foreman: b.foreman,
            severity: 'Minor', status: 'Open' })}
          onAddNCR={() => setEditingNCR({ linked_inspection_id: b.id,
            date_raised: new Date().toISOString().split('T')[0],
            building: b.building, area: b.area, element_ref: b.item_description,
            foreman_issued: b.foreman, engineer_notified: b.engineer,
            raised_by_role: 'Quality Inspector (Joshua)', raised_by_name: 'Joshua Senosky',
            severity: 'Minor', status: 'Draft' })}
          onAddDoc={() => setEditingDoc({ linked_type: 'Inspection', linked_id: b.id,
            doc_type: 'Cube test certificate', uploaded_by_role: 'Quality Inspector (Joshua)' })}
          onAddCube={() => {
            const existingCubes = cubes.filter(c => c.linked_inspection_id === b.id);
            if (existingCubes.length > 0) setEditingCube(existingCubes[0]);
            else setEditingCube({ linked_inspection_id: b.id, cast_date: b.date, building: b.building,
              area: b.area, element_location: b.item_description, notes: 'Manually added from booking' });
          }}
          onEditFinding={(f) => setEditingFinding(f)}
          onEditNCR={(n) => setEditingNCR(n)}
          onEditCube={(c) => setEditingCube(c)}
          onEditBooking={() => setEditingBooking(b)}
        />
      ))}

      {showNewBooking && (
        <BookingForm
          record={{ date: selectedDate, time: '', booking_source: 'Engineer WhatsApp' }}
          setup={setup}
          onClose={() => setShowNewBooking(false)}
          onSave={async (rec) => {
            await api.saveInspection(rec);
            setShowNewBooking(false);
            refresh();
          }}
        />
      )}

      {editingBooking && (
        <BookingForm record={editingBooking} setup={setup}
          onClose={() => setEditingBooking(null)}
          onSave={async (rec) => {
            await api.saveInspection(rec);
            setEditingBooking(null); refresh();
          }} />
      )}

      {editingFinding && (
        <FindingForm record={editingFinding} setup={setup} ncrs={ncrs}
          onClose={() => setEditingFinding(null)}
          onSave={async (rec) => {
            await api.saveFinding(rec);
            setEditingFinding(null); refresh();
          }}
          onPromote={async (findingId, role, name) => {
            await api.promoteToNCR(findingId, role, name);
            setEditingFinding(null); refresh();
          }}
        />
      )}

      {editingNCR && (
        <NCRForm record={editingNCR} setup={setup}
          onClose={() => setEditingNCR(null)}
          onSave={async (rec, generateWord, photos) => {
            const r = await api.saveNCR(rec);
            if (generateWord && r.ok) await generateNCR(r.record, photos || []);
            setEditingNCR(null); refresh();
          }} />
      )}

      {editingCube && (
        <CubeForm record={editingCube} setup={setup}
          onClose={() => setEditingCube(null)}
          onSave={async (rec) => {
            await api.saveCube(rec);
            setEditingCube(null); refresh();
          }} />
      )}

      {editingDoc && (
        <DocForm record={editingDoc} setup={setup}
          onClose={() => setEditingDoc(null)}
          onSave={async (doc) => {
            await api.saveDocument(doc);
            setEditingDoc(null); refresh();
          }} />
      )}
    </>
  );
}

// ================= BookingCard =================
function BookingCard({ booking, showDate, findings, ncrs, cubes, setup, onSetStatus, onAddFinding, onAddNCR, onAddDoc, onAddCube, onEditFinding, onEditNCR, onEditCube, onEditBooking }) {
  const [statusToConfirm, setStatusToConfirm] = useState(null);
  const [reason, setReason] = useState('');

  const bg = booking.status === 'Cancelled' || booking.status === 'Nonconformant' ? '#FFF6F0' :
             booking.status === 'Conformant' && findings.length > 0 ? '#FFFCEB' :
             !booking.status ? '#F8F0FF' : 'white';

  const handleStatusChange = (next) => {
    if (!next || next === 'Conformant') onSetStatus(next, '');
    else setStatusToConfirm(next);
  };

  return (
    <div style={{ ...styles.card, background: bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: colors.greyDark }}>
            {showDate && <>{booking.date} · </>}{booking.time || '--:--'} · I&TN {booking.itn_no || '—'} / Item {booking.item_no || '—'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
            {booking.building} {booking.area ? '· ' + booking.area : ''}
          </div>
          <div style={{ fontSize: 13, marginTop: 2 }}>{booking.item_description}</div>
          <div style={{ fontSize: 12, color: colors.greyDark, marginTop: 2 }}>
            {booking.inspection_type} · {booking.inspector}
            {booking.engineer ? ' · Eng: ' + booking.engineer : ''}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          {booking.status
            ? <span style={statBadge(booking.status)}>{booking.status}</span>
            : <span style={statBadge('Pending')}>Pending</span>}
          {booking.status_reason && (
            <div style={{ fontSize: 11, color: colors.greyDark, textAlign: 'right', maxWidth: 200 }}>
              {booking.status_reason}
            </div>
          )}
        </div>
      </div>

      {booking.short_note && (
        <div style={{ fontSize: 12, color: '#555', marginTop: 8, padding: 6, background: 'rgba(0,0,0,0.04)', borderRadius: 4 }}>
          {booking.short_note}
        </div>
      )}

      {/* Status — always-visible dropdown */}
      <div style={{ marginTop: 12, maxWidth: 240 }}>
        <label style={styles.label}>Status</label>
        <select style={styles.input} value={booking.status || ''} onChange={e => handleStatusChange(e.target.value)}>
          <option value="">Pending</option>
          <option value="Conformant">✓ Conformant</option>
          <option value="Nonconformant">✗ Nonconformant</option>
          <option value="Cancelled">● Cancelled</option>
          <option value="Rejected">⊘ Rejected</option>
        </select>
      </div>

      {statusToConfirm && (
        <div style={{ marginTop: 10, padding: 10, background: 'white', border: '1px solid #ccc', borderRadius: 6 }}>
          <label style={styles.label}>{statusToConfirm} — reason / note</label>
          <select style={styles.input} value={reason} onChange={e => setReason(e.target.value)}>
            <option value="">— Select reason —</option>
            {statusToConfirm === 'Cancelled' && (setup.CancellationReasons || []).map(r => <option key={r}>{r}</option>)}
            {statusToConfirm === 'Rejected' && (setup.RejectionReasons || []).map(r => <option key={r}>{r}</option>)}
            {statusToConfirm === 'Nonconformant' && ['Finding raised — see linked record', 'NCR raised — see linked record', 'Awaiting close-out', 'Other'].map(r => <option key={r}>{r}</option>)}
          </select>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <button style={styles.btnSm} onClick={() => { onSetStatus(statusToConfirm, reason); setStatusToConfirm(null); setReason(''); }}>Confirm</button>
            <button style={{ ...styles.btnSm, background: 'white', color: '#666', border: '1px solid #ccc' }}
              onClick={() => { setStatusToConfirm(null); setReason(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Action buttons row */}
      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button style={{ ...styles.btnSm, background: colors.yellow, color: '#806010', border: '1px solid #E8C547' }}
          onClick={onAddFinding}>⚠ Add Finding</button>
        <button style={{ ...styles.btnSm, background: colors.red, color: colors.redDark, border: `1px solid ${colors.redDark}` }}
          onClick={onAddNCR}>📋 Raise NCR</button>
        <button style={{ ...styles.btnSm, background: colors.lightBlue, color: colors.navy, border: `1px solid ${colors.navy}` }}
          onClick={onAddCube}>🧪 {cubes.length > 0 ? 'Edit Cube' : 'Add Cube'}</button>
        <button style={{ ...styles.btnSm, background: colors.green, color: colors.greenDark, border: `1px solid ${colors.greenDark}` }}
          onClick={onAddDoc}>📎 Upload Doc</button>
        <button style={{ ...styles.btnSm, background: 'white', color: '#666', border: '1px solid #ccc' }}
          onClick={onEditBooking}>✎ Edit Booking</button>
      </div>

      {/* Linked records */}
      {(findings.length > 0 || ncrs.length > 0 || cubes.length > 0) && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.lightBlue}` }}>
          {findings.map(f => (
            <div key={f.id} onClick={() => onEditFinding(f)}
              style={{ background: colors.yellow, padding: 8, borderRadius: 4, marginBottom: 4, fontSize: 12, cursor: 'pointer' }}>
              <b>⚠ Finding {f.finding_no || ''}</b> — {f.defect_type || ''} · {f.sans_clause || ''}
              {f.promoted_to_ncr === '1' && <span style={{ marginLeft: 6, color: colors.redDark }}>→ NCR raised</span>}
            </div>
          ))}
          {ncrs.map(n => (
            <div key={n.id} onClick={() => onEditNCR(n)}
              style={{ background: colors.red, padding: 8, borderRadius: 4, marginBottom: 4, fontSize: 12, cursor: 'pointer' }}>
              <b>📋 NCR {n.ncr_no || '(draft)'}</b> — raised by {n.raised_by_role} · {n.status}
            </div>
          ))}
          {cubes.map(c => (
            <div key={c.id} onClick={() => onEditCube(c)}
              style={{ background: colors.lightBlue, padding: 8, borderRadius: 4, marginBottom: 4, fontSize: 12, cursor: 'pointer' }}>
              <b>🧪 Cube {c.cube_id || '(auto)'}</b> · 7-day: {c.result_7 || '—'} · 28-day: {c.result_28 || '—'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= BookingForm =================
function BookingForm({ record, setup, onClose, onSave }) {
  const [r, setR] = useState(record);
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setR({ ...r, [k]: v });
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try { await onSave(r); } finally { setSaving(false); }
  };
  return (
    <Modal title={record.id ? 'Edit Booking' : 'New Booking (from WhatsApp)'} onClose={onClose}>
      <Grid2>
        <F label="Date" type="date" value={r.date} onChange={v => u('date', v)} />
        <F label="Time" value={r.time || ''} onChange={v => u('time', v)} />
        <F label="I&TN No" value={r.itn_no || ''} onChange={v => u('itn_no', v)} />
        <F label="Item No" value={r.item_no || ''} onChange={v => u('item_no', v)} />
        <F label="ITP No" value={r.itp_no || ''} onChange={v => u('itp_no', v)} />
        <S label="Discipline" value={r.discipline || ''} options={setup.Disciplines} onChange={v => u('discipline', v)} />
        <S label="Building" value={r.building || ''} options={setup.Buildings} onChange={v => u('building', v)} />
        <S label="Area" value={r.area || ''} options={setup.Areas} onChange={v => u('area', v)} />
      </Grid2>
      <F label="Element / Description" value={r.item_description || ''} onChange={v => u('item_description', v)} fullWidth />
      <Grid2>
        <S label="Inspection Type" value={r.inspection_type || ''} options={setup.InspectionTypes} onChange={v => u('inspection_type', v)} />
        <S label="Inspector" value={r.inspector || ''} options={setup.Inspectors} onChange={v => u('inspector', v)} />
        <S label="Engineer" value={r.engineer || ''} options={setup.Engineers} onChange={v => u('engineer', v)} />
        <S label="Foreman" value={r.foreman || ''} options={setup.Foremen} onChange={v => u('foreman', v)} />
        <S label="Employer Rep" value={r.employer_rep || ''} options={setup.EmployerReps} onChange={v => u('employer_rep', v)} />
        <F label="Requested by" value={r.requested_by || ''} onChange={v => u('requested_by', v)} />
      </Grid2>
      <Buttons onClose={onClose} onSave={handleSave} saving={saving} />
    </Modal>
  );
}

// ================= FindingForm =================
function FindingForm({ record, setup, ncrs, onClose, onSave, onPromote }) {
  const [r, setR] = useState(record);
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const u = (k, v) => setR({ ...r, [k]: v });
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try { await onSave(r); } finally { setSaving(false); }
  };
  const handlePromote = async () => {
    if (promoting) return;
    setPromoting(true);
    try { await onPromote(r.id, 'Quality Inspector (Joshua)', 'Joshua Senosky'); } finally { setPromoting(false); }
  };
  const cats = categoriesForInspectionType(r.inspection_type);
  const defects = getDefectsForCategory(cats);
  const clauses = getClausesForCategory(cats);
  const pickDefect = (name) => setR(curr => ({ ...curr, defect_type: name, sans_clause: suggestClauseForDefect(name) }));

  return (
    <Modal title={record.id ? 'Edit Finding' : '⚠ Add Finding'} onClose={onClose} wide>
      <div style={styles.prefilledBanner}>
        <b style={{ color: colors.navy }}>Pre-filled from booking:</b><br />
        {r.date} · {r.building} · {r.area} · {r.element_ref}<br />
        Inspector: {r.inspector} · Engineer: {r.engineer} · Foreman: {r.foreman}
      </div>

      <div style={styles.label}>Quick-pick Defect (auto-fills SANS clause)</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {defects.slice(0, 15).map(d => (
          <button key={d.name}
            onClick={() => pickDefect(d.name)}
            style={{
              padding: '4px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer',
              background: r.defect_type === d.name ? colors.navy : 'white',
              color: r.defect_type === d.name ? 'white' : colors.navy,
              border: `1px solid ${r.defect_type === d.name ? colors.navy : '#ccc'}`,
            }}>{d.name}</button>
        ))}
      </div>

      <Grid2>
        <F label="Defect Type" value={r.defect_type || ''} onChange={v => u('defect_type', v)} />
        <S label="Severity" value={r.severity || 'Minor'} options={['Minor', 'Major', 'Critical']} onChange={v => u('severity', v)} />
      </Grid2>
      <div>
        <label style={styles.label}>SANS Clause</label>
        <select style={styles.input} value={r.sans_clause || ''} onChange={e => u('sans_clause', e.target.value)}>
          <option value="">— Select —</option>
          {clauses.map(c => <option key={c.ref} value={c.ref}>{c.ref} — {c.topic}</option>)}
        </select>
      </div>
      <F label="Description of Finding" value={r.description || ''} onChange={v => u('description', v)} textarea fullWidth />
      <F label="Action Required" value={r.action_required || ''} onChange={v => u('action_required', v)} textarea fullWidth />
      <Grid2>
        <S label="Responsible Party" value={r.responsible_party || ''} options={[...(setup.Foremen||[]), ...(setup.Engineers||[]), ...(setup.Inspectors||[])]} onChange={v => u('responsible_party', v)} />
        <F label="Target Date" type="date" value={r.target_date || ''} onChange={v => u('target_date', v)} />
        <S label="Status" value={r.status || 'Open'} options={['Open', 'In progress', 'Closed', 'Verified']} onChange={v => u('status', v)} />
        <S label="Closed Out?" value={r.closed_out || 'No'} options={['Yes', 'No', 'N/A']} onChange={v => u('closed_out', v)} />
      </Grid2>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button style={styles.btnSec} onClick={onClose}>Cancel</button>
        <button style={styles.btnSec} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : '💾 Save Finding'}</button>
        {r.id && r.promoted_to_ncr !== '1' && (
          <button style={styles.btn} onClick={handlePromote} disabled={promoting}>
            {promoting ? 'Promoting…' : '↗ Promote to NCR'}
          </button>
        )}
      </div>
    </Modal>
  );
}

// ================= NCRForm =================
function NCRForm({ record, setup, onClose, onSave }) {
  const [r, setR] = useState(record);
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setR({ ...r, [k]: v });
  const handleSave = async (generateWord) => {
    if (saving) return;
    setSaving(true);
    try { await onSave(r, generateWord, photos); } finally { setSaving(false); }
  };
  const cats = categoriesForInspectionType(r.inspection_type);
  const clauses = getClausesForCategory(cats);

  const handlePhoto = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - photos.length);
    for (const file of files) {
      await new Promise(res => {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotos(prev => [...prev, { filename: file.name, base64_data: reader.result, caption: '' }].slice(0, 4));
          res();
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Modal title={record.id ? 'Edit NCR' : '📋 Raise NCR'} onClose={onClose} wide>
      <div style={styles.prefilledBanner}>
        <b style={{ color: colors.navy }}>Pre-filled from booking:</b><br />
        {r.building} · {r.area} · {r.element_ref}
      </div>

      <Grid2>
        <F label="NCR No." value={r.ncr_no || ''} onChange={v => u('ncr_no', v)} />
        <F label="Date Raised" type="date" value={r.date_raised || ''} onChange={v => u('date_raised', v)} />
        <S label="Raised by — Role" value={r.raised_by_role || ''} options={setup.NCRRaisedByRoles} onChange={v => u('raised_by_role', v)} />
        <F label="Raised by — Name" value={r.raised_by_name || ''} onChange={v => u('raised_by_name', v)} />
        <S label="Severity" value={r.severity || 'Minor'} options={['Minor', 'Major', 'Critical']} onChange={v => u('severity', v)} />
        <S label="Status" value={r.status || 'Open'} options={['Draft', 'Open', 'In progress', 'Closed', 'Verified']} onChange={v => u('status', v)} />
      </Grid2>
      <div>
        <label style={styles.label}>SANS Clause</label>
        <select style={styles.input} value={r.sans_clause || ''} onChange={e => u('sans_clause', e.target.value)}>
          <option value="">— Select —</option>
          {clauses.map(c => <option key={c.ref} value={c.ref}>{c.ref} — {c.topic}</option>)}
        </select>
      </div>
      <F label="Description of Non-Conformance" value={r.description || ''} onChange={v => u('description', v)} textarea fullWidth />
      <F label="Corrective Action Required" value={r.action_required || ''} onChange={v => u('action_required', v)} textarea fullWidth />
      <Grid2>
        <S label="Foreman Issued" value={r.foreman_issued || ''} options={setup.Foremen} onChange={v => u('foreman_issued', v)} />
        <S label="Engineer Notified" value={r.engineer_notified || ''} options={setup.Engineers} onChange={v => u('engineer_notified', v)} />
        <F label="Target Close-out" type="date" value={r.target_closeout || ''} onChange={v => u('target_closeout', v)} />
        <F label="Actual Close-out" type="date" value={r.actual_closeout || ''} onChange={v => u('actual_closeout', v)} />
      </Grid2>

      <div style={{ marginTop: 16 }}>
        <label style={styles.label}>Photos ({photos.length}/4)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ border: `1px solid ${colors.lightBlue}`, borderRadius: 4, padding: 4 }}>
              <img src={p.base64_data} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
              <input style={{ ...styles.input, fontSize: 11, padding: 4, marginTop: 4 }} placeholder="Caption"
                value={p.caption} onChange={e => setPhotos(prev => prev.map((x, j) => j === i ? { ...x, caption: e.target.value } : x))} />
              <button style={{ ...styles.btnSm, background: colors.redDark, color: 'white', width: '100%', marginTop: 4 }}
                onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
          {photos.length < 4 && (
            <label style={{ border: `2px dashed #888`, borderRadius: 4, padding: 12, textAlign: 'center', cursor: 'pointer', minHeight: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
              📷 Add photo
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} multiple />
            </label>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button style={styles.btnSec} onClick={onClose}>Cancel</button>
        <button style={styles.btnSec} onClick={() => handleSave(false)} disabled={saving}>💾 Save Only</button>
        <button style={styles.btn} onClick={() => handleSave(true)} disabled={saving}>{saving ? 'Saving…' : '💾 Save & Generate Word NCR'}</button>
      </div>
    </Modal>
  );
}

// ================= CubeForm =================
function CubeForm({ record, setup, onClose, onSave }) {
  const [r, setR] = useState(record);
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setR({ ...r, [k]: v });
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try { await onSave(r); } finally { setSaving(false); }
  };
  return (
    <Modal title={record.id ? 'Edit Cube' : '🧪 Cube Record'} onClose={onClose}>
      <div style={styles.prefilledBanner}>
        <b style={{ color: colors.navy }}>Pre-filled from pour booking:</b><br />
        Cast: {r.cast_date} · {r.building} · {r.area} · {r.element_location}
      </div>
      <Grid2>
        <F label="Cube ID" value={r.cube_id || ''} onChange={v => u('cube_id', v)} />
        <F label="Batch No" value={r.batch_no || ''} onChange={v => u('batch_no', v)} />
        <F label="Supplier" value={r.supplier || ''} onChange={v => u('supplier', v)} />
        <F label="Spec MPa" value={r.spec_mpa || ''} onChange={v => u('spec_mpa', v)} />
        <F label="Slump (mm)" value={r.slump_actual || ''} onChange={v => u('slump_actual', v)} />
        <F label="Ambient °C" value={r.ambient_temp || ''} onChange={v => u('ambient_temp', v)} />
      </Grid2>
      <div style={{ marginTop: 12 }}><b>7-Day Test</b></div>
      <Grid2>
        <F label="Test Date" type="date" value={r.test_date_7 || ''} onChange={v => u('test_date_7', v)} />
        <F label="Result MPa" value={r.result_7 || ''} onChange={v => u('result_7', v)} />
      </Grid2>
      <div style={{ marginTop: 12 }}><b>28-Day Test</b></div>
      <Grid2>
        <F label="Test Date" type="date" value={r.test_date_28 || ''} onChange={v => u('test_date_28', v)} />
        <F label="Result MPa" value={r.result_28 || ''} onChange={v => u('result_28', v)} />
        <S label="Pass?" value={r.pass_28 || ''} options={['Pass', 'Fail']} onChange={v => u('pass_28', v)} />
        <F label="Lab / Cert Ref" value={r.cert_ref || ''} onChange={v => u('cert_ref', v)} />
      </Grid2>
      <F label="Notes" value={r.notes || ''} onChange={v => u('notes', v)} textarea fullWidth />
      <Buttons onClose={onClose} onSave={handleSave} saving={saving} />
    </Modal>
  );
}

// ================= DocForm =================
function DocForm({ record, setup, onClose, onSave }) {
  const [r, setR] = useState(record);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setR({ ...r, [k]: v });
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try { await onSave(r); } finally { setSaving(false); }
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      u('filename', f.name);
      u('base64_data', reader.result);
      setFile(f);
    };
    reader.readAsDataURL(f);
  };

  return (
    <Modal title="📎 Upload Document" onClose={onClose}>
      <Grid2>
        <S label="Document Type" value={r.doc_type || ''} options={setup.DocumentTypes} onChange={v => u('doc_type', v)} />
        <S label="Uploaded by — Role" value={r.uploaded_by_role || ''} options={setup.UploadedByRoles} onChange={v => u('uploaded_by_role', v)} />
        <F label="Uploader Name" value={r.uploaded_by_name || ''} onChange={v => u('uploaded_by_name', v)} />
      </Grid2>
      <F label="Caption / Description" value={r.caption || ''} onChange={v => u('caption', v)} fullWidth />
      <div style={{ marginTop: 12 }}>
        <label style={styles.label}>File (photo, scan, PDF)</label>
        <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
        {file && <div style={{ marginTop: 6, fontSize: 12, color: colors.greenDark }}>✓ {file.name}</div>}
      </div>
      <Buttons onClose={onClose} onSave={handleSave} saveDisabled={!r.base64_data} saving={saving} />
    </Modal>
  );
}

// ================= Helpers =================
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 20, maxWidth: wide ? 800 : 700, width: '100%', marginTop: 40 }}>
        <h3 style={{ marginTop: 0, color: colors.navy }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
function Grid2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{children}</div>;
}
function F({ label, value, onChange, type = 'text', textarea, fullWidth }) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1', marginTop: 8 } : { marginTop: 4 }}>
      <label style={styles.label}>{label}</label>
      {textarea
        ? <textarea style={{ ...styles.input, minHeight: 70 }} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input style={styles.input} type={type} value={value || ''} onChange={e => onChange(e.target.value)} />}
    </div>
  );
}
function S({ label, value, options, onChange }) {
  return (
    <div style={{ marginTop: 4 }}>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} value={value || ''} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {(options || []).map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Buttons({ onClose, onSave, saveDisabled, saving }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <button style={styles.btnSec} onClick={onClose}>Cancel</button>
      <button style={styles.btn} onClick={onSave} disabled={saveDisabled || saving}>{saving ? 'Saving…' : '💾 Save'}</button>
    </div>
  );
}
