export const colors = {
  navy: '#1F4E79', navyDark: '#163d5e',
  lightBlue: '#D9E2F3', yellow: '#FFF2CC',
  green: '#E2EFDA', greenDark: '#548235',
  red: '#FCE4D6', redDark: '#C00000',
  orange: '#FFE4B5', orangeDark: '#ED7D31',
  purple: '#7030A0',
  grey: '#F2F2F2', greyDark: '#888888',
  white: '#FFFFFF', bg: '#F4F6F8',
};

export const styles = {
  app: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: colors.bg, minHeight: '100vh', color: '#222' },
  topBar: { background: colors.navy, color: colors.white, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  title: { fontSize: 17, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 11, opacity: 0.85, marginTop: 2 },
  syncStatus: { fontSize: 11, padding: '4px 10px', borderRadius: 12, fontWeight: 600 },
  tabs: { display: 'flex', background: colors.white, borderBottom: `2px solid ${colors.lightBlue}`, overflowX: 'auto', position: 'sticky', top: 56, zIndex: 90, WebkitOverflowScrolling: 'touch' },
  tab: { padding: '12px 16px', fontSize: 14, fontWeight: 600, color: colors.greyDark, background: 'transparent', border: 'none', borderBottom: '3px solid transparent', whiteSpace: 'nowrap', cursor: 'pointer' },
  tabActive: { color: colors.navy, borderBottomColor: colors.navy, background: colors.lightBlue + '40' },
  tabBadge: { background: colors.redDark, color: colors.white, fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 6px', marginLeft: 6, minWidth: 16, display: 'inline-block', textAlign: 'center' },
  content: { padding: 16, maxWidth: 1200, margin: '0 auto' },
  card: { background: colors.white, borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: colors.navy, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
  kpi: { background: colors.white, border: `1px solid ${colors.lightBlue}`, borderRadius: 6, padding: 12, textAlign: 'center' },
  kpiLabel: { fontSize: 11, color: colors.greyDark, fontWeight: 600, textTransform: 'uppercase' },
  kpiValue: { fontSize: 26, fontWeight: 700, color: colors.navy, marginTop: 4 },
  btn: { padding: '10px 18px', fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', background: colors.navy, color: colors.white, minHeight: 44 },
  btnSec: { padding: '10px 18px', fontSize: 14, fontWeight: 600, border: `1px solid ${colors.navy}`, borderRadius: 6, cursor: 'pointer', background: colors.white, color: colors.navy, minHeight: 44 },
  btnDanger: { padding: '10px 18px', fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', background: colors.redDark, color: colors.white, minHeight: 44 },
  btnSm: { padding: '6px 12px', fontSize: 12, minHeight: 32, fontWeight: 600, borderRadius: 4, cursor: 'pointer', display: 'inline-block', border: 'none' },
  input: { width: '100%', padding: '10px', fontSize: 15, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box', minHeight: 40 },
  label: { fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, display: 'block' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th: { background: colors.navy, color: colors.white, padding: '8px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', position: 'sticky', top: 0 },
  td: { padding: '6px 8px', borderBottom: `1px solid ${colors.lightBlue}`, fontSize: 12, verticalAlign: 'top' },
  banner: { background: colors.yellow, border: '1px solid #E8C547', borderRadius: 6, padding: 10, fontSize: 13, fontWeight: 600, marginBottom: 12, textAlign: 'center' },
  bannerGreen: { background: colors.green, borderColor: colors.greenDark },
  bannerInfo: { background: colors.lightBlue, borderColor: colors.navy },
  prefilledBanner: { background: colors.lightBlue, borderLeft: `4px solid ${colors.navy}`, padding: '10px 12px', borderRadius: '0 4px 4px 0', fontSize: 12, marginBottom: 12 },
};

export const statBadge = (status) => {
  const map = {
    'Conformant': { bg: colors.greenDark, color: 'white' },
    'Nonconformant': { bg: colors.redDark, color: 'white' },
    'Cancelled': { bg: colors.orangeDark, color: 'white' },
    'Rejected': { bg: colors.purple, color: 'white' },
    'Pending': { bg: colors.greyDark, color: 'white' },
    'Draft': { bg: colors.greyDark, color: 'white' },
    'Open': { bg: colors.redDark, color: 'white' },
    'In progress': { bg: colors.orangeDark, color: 'white' },
    'Closed': { bg: colors.greenDark, color: 'white' },
    'Verified': { bg: colors.greenDark, color: 'white' },
  };
  const s = map[status] || { bg: colors.greyDark, color: 'white' };
  return { display: 'inline-block', padding: '3px 9px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, whiteSpace: 'nowrap' };
};
