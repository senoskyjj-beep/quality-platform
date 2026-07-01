import React from 'react';
import { styles, colors, statBadge } from '../styles';
import { isNcrOpen } from '../statusHelpers';

export default function NCRTab({ ncrs, inspections }) {
  const openCount = ncrs.filter(n => isNcrOpen(n.status)).length;
  return (
    <>
      <div style={styles.card}>
        <div style={styles.banner}>
          📋 {ncrs.length} NCRs · {openCount} open · raised by various: Joshua / Engineer / Foreman / Client / QA Mgr
        </div>
        <p style={{ fontSize: 12, color: colors.greyDark }}>
          Raise new NCRs from the <b>Today's Bookings</b> tab.
        </p>
      </div>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>NCR Register</div>
        <div style={{ overflow: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NCR No</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Raised By</th>
                <th style={styles.th}>Booking</th>
                <th style={styles.th}>Building</th>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Days</th>
              </tr>
            </thead>
            <tbody>
              {ncrs.map(n => {
                const insp = inspections.find(i => i.id === n.linked_inspection_id);
                let days = '';
                if (n.date_raised) {
                  const raised = new Date(n.date_raised);
                  const closed = n.actual_closeout ? new Date(n.actual_closeout) : new Date();
                  const diff = Math.round((closed - raised) / 86400000);
                  days = isNaN(diff) ? '—' : diff;
                }
                const negative = typeof days === 'number' && days < 0;
                return (
                  <tr key={n.id}>
                    <td style={styles.td}><b>{n.ncr_no || '—'}</b></td>
                    <td style={styles.td}>{n.date_raised}</td>
                    <td style={styles.td}>{n.raised_by_role}<br /><small style={{ color: colors.greyDark }}>{n.raised_by_name}</small></td>
                    <td style={styles.td}>{insp ? `I&TN ${insp.itn_no}/${insp.item_no}` : '—'}</td>
                    <td style={styles.td}>{n.building}</td>
                    <td style={styles.td}>{n.severity}</td>
                    <td style={styles.td}><span style={statBadge(n.status || 'Draft')}>{n.status || 'Draft'}</span></td>
                    <td style={{ ...styles.td, color: negative ? colors.redDark : undefined, fontWeight: negative ? 700 : undefined }}
                      title={negative ? 'Close-out date is before the raised date — check for a data-entry error' : undefined}>
                      {negative ? `⚠ ${days}` : days}
                    </td>
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
