import React, { useState, useEffect, useCallback } from 'react';
import { api, startRetryLoop, getPendingCount, manualRetryPending } from './api';
import { styles, colors } from './styles';
import { APP_TITLE, PROJECT_NAME, PROJECT_NO, SCRIPT_URL } from './config';

import HomeTab from './tabs/HomeTab';
import TodayTab from './tabs/TodayTab';
import DashboardTab from './tabs/DashboardTab';
import FindingsTab from './tabs/FindingsTab';
import NCRTab from './tabs/NCRTab';
import CubesTab from './tabs/CubesTab';
import DocumentsTab from './tabs/DocumentsTab';
import ITPTab from './tabs/ITPTab';
import SetupTab from './tabs/SetupTab';
import SpecsTab from './tabs/SpecsTab';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'today', label: "Today's Bookings" },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'findings', label: 'Findings' },
  { id: 'ncr', label: 'NCRs' },
  { id: 'cubes', label: 'Cubes' },
  { id: 'documents', label: 'Documents' },
  { id: 'itp', label: 'ITP Register' },
  { id: 'specs', label: 'Specs' },
  { id: 'setup', label: 'Setup' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [setupData, setSetupData] = useState({ setup: {}, phones: {}, project: {} });
  const [inspections, setInspections] = useState([]);
  const [findings, setFindings] = useState([]);
  const [ncrs, setNcrs] = useState([]);
  const [cubes, setCubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(null);
  const [pendingCount, setPendingCount] = useState(getPendingCount());
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [setupR, inspR, findR, ncrR, cubeR] = await Promise.all([
        api.getSetup(),
        api.listInspections(),
        api.listFindings(),
        api.listNCRs(),
        api.listCubes(),
      ]);
      setSetupData({ setup: setupR.setup, phones: setupR.phones, project: setupR.project });
      setInspections(inspR.records || []);
      setFindings(findR.records || []);
      setNcrs(ncrR.records || []);
      setCubes(cubeR.records || []);
      setConnected(true);
    } catch (e) {
      setError(e.message);
      setConnected(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (SCRIPT_URL.startsWith('PASTE_YOUR')) {
      setError('Backend not configured. Edit src/config.js with your Apps Script URL — see README.');
      setLoading(false);
      setConnected(false);
      return;
    }
    loadAll();
    startRetryLoop();
    const t = setInterval(() => setPendingCount(getPendingCount()), 2000);
    return () => clearInterval(t);
  }, [loadAll]);

  const refresh = () => loadAll();

  const openCount = ncrs.filter(n => n.status === 'Open' || n.status === 'Draft' || n.status === 'In progress').length;
  const findingsOpen = findings.filter(f => f.status !== 'Closed' && f.status !== 'Verified').length;
  const cubesAwaiting28 = cubes.filter(c => !c.result_28).length;
  const badges = { ncr: openCount, findings: findingsOpen, cubes: cubesAwaiting28 };

  const tabProps = {
    setupData, setSetupData, inspections, setInspections,
    findings, setFindings, ncrs, setNcrs, cubes, setCubes, refresh,
  };

  return (
    <div style={styles.app}>
      <header style={styles.topBar}>
        <div>
          <h1 style={styles.title}>{APP_TITLE}</h1>
          <div style={styles.subtitle}>{PROJECT_NAME} — {PROJECT_NO}</div>
        </div>
        <div style={{
          ...styles.syncStatus,
          background: connected === true ? colors.greenDark :
                      connected === false ? colors.redDark : colors.greyDark,
          color: colors.white
        }}>
          {connected === true ? '● Online' : connected === false ? '● Offline' : '● Connecting…'}
          {pendingCount > 0 && (
            <span style={{ marginLeft: 8 }} onClick={manualRetryPending} role="button">
              ⏳ {pendingCount}
            </span>
          )}
        </div>
      </header>

      <nav style={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id}
            style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
            {badges[t.id] > 0 && <span style={styles.tabBadge}>{badges[t.id]}</span>}
          </button>
        ))}
      </nav>

      <main style={styles.content}>
        {error && (
          <div style={{ ...styles.card, background: '#fff3cd', borderLeft: `4px solid ${colors.orangeDark}` }}>
            <strong>Notice:</strong> {error}
          </div>
        )}
        {loading && !setupData.setup.Inspectors && (
          <div style={styles.card}>Loading data from server…</div>
        )}

        {activeTab === 'home' && <HomeTab {...tabProps} badges={badges} />}
        {activeTab === 'today' && <TodayTab {...tabProps} />}
        {activeTab === 'dashboard' && <DashboardTab {...tabProps} />}
        {activeTab === 'findings' && <FindingsTab {...tabProps} />}
        {activeTab === 'ncr' && <NCRTab {...tabProps} />}
        {activeTab === 'cubes' && <CubesTab {...tabProps} />}
        {activeTab === 'documents' && <DocumentsTab {...tabProps} />}
        {activeTab === 'itp' && <ITPTab {...tabProps} />}
        {activeTab === 'specs' && <SpecsTab />}
        {activeTab === 'setup' && <SetupTab {...tabProps} />}
      </main>
    </div>
  );
}
