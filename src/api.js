import { SCRIPT_URL } from './config';

const PENDING_KEY = 'qa_v2_pending_sync';
const RETRY_INTERVAL_MS = 30000;

function getPending() { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); } catch { return []; } }
function setPending(items) { localStorage.setItem(PENDING_KEY, JSON.stringify(items)); }
function enqueue(action, params) {
  const pending = getPending();
  pending.push({
    id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    action, params,
    enqueued_at: new Date().toISOString(),
    attempts: 0, last_error: null
  });
  setPending(pending);
}
export function getPendingCount() { return getPending().length; }
export function getPendingList() { return getPending(); }
export function clearPending() { setPending([]); }

// Give every new record a stable client-side id BEFORE first send,
// so a retried save updates the same row instead of creating a duplicate.
function ensureId(rec) {
  if (rec && !rec.id) {
    rec.id = 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }
  return rec;
}

async function rawCall(action, params = {}) {
  if (!SCRIPT_URL || SCRIPT_URL.startsWith('PASTE_YOUR')) {
    throw new Error('SCRIPT_URL not configured. Edit src/config.js with your Apps Script Web App URL.');
  }
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...params })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Backend returned not OK');
  return data;
}

export async function call(action, params = {}, opts = {}) {
  try { return await rawCall(action, params); }
  catch (err) {
    if (opts.enqueueOnFail) enqueue(action, params);
    throw err;
  }
}

let retryRunning = false;
async function retryPending() {
  if (retryRunning) return;
  retryRunning = true;
  try {
    const pending = getPending();
    if (pending.length === 0) return;
    const remaining = [];
    for (const item of pending) {
      try { item.attempts++; await rawCall(item.action, item.params); }
      catch (err) {
        item.last_error = err.message;
        remaining.push(item);
      }
    }
    setPending(remaining);
  } finally { retryRunning = false; }
}

export function startRetryLoop() {
  retryPending();
  setInterval(retryPending, RETRY_INTERVAL_MS);
}
export async function manualRetryPending() { return retryPending(); }

export const api = {
  ping: () => call('ping'),
  getSetup: () => call('getSetup'),
  saveSetup: (data) => call('saveSetup', { data }, { enqueueOnFail: true }),
  getAll: () => call('getAll'),
  listInspections: (f) => call('listInspections', { filter: f }),
  saveInspection: (r) => call('saveInspection', { record: ensureId(r) }, { enqueueOnFail: true }),
  bulkSaveInspections: (rs) => call('bulkSaveInspections', { records: (rs || []).map(ensureId) }, { enqueueOnFail: true }),
  deleteInspection: (id) => call('deleteInspection', { id }, { enqueueOnFail: true }),
  updateInspectionStatus: (id, status, reason, shortNote) =>
    call('updateInspectionStatus', { id, status, reason, shortNote }, { enqueueOnFail: true }),
  listFindings: (f) => call('listFindings', { filter: f }),
  saveFinding: (r) => call('saveFinding', { record: ensureId(r) }, { enqueueOnFail: true }),
  deleteFinding: (id) => call('deleteFinding', { id }, { enqueueOnFail: true }),
  promoteToNCR: (findingId, raisedByRole, raisedByName) =>
    call('promoteToNCR', { findingId, raisedByRole, raisedByName }, { enqueueOnFail: true }),
  listNCRs: (f) => call('listNCRs', { filter: f }),
  saveNCR: (r) => call('saveNCR', { record: ensureId(r) }, { enqueueOnFail: true }),
  listCubes: (f) => call('listCubes', { filter: f }),
  saveCube: (r) => call('saveCube', { record: ensureId(r) }, { enqueueOnFail: true }),
  listDocuments: (t, id) => call('listDocuments', { linkedType: t, linkedId: id }),
  saveDocument: (d) => call('saveDocument', { doc: ensureId(d) }, { enqueueOnFail: true }),
  savePhoto: (p) => call('savePhoto', { photo: ensureId(p) }, { enqueueOnFail: true }),
  listPhotos: (t, id) => call('listPhotos', { linkedType: t, linkedId: id }),
  listITP: () => call('listITP'),
  saveITP: (r) => call('saveITP', { record: ensureId(r) }, { enqueueOnFail: true }),
  getDashboard: () => call('getDashboard'),
};
