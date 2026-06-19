import React, { useState, useEffect } from 'react';
import { SCRIPT_URL, PROJECT_NAME, PROJECT_NO } from './config';
import { colors } from './styles';

const STRUCTURE_TYPES = [
  { code: 'C',   label: 'Column (C)' },
  { code: 'B',   label: 'Beam (B)' },
  { code: 'F',   label: 'Footing (F)' },
  { code: 'S',   label: 'Slab (S)' },
  { code: 'W',   label: 'Wall (W)' },
  { code: 'PC',  label: 'Pile Cap (PC)' },
  { code: 'CS',  label: 'Column Stump (CS)' },
  { code: 'RW',  label: 'Retaining Wall (RW)' },
  { code: 'OTH', label: 'Other' },
];

const FALLBACK_INSPECTION_TYPES = [
  'Pre-Concrete', 'Pre-Pour', 'Post Punch List', 'Post Inspection',
  'Brickwork', 'Electrical', 'Plumbing', 'Fire', 'HVAC', 'ICT',
  'Drainage', 'Earthworks / Compaction', 'Piling', 'Roads / Layerworks',
];

function todayStr() { return new Date().toISOString().split('T')[0]; }
function nowTimeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function clientId() {
  return 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

async function rawPost(action, params) {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...params }),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Backend error');
  return data;
}

function emptyForm() {
  return {
    date: todayStr(),
    time: nowTimeStr(),
    area: '',
    structure_type: '',
    item_description: '',
    inspection_type: '',
    foreman: '',
    requested_by: '',
  };
}

const c = {
  page: {
    minHeight: '100vh',
    background: '#F3F4F6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: 40,
  },
  header: {
    background: colors.navy,
    color: 'white',
    padding: '16px 20px 18px',
  },
  card: {
    background: 'white',
    borderRadius: 10,
    padding: '20px 16px',
    margin: '0 12px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#4B5563',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    fontSize: 16,
    border: '1.5px solid #D1D5DB',
    borderRadius: 7,
    boxSizing: 'border-box',
    background: 'white',
    WebkitAppearance: 'none',
    appearance: 'none',
    color: '#111',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 14,
  },
  field: { marginBottom: 14 },
  refBadge: {
    marginTop: 7,
    padding: '6px 12px',
    background: colors.lightBlue,
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 700,
    color: colors.navy,
    display: 'inline-block',
  },
  btn: {
    width: '100%',
    padding: '15px',
    fontSize: 17,
    fontWeight: 700,
    background: colors.navy,
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 6,
    letterSpacing: '0.01em',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: 7,
    padding: '12px 14px',
    marginBottom: 14,
    color: '#B91C1C',
    fontSize: 14,
    lineHeight: 1.5,
  },
  requiredStar: { color: colors.redDark, marginLeft: 2 },
};

export default function BookingRequestForm() {
  const [setup, setSetup] = useState({});
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    rawPost('getSetup', {})
      .then(r => setSetup(r.setup || {}))
      .catch(() => {})
      .finally(() => setLoadingSetup(false));
  }, []);

  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const structureRef = (() => {
    const type = form.structure_type || '';
    const num = (form.item_description || '').trim();
    if (!type && !num) return '';
    if (type === 'OTH') return num;
    return type + num;
  })();

  const handleSubmit = async () => {
    if (!form.date || !form.inspection_type || !form.foreman) {
      setError('Please fill in the required fields: Date, Inspection Type, and Foreman.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const record = {
        id: clientId(),
        date: form.date,
        time: form.time,
        area: form.area,
        item_description: structureRef || form.item_description,
        inspection_type: form.inspection_type,
        foreman: form.foreman,
        requested_by: form.requested_by,
        booking_source: 'Shareable Link',
        status: 'Pending',
      };
      await rawPost('saveInspection', { record });
      setLastSubmitted({ ...record, structureRef });
      setSubmitted(true);
    } catch (e) {
      setError('Submission failed: ' + e.message + '. Check your connection and try again, or call Joshua.');
    } finally {
      setSubmitting(false);
    }
  };

  const foremenList = Array.isArray(setup.Foremen) && setup.Foremen.length > 0 ? setup.Foremen : [];
  const areasList = Array.isArray(setup.Areas) && setup.Areas.length > 0 ? setup.Areas : [];
  const inspTypes = Array.isArray(setup.InspectionTypes) && setup.InspectionTypes.length > 0
    ? setup.InspectionTypes : FALLBACK_INSPECTION_TYPES;

  if (submitted && lastSubmitted) {
    return (
      <div style={c.page}>
        <div style={c.header}>
          <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>{PROJECT_NAME} · {PROJECT_NO}</div>
          <div style={{ fontSize: 19, fontWeight: 700 }}>Inspection Booking</div>
        </div>
        <div style={{ ...c.card, textAlign: 'center', padding: '36px 20px', marginTop: 16 }}>
          <div style={{ fontSize: 52 }}>✅</div>
          <h2 style={{ color: colors.greenDark, margin: '12px 0 8px', fontSize: 22 }}>Booking Submitted!</h2>
          <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: 16, margin: '16px 0', textAlign: 'left', fontSize: 15, lineHeight: 1.8 }}>
            <b style={{ color: colors.navy }}>
              {lastSubmitted.structureRef || lastSubmitted.item_description || '—'}
            </b><br />
            📅 {lastSubmitted.date}{lastSubmitted.time ? ' at ' + lastSubmitted.time : ''}<br />
            🔍 {lastSubmitted.inspection_type}<br />
            {lastSubmitted.area ? <>📍 {lastSubmitted.area}<br /></> : null}
            👷 Foreman: {lastSubmitted.foreman}
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>
            Joshua will review and confirm this booking. You can close this page.
          </p>
          <button
            style={{ ...c.btn, background: '#6B7280', marginTop: 0 }}
            onClick={() => { setSubmitted(false); setLastSubmitted(null); setForm(emptyForm()); }}
          >
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={c.page}>
      <div style={c.header}>
        <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>{PROJECT_NAME} · {PROJECT_NO}</div>
        <div style={{ fontSize: 19, fontWeight: 700 }}>Request Inspection Booking</div>
      </div>

      {loadingSetup && (
        <div style={{ ...c.card, color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}>
          Loading…
        </div>
      )}

      <div style={{ ...c.card, marginTop: 12 }}>

        {/* Date & Time */}
        <div style={c.row}>
          <div>
            <label style={c.label}>Date <span style={c.requiredStar}>*</span></label>
            <input type="date" style={c.input} value={form.date} onChange={e => u('date', e.target.value)} />
          </div>
          <div>
            <label style={c.label}>Time</label>
            <input type="time" style={c.input} value={form.time} onChange={e => u('time', e.target.value)} />
          </div>
        </div>

        {/* Area */}
        <div style={c.field}>
          <label style={c.label}>Area / Grid</label>
          {areasList.length > 0
            ? (
              <select style={c.input} value={form.area} onChange={e => u('area', e.target.value)}>
                <option value="">— Select Area —</option>
                {areasList.map(a => <option key={a}>{a}</option>)}
              </select>
            ) : (
              <input style={c.input} placeholder="e.g. Grid B, Zone 3, Axis D-E" value={form.area} onChange={e => u('area', e.target.value)} />
            )}
        </div>

        {/* Structure type + reference */}
        <div style={c.field}>
          <label style={c.label}>Structure Type &amp; Reference No.</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <select style={c.input} value={form.structure_type} onChange={e => u('structure_type', e.target.value)}>
              <option value="">— Type —</option>
              {STRUCTURE_TYPES.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
            <input
              style={c.input}
              placeholder="No. e.g. 4, 12, A2"
              value={form.item_description}
              onChange={e => u('item_description', e.target.value)}
            />
          </div>
          {structureRef && (
            <div style={c.refBadge}>Reference: {structureRef}</div>
          )}
        </div>

        {/* Inspection Type */}
        <div style={c.field}>
          <label style={c.label}>Inspection Type <span style={c.requiredStar}>*</span></label>
          <select style={c.input} value={form.inspection_type} onChange={e => u('inspection_type', e.target.value)}>
            <option value="">— Select —</option>
            {inspTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Foreman */}
        <div style={c.field}>
          <label style={c.label}>Foreman <span style={c.requiredStar}>*</span></label>
          {foremenList.length > 0
            ? (
              <select style={c.input} value={form.foreman} onChange={e => u('foreman', e.target.value)}>
                <option value="">— Select Foreman —</option>
                {foremenList.map(f => <option key={f}>{f}</option>)}
              </select>
            ) : (
              <input style={c.input} placeholder="Foreman's full name" value={form.foreman} onChange={e => u('foreman', e.target.value)} />
            )}
        </div>

        {/* Requested by */}
        <div style={c.field}>
          <label style={c.label}>Your name (who is requesting)</label>
          <input
            style={c.input}
            placeholder="Your name"
            value={form.requested_by}
            onChange={e => u('requested_by', e.target.value)}
          />
        </div>

        {error && <div style={c.errorBox}>{error}</div>}

        <button
          style={{ ...c.btn, opacity: submitting ? 0.65 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '⏳ Submitting…' : '📋 Submit Booking Request'}
        </button>

        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
          Fields marked <span style={{ color: colors.redDark }}>*</span> are required.<br />
          Your booking goes directly to Joshua's QA Portal.
        </p>
      </div>
    </div>
  );
}
