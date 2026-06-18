import React, { useMemo } from 'react';
import { styles, colors } from '../styles';

export default function ITPTab({ inspections }) {
  // Auto-derive ITP progress from inspection bookings grouped by itp_no
  const itpRollup = useMemo(() => {
    const map = {};
    inspections.forEach(i => {
      const key = i.itp_no || '(no ITP no.)';
      if (!map[key]) map[key] = { itp_no: key, total: 0, conf: 0, nonc: 0, canc: 0, rej: 0, pending: 0 };
      map[key].total++;
      if (i.status === 'Conformant') map[key].conf++;
      else if (i.status === 'Nonconformant') map[key].nonc++;
      else if (i.status === 'Cancelled') map[key].canc++;
      else if (i.status === 'Rejected') map[key].rej++;
      else map[key].pending++;
    });
    return Object.values(map).sort((a, b) => a.itp_no.localeCompare(b.itp_no));
  }, [inspections]);

  return (
    <>
      <div style={styles.card}>
        <div style={{ ...styles.banner, ...styles.bannerInfo }}>
          📊 ITP Register — Phase 2 feature (in progress)
        </div>
        <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
          This tab will eventually track the <b>total number of inspections required</b> per ITP
          (around 3,000 across the project) against how many have been completed and signed off.
          For now, it shows a live roll-up of bookings grouped by ITP number, derived automatically
          from your inspection data.
        </p>
        <p style={{ fontSize: 12, color: colors.greyDark }}>
          When you're ready for full ITP tracking — total counts, % complete, sign-off status — we'll add
          the planned-vs-actual targets here.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Bookings by ITP (live roll-up)</div>
        <div style={{ overflow: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ITP No.</th>
                <th style={styles.th}>Total Booked</th>
                <th style={styles.th}>Conformant</th>
                <th style={styles.th}>Nonconf</th>
                <th style={styles.th}>Cancelled</th>
                <th style={styles.th}>Rejected</th>
                <th style={styles.th}>Pending</th>
                <th style={styles.th}>% Conformant</th>
              </tr>
            </thead>
            <tbody>
              {itpRollup.map(row => {
                const pct = row.total ? Math.round((row.conf / row.total) * 100) : 0;
                return (
                  <tr key={row.itp_no}>
                    <td style={styles.td}><b>{row.itp_no}</b></td>
                    <td style={styles.td}>{row.total}</td>
                    <td style={{ ...styles.td, color: colors.greenDark }}>{row.conf}</td>
                    <td style={{ ...styles.td, color: colors.redDark }}>{row.nonc}</td>
                    <td style={{ ...styles.td, color: colors.orangeDark }}>{row.canc}</td>
                    <td style={{ ...styles.td, color: colors.purple }}>{row.rej}</td>
                    <td style={styles.td}>{row.pending}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 4, minWidth: 40 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: colors.greenDark, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 11 }}>{pct}%</span>
                      </div>
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
