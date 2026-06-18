import React from 'react';
import { styles, colors, statBadge } from '../styles';

export default function CubesTab({ cubes, inspections }) {
  return (
    <>
      <div style={styles.card}>
        <div style={styles.banner}>
          🧪 {cubes.length} cubes · {cubes.filter(c => !c.result_7).length} awaiting 7-day · {cubes.filter(c => !c.result_28).length} awaiting 28-day
        </div>
        <p style={{ fontSize: 12, color: colors.greyDark }}>
          Cubes auto-create when you book a Pre-Concrete or Post-Concrete inspection. Update results from the booking row.
        </p>
      </div>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Cube Register</div>
        <div style={{ overflow: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cube ID</th>
                <th style={styles.th}>Cast Date</th>
                <th style={styles.th}>Booking</th>
                <th style={styles.th}>Building</th>
                <th style={styles.th}>Element</th>
                <th style={styles.th}>Spec</th>
                <th style={styles.th}>Batch / Supplier</th>
                <th style={styles.th}>7-day</th>
                <th style={styles.th}>28-day</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {cubes.map(c => {
                const insp = inspections.find(i => i.id === c.linked_inspection_id);
                const stat = !c.result_7 ? 'Awaiting 7-day' :
                             !c.result_28 ? '7-day done' :
                             c.pass_28 === 'Pass' ? '✓ 28-day pass' :
                             c.pass_28 === 'Fail' ? '⚠ 28-day FAIL' : '28-day pending';
                return (
                  <tr key={c.id} style={c.pass_28 === 'Fail' ? { background: '#FFF6F0' } : {}}>
                    <td style={styles.td}><b>{c.cube_id || '—'}</b></td>
                    <td style={styles.td}>{c.cast_date}</td>
                    <td style={styles.td}>{insp ? `I&TN ${insp.itn_no}/${insp.item_no}` : '—'}</td>
                    <td style={styles.td}>{c.building}</td>
                    <td style={styles.td}>{c.element_location}</td>
                    <td style={styles.td}>{c.spec_mpa || '—'}</td>
                    <td style={styles.td}>{c.batch_no || '—'} / {c.supplier || '—'}</td>
                    <td style={styles.td}>{c.result_7 || '—'}</td>
                    <td style={styles.td}>{c.result_28 || '—'}</td>
                    <td style={styles.td}>{stat}</td>
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
