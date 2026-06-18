import React, { useState, useEffect } from 'react';
import { styles, colors } from '../styles';
import { api } from '../api';

const LIST_CONFIG = [
  { key: 'Inspectors', label: 'Inspectors', hasPhone: true },
  { key: 'Buildings', label: 'Buildings' },
  { key: 'Areas', label: 'Areas / Zones' },
  { key: 'Engineers', label: 'Engineers' },
  { key: 'Foremen', label: 'Foremen' },
  { key: 'EmployerReps', label: 'Employer Representatives' },
  { key: 'InspectionTypes', label: 'Inspection Types' },
  { key: 'Disciplines', label: 'Disciplines' },
  { key: 'NCRRaisedByRoles', label: 'NCR — Raised By Roles' },
  { key: 'CancellationReasons', label: 'Cancellation Reasons' },
  { key: 'RejectionReasons', label: 'Rejection Reasons' },
  { key: 'DocumentTypes', label: 'Document Types' },
  { key: 'UploadedByRoles', label: 'Document — Uploaded By Roles' },
];

const PROJECT_FIELDS = [
  { key: 'project_name', label: 'Project Name' },
  { key: 'project_number', label: 'Project Number' },
  { key: 'document_no', label: 'Document No.' },
  { key: 'revision_no', label: 'Revision No.' },
  { key: 'main_contractor', label: 'Main Contractor' },
  { key: 'current_phase', label: 'Current Phase' },
  { key: 'inspector_name', label: 'Your Name' },
  { key: 'inspector_phone', label: 'Your Phone' },
];

export default function SetupTab({ setupData, setSetupData, refresh }) {
  const [setup, setSetup] = useState(setupData.setup || {});
  const [phones, setPhones] = useState(setupData.phones || {});
  const [project, setProject] = useState(setupData.project || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Re-sync when the parent finishes loading data from the server.
  // (Fixes: tab mounts before data arrives and shows "None yet".)
  useEffect(() => {
    if (setupData.setup && Object.keys(setupData.setup).length) {
      const hasAny = Object.values(setupData.setup).some(v => Array.isArray(v) && v.length);
      if (hasAny) setSetup(setupData.setup);
    }
    if (setupData.phones && Object.keys(setupData.phones).length) setPhones(setupData.phones);
    if (setupData.project && Object.keys(setupData.project).length) setProject(setupData.project);
  }, [setupData]);

  const addItem = (key) => setSetup(s => ({ ...s, [key]: [...(s[key] || []), ''] }));
  const updateItem = (key, idx, val) => setSetup(s => ({ ...s, [key]: (s[key] || []).map((v, i) => i === idx ? val : v) }));
  const removeItem = (key, idx) => setSetup(s => ({ ...s, [key]: (s[key] || []).filter((_, i) => i !== idx) }));
  const updatePhone = (name, phone) => setPhones(p => ({ ...p, [name]: phone }));
  const updateProject = (key, val) => setProject(p => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      const clean = {};
      Object.keys(setup).forEach(k => { clean[k] = (setup[k] || []).filter(v => v && v.trim()); });
      await api.saveSetup({ setup: clean, phones, project });
      setSetupData({ setup: clean, phones, project });
      setSaved(true);
      refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { alert('Save failed (queued for retry): ' + e.message); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Project Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {PROJECT_FIELDS.map(f => (
            <div key={f.key}>
              <label style={styles.label}>{f.label}</label>
              <input style={styles.input} value={project[f.key] || ''}
                onChange={e => updateProject(f.key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {LIST_CONFIG.map(cfg => (
        <div key={cfg.key} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={styles.sectionTitle}>{cfg.label}</div>
            <button style={styles.btnSm} onClick={() => addItem(cfg.key)}>+ Add</button>
          </div>
          {(setup[cfg.key] || []).length === 0 && (
            <p style={{ fontSize: 12, color: colors.greyDark }}>None yet — tap + Add.</p>
          )}
          {(setup[cfg.key] || []).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input style={{ ...styles.input, flex: 1 }} value={item}
                onChange={e => updateItem(cfg.key, idx, e.target.value)} />
              {cfg.hasPhone && (
                <input style={{ ...styles.input, width: 140 }} placeholder="Phone"
                  value={phones[item] || ''} onChange={e => updatePhone(item, e.target.value)} />
              )}
              <button style={{ ...styles.btnSm, background: colors.redDark, color: 'white' }}
                onClick={() => removeItem(cfg.key, idx)}>✕</button>
            </div>
          ))}
        </div>
      ))}

      <div style={{ ...styles.card, position: 'sticky', bottom: 0, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button style={styles.btn} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save All Settings'}
        </button>
        {saved && <span style={{ color: colors.greenDark, fontWeight: 600 }}>✓ Saved</span>}
      </div>
    </>
  );
}
