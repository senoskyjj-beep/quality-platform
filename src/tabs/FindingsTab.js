import React from 'react';
import { styles, colors, statBadge } from '../styles';
import { isFindingOpen } from '../statusHelpers';

export default function FindingsTab({ findings, inspections }) {
  return (
    <>
      <div style={styles.card}>
        <div style={styles.banner}>
          ⚠ {findings.length} findings · {findings.filter(f => isFindingOpen(f.status)).length} open · {findings.filter(f => f.promoted_to_ncr === '1').length} promoted to NCR
        </div>
        <p style={{ fontSize: 12, color: colors.greyDark }}>
          Add new findings from the <b>Today's Bookings</b> tab — tap "⚠ Add Finding" on any booking row.
        </p>
      </div>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Findings Register</div>
        <div style={{ overflow: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Booking</th>
                <th style={styles.th}>Building</th>
                <th style={styles.th}>Defect</th>
                <th style={styles.th}>SANS</th>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>NCR?</th>
              </tr>
            </thead>
            <tbody>
              {findings.map(f => {
                const insp = inspections.find(i => i.id === f.linked_inspection_id);
                return (
                  <tr key={f.id}>
                    <td style={styles.td}>{f.date}</td>
                    <td style={styles.td}>{insp ? `I&TN ${insp.itn_no}/${insp.item_no}` : '—'}</td>
                    <td style={styles.td}>{f.building}</td>
                    <td style={styles.td}>{f.defect_type}</td>
                    <td style={styles.td}>{f.sans_clause}</td>
                    <td style={styles.td}>{f.severity}</td>
                    <td style={styles.td}><span style={statBadge(f.status || 'Open')}>{f.status || 'Open'}</span></td>
                    <td style={styles.td}>{f.promoted_to_ncr === '1' ? '→ Yes' : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
