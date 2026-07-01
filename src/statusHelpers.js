// Single source of truth for "is this record still open" — used by nav
// badges, the Dashboard, and each register tab, so they never disagree.
export function isNcrOpen(status) {
  return status === 'Open' || status === 'Draft' || status === 'In progress';
}

export function isFindingOpen(status) {
  return status !== 'Closed' && status !== 'Verified';
}
