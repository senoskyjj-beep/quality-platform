import React, { useMemo } from 'react';
import { styles, colors } from '../styles';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { isNcrOpen, isFindingOpen } from '../statusHelpers';

const COLORS = [colors.greenDark, colors.orangeDark, colors.redDark, colors.purple, '#2E75B6'];

export default function DashboardTab({ inspections, findings, ncrs, cubes }) {
  const stats = useMemo(() => {
    const total = inspections.length;
    const conf = inspections.filter(r => r.status === 'Conformant').length;
    const nonc = inspections.filter(r => r.status === 'Nonconformant').length;
    const canc = inspections.filter(r => r.status === 'Cancelled').length;
    const rej = inspections.filter(r => r.status === 'Rejected').length;
    const pending = inspections.filter(r => !r.status).length;

    const byBuilding = {};
    inspections.forEach(r => {
      const b = r.building || 'Unknown';
      if (!byBuilding[b]) byBuilding[b] = { name: b, conf: 0, nonc: 0, canc: 0, rej: 0 };
      if (r.status === 'Conformant') byBuilding[b].conf++;
      if (r.status === 'Nonconformant') byBuilding[b].nonc++;
      if (r.status === 'Cancelled') byBuilding[b].canc++;
      if (r.status === 'Rejected') byBuilding[b].rej++;
    });

    return {
      total, conf, nonc, canc, rej, pending,
      pie: [
        { name: 'Conformant', value: conf },
        { name: 'Nonconformant', value: nonc },
        { name: 'Cancelled', value: canc },
        { name: 'Rejected', value: rej },
      ].filter(x => x.value > 0),
      byBuildingArray: Object.values(byBuilding),
    };
  }, [inspections]);

  return (
    <>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>1. Headline KPIs</div>
        <div style={styles.kpiGrid}>
          <Kpi label="Total Bookings" value={stats.total} />
          <Kpi label="Conformant" value={stats.conf} color={colors.greenDark} />
          <Kpi label="Nonconformant" value={stats.nonc} color={colors.redDark} />
          <Kpi label="Cancelled" value={stats.canc} color={colors.orangeDark} />
          <Kpi label="Rejected" value={stats.rej} color={colors.purple} />
          <Kpi label="Pending" value={stats.pending} />
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>2. Findings & NCRs</div>
        <div style={styles.kpiGrid}>
          <Kpi label="Findings Total" value={findings.length} />
          <Kpi label="Findings Open" value={findings.filter(f => isFindingOpen(f.status)).length} color={colors.orangeDark} />
          <Kpi label="Findings → NCR" value={findings.filter(f => f.promoted_to_ncr === '1').length} />
          <Kpi label="NCRs Total" value={ncrs.length} />
          <Kpi label="NCRs Open" value={ncrs.filter(n => isNcrOpen(n.status)).length} color={colors.redDark} />
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>3. Cubes</div>
        <div style={styles.kpiGrid}>
          <Kpi label="Cubes Total" value={cubes.length} />
          <Kpi label="Awaiting 7-day" value={cubes.filter(c => !c.result_7).length} />
          <Kpi label="Awaiting 28-day" value={cubes.filter(c => !c.result_28).length} color={colors.orangeDark} />
          <Kpi label="Failed 28-day" value={cubes.filter(c => c.pass_28 === 'Fail').length} color={colors.redDark} />
        </div>
      </div>

      {stats.pie.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>4. Results Breakdown</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.pie} dataKey="value" nameKey="name" outerRadius={100} label={(e) => `${e.name}: ${e.value}`}>
                {stats.pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.byBuildingArray.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>5. By Building</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byBuildingArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis />
              <Tooltip /><Legend />
              <Bar dataKey="conf" stackId="a" fill={colors.greenDark} name="Conformant" />
              <Bar dataKey="canc" stackId="a" fill={colors.orangeDark} name="Cancelled" />
              <Bar dataKey="nonc" stackId="a" fill={colors.redDark} name="Nonconformant" />
              <Bar dataKey="rej" stackId="a" fill={colors.purple} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
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
