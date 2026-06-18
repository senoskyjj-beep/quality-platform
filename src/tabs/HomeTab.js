import React from 'react';
import { styles, colors } from '../styles';
import { exportToExcel } from '../excelExport';

export default function HomeTab({ inspections, findings, ncrs, cubes, setupData, badges }) {
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = inspections.filter(i => i.date === today);
  const todayConf = todayBookings.filter(b => b.status === 'Conformant').length;
  const todayPending = todayBookings.filter(b => !b.status).length;

  return (
    <>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>How it works</div>
        <ol style={{ paddingLeft: 20, fontSize: 13, lineHeight: 1.7 }}>
          <li>📋 Type today's bookings (from engineer's WhatsApp) on the <b>Today's Bookings</b> tab</li>
          <li>🔍 Inspect work, set status: Conformant / Nonconformant / Cancelled / Rejected</li>
          <li>⚠ Log Findings as evidence (form pre-fills from booking)</li>
          <li>📋 Raise NCR if needed (Joshua / Engineer / Foreman / Client / QA Mgr)</li>
          <li>🧪 Cubes auto-create for every pour — fill in results later</li>
          <li>📎 Upload documents (cube certs, sign-offs, etc.) tagged by uploader role</li>
          <li>📥 Export Excel for management anytime</li>
        </ol>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Today's Snapshot — {today}</div>
        <div style={styles.kpiGrid}>
          <Kpi label="Today's Bookings" value={todayBookings.length} />
          <Kpi label="Inspected" value={todayConf} color={colors.greenDark} />
          <Kpi label="Pending" value={todayPending} color={colors.orangeDark} />
          <Kpi label="Findings Logged" value={findings.length} />
          <Kpi label="NCRs Open" value={badges.ncr} color={colors.redDark} />
          <Kpi label="Cubes Pending 28d" value={badges.cubes} />
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Quick Actions</div>
        <button style={styles.btn}
          onClick={() => exportToExcel({ project: setupData.project, inspections, findings, ncrs, cubes })}>
          📥 Download Excel Workbook
        </button>
      </div>
    </>
  );
}

function Kpi({ label, value, color }) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={{ ...styles.kpiValue, color: color || colors.navy }}>{value}</div>
    </div>
  );
}
