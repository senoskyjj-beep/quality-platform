import React, { useState, useEffect, useCallback } from 'react';
import { styles, colors } from '../styles';
import { api } from '../api';

export default function DocumentsTab({ inspections, setupData, refresh }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const setup = setupData.setup || {};

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.listDocuments();
      setDocuments(r.records || []);
    } catch (e) { /* offline */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  return (
    <>
      <div style={styles.card}>
        <div style={styles.banner}>
          📎 {documents.length} document(s) on file — cube certs, sign-offs, delivery notes, photos
        </div>
        <p style={{ fontSize: 12, color: colors.greyDark }}>
          Documents can be uploaded against a specific booking from the <b>Today's Bookings</b> tab, or as a general
          project document here. Each is tagged with the uploader's role for the audit trail.
        </p>
        <button style={styles.btn} onClick={() => setShowUpload(true)}>📎 Upload General Document</button>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Document Register</div>
        {loading && <p style={{ color: colors.greyDark }}>Loading…</p>}
        {!loading && documents.length === 0 && (
          <p style={{ color: colors.greyDark, textAlign: 'center' }}>No documents uploaded yet.</p>
        )}
        {documents.length > 0 && (
          <div style={{ overflow: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Filename</th>
                  <th style={styles.th}>Caption</th>
                  <th style={styles.th}>Linked To</th>
                  <th style={styles.th}>Uploaded By</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>View</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(d => {
                  const insp = d.linked_type === 'Inspection'
                    ? inspections.find(i => i.id === d.linked_id) : null;
                  return (
                    <tr key={d.id}>
                      <td style={styles.td}>{d.doc_type}</td>
                      <td style={styles.td}>{d.filename}</td>
                      <td style={styles.td}>{d.caption}</td>
                      <td style={styles.td}>
                        {insp ? `I&TN ${insp.itn_no}/${insp.item_no}` : (d.linked_type || 'General')}
                      </td>
                      <td style={styles.td}>{d.uploaded_by_role}<br /><small style={{ color: colors.greyDark }}>{d.uploaded_by_name}</small></td>
                      <td style={styles.td}>{(d.created_at || '').split('T')[0]}</td>
                      <td style={styles.td}>
                        {d.base64_data && (
                          <a href={d.base64_data} download={d.filename} style={{ color: colors.navy, fontWeight: 600 }}>open</a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUpload && (
        <DocUploadModal setup={setup} onClose={() => setShowUpload(false)}
          onSave={async (doc) => {
            await api.saveDocument(doc);
            setShowUpload(false);
            loadDocs();
            refresh();
          }} />
      )}
    </>
  );
}

function DocUploadModal({ setup, onClose, onSave }) {
  const [r, setR] = useState({ linked_type: 'General', doc_type: 'Cube test certificate', uploaded_by_role: 'Quality Inspector (Joshua)' });
  const [file, setFile] = useState(null);
  const u = (k, v) => setR({ ...r, [k]: v });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { u('filename', f.name); u('base64_data', reader.result); setFile(f); };
    reader.readAsDataURL(f);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 20, maxWidth: 600, width: '100%', marginTop: 40 }}>
        <h3 style={{ marginTop: 0, color: colors.navy }}>📎 Upload General Document</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label style={styles.label}>Document Type</label>
            <select style={styles.input} value={r.doc_type} onChange={e => u('doc_type', e.target.value)}>
              {(setup.DocumentTypes || []).map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Uploaded by — Role</label>
            <select style={styles.input} value={r.uploaded_by_role} onChange={e => u('uploaded_by_role', e.target.value)}>
              {(setup.UploadedByRoles || []).map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={styles.label}>Uploader Name</label>
          <input style={styles.input} value={r.uploaded_by_name || ''} onChange={e => u('uploaded_by_name', e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={styles.label}>Caption / Description</label>
          <input style={styles.input} value={r.caption || ''} onChange={e => u('caption', e.target.value)} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={styles.label}>File (photo, scan, PDF)</label>
          <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
          {file && <div style={{ marginTop: 6, fontSize: 12, color: colors.greenDark }}>✓ {file.name}</div>}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button style={styles.btnSec} onClick={onClose}>Cancel</button>
          <button style={styles.btn} onClick={() => onSave(r)} disabled={!r.base64_data}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}
