/**
 * ENTE Dataroom Automation — Google Apps Script (standalone)
 * Proyecto Carbono ENTE (Río Negro) — Ganadería Regenerativa · Verra VCS + CCB
 * Ref: handoff MJM-FB-TI-IT-003 · backend MJM-FB-TI-FOR-001 · poblado MJM-FB-TI-IT-002
 *
 * Qué hace:
 *   - setupDataroom():  valida acceso a carpetas + backend Sheet y crea la carpeta de
 *                       snapshots. REQUIERE autorización manual la primera vez (scopes Drive).
 *   - doPost(e):        webhook para el Bot de AppSheet Automation.
 *                       body: {"action":"snapshot","fileId":"<drive_file_id>","token":"<secreto>"}
 *   - snapshotFile_():  congela una copia inmutable del archivo aprobado y la registra.
 *
 * PENDIENTE de completar antes de operar:
 *   1) CONFIG.SHEET_ID     -> tras convertir el backend .xlsx a Google Sheet (Fase 3).
 *   2) CONFIG.WEBHOOK_TOKEN -> un secreto; el mismo valor va en el Bot de AppSheet.
 *   3) CONFIG.ROLES         -> emails de VVB/BUYERS/AUDITOR cuando se designen.
 */

const CONFIG = {
  // Backend (Google Sheet nativo). Completar tras Fase 3.
  SHEET_ID: '',

  // Secreto compartido con el Bot de AppSheet (se valida en doPost). Completar.
  WEBHOOK_TOKEN: '',

  // Carpeta raíz del dataroom (ver config/dataroom.config.json).
  DATAROOM_PARENT_ID: '1ENWFAx0Arp_Gqj02Cx24jqQxyLYlroZE',

  // Carpetas destino (deben coincidir con config/dataroom.config.json).
  FOLDERS: {
    PDD: '1grdc9Vkmjw4-9aRWoNhxVvA9fKml-Qg8', // A_Expediente_Interno/01_PDD
    BASE_HABILITANTES: '1rS_0pki4wP6jFGFlupTPg_c7UvA8SAGc', // A_Expediente_Interno/00_Base_Habilitantes
  },

  // Carpeta donde se guardan snapshots inmutables (se crea bajo el parent si no existe).
  SNAPSHOTS_FOLDER_NAME: 'C_Snapshots_VVB',

  // Roles → emails. Sólo INTERNAL cargado; el resto se completa al designarse.
  ROLES: {
    INTERNAL: ['christian.farjat@mjmenergia.com'],
    VVB: [],
    BUYERS: [],
    AUDITOR: [],
  },

  // Pestañas del backend Sheet (deben coincidir con builders/build_appsheet_schema.py).
  TABS: {
    DOCUMENTS: 'Documents',
    ROLES: 'Roles',
    STAGES: 'Stages',
    SNAPSHOTS: 'Snapshots',
    AUDIT: 'Audit_Log',
  },
};

/* ────────────────────────────────────────────────────────────────────────
 * SETUP — correr una vez en el editor (autoriza scopes de Drive/Sheets).
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Valida el entorno del dataroom y deja todo listo para operar.
 * Devuelve (y loguea) un resumen con lo verificado.
 */
function setupDataroom() {
  const report = { ok: true, checks: [], warnings: [] };

  // 1) Backend Sheet.
  if (!CONFIG.SHEET_ID) {
    report.ok = false;
    report.warnings.push('CONFIG.SHEET_ID vacío: completar tras convertir el backend a Google Sheet (Fase 3).');
  } else {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    report.checks.push('Backend Sheet accesible: ' + ss.getName());
    Object.keys(CONFIG.TABS).forEach(function (key) {
      const tab = CONFIG.TABS[key];
      const sheet = ss.getSheetByName(tab);
      if (sheet) {
        report.checks.push('Pestaña "' + tab + '" OK (' + sheet.getLastRow() + ' filas).');
      } else {
        report.ok = false;
        report.warnings.push('Falta la pestaña "' + tab + '" en el backend Sheet.');
      }
    });
  }

  // 2) Carpetas del dataroom.
  const folderIds = { PARENT: CONFIG.DATAROOM_PARENT_ID, PDD: CONFIG.FOLDERS.PDD, BASE: CONFIG.FOLDERS.BASE_HABILITANTES };
  Object.keys(folderIds).forEach(function (label) {
    try {
      const f = DriveApp.getFolderById(folderIds[label]);
      report.checks.push('Carpeta ' + label + ' accesible: "' + f.getName() + '".');
    } catch (err) {
      report.ok = false;
      report.warnings.push('Sin acceso a carpeta ' + label + ' (' + folderIds[label] + '): ' + err.message);
    }
  });

  // 3) Carpeta de snapshots (se crea si no existe).
  try {
    const snap = getSnapshotsFolder_();
    report.checks.push('Carpeta de snapshots lista: "' + snap.getName() + '".');
  } catch (err) {
    report.ok = false;
    report.warnings.push('No se pudo asegurar la carpeta de snapshots: ' + err.message);
  }

  // 4) Deja registro (si el Sheet ya está configurado).
  if (CONFIG.SHEET_ID) {
    try {
      logAudit_('setup', 'dataroom', report.ok ? 'OK' : 'con advertencias');
    } catch (err) {
      report.warnings.push('No se pudo escribir en Audit_Log: ' + err.message);
    }
  }

  Logger.log(JSON.stringify(report, null, 2));
  return report;
}

/* ────────────────────────────────────────────────────────────────────────
 * WEBHOOK — llamado por el Bot de AppSheet Automation.
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Endpoint del web app. Espera JSON:
 *   {"action":"snapshot","fileId":"<drive_file_id>","token":"<CONFIG.WEBHOOK_TOKEN>"}
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut_({ ok: false, error: 'Sin body.' });
    }
    const body = JSON.parse(e.postData.contents);

    // Autenticación por secreto compartido.
    if (!CONFIG.WEBHOOK_TOKEN || body.token !== CONFIG.WEBHOOK_TOKEN) {
      logAudit_('webhook_denied', String(body.fileId || ''), 'token inválido');
      return jsonOut_({ ok: false, error: 'No autorizado.' });
    }

    const action = String(body.action || '').toLowerCase();
    if (action === 'snapshot') {
      if (!body.fileId) return jsonOut_({ ok: false, error: 'Falta fileId.' });
      const result = snapshotFile_(body.fileId, body.actor || 'appsheet-bot');
      return jsonOut_({ ok: true, action: 'snapshot', result: result });
    }

    if (action === 'ping') {
      return jsonOut_({ ok: true, action: 'ping', pong: nowIso_() });
    }

    logAudit_('webhook_unknown_action', String(body.fileId || ''), action);
    return jsonOut_({ ok: false, error: 'Acción no soportada: ' + action });
  } catch (err) {
    try {
      logAudit_('webhook_error', '', err.message);
    } catch (ignored) {
      // best-effort
    }
    return jsonOut_({ ok: false, error: err.message });
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * CORE
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Congela una copia inmutable del archivo aprobado en la carpeta de snapshots
 * y la registra en las pestañas Snapshots y Audit_Log.
 * @return {{snapshotFileId: string, snapshotUrl: string, name: string}}
 */
function snapshotFile_(fileId, actor) {
  const source = DriveApp.getFileById(fileId);
  const stamp = nowIso_();
  const snapName = source.getName() + ' [snapshot ' + stamp + ']';
  const folder = getSnapshotsFolder_();

  const copy = source.makeCopy(snapName, folder);
  // Snapshot inmutable: sólo lectura para quien lo tenga; sin edición.
  try {
    copy.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
  } catch (err) {
    // En algunos Shared Drives el setSharing está restringido por política; no es bloqueante.
  }

  const snapId = Utilities.getUuid();
  const url = copy.getUrl();

  appendRow_(CONFIG.TABS.SNAPSHOTS, [snapId, fileId, source.getName(), copy.getId(), url, stamp, actor]);
  logAudit_('snapshot', fileId, 'snapshot=' + copy.getId());

  return { snapshotFileId: copy.getId(), snapshotUrl: url, name: snapName };
}

/**
 * Devuelve los emails cargados para un rol (INTERNAL/VVB/BUYERS/AUDITOR).
 * Prioriza la pestaña Roles del backend; cae a CONFIG.ROLES si el Sheet no está.
 */
function getRoleEmails_(role) {
  const key = String(role || '').toUpperCase();
  if (CONFIG.SHEET_ID) {
    try {
      const sheet = getSheet_(CONFIG.TABS.ROLES);
      const rows = sheet.getDataRange().getValues();
      // Header esperado: [role, email, scope, active]
      const emails = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const active = String(r[3]).toUpperCase() !== 'FALSE' && r[3] !== false;
        if (String(r[0]).toUpperCase() === key && r[1] && active) emails.push(String(r[1]).trim());
      }
      if (emails.length) return emails;
    } catch (err) {
      // cae al fallback
    }
  }
  return (CONFIG.ROLES[key] || []).slice();
}

/* ────────────────────────────────────────────────────────────────────────
 * HELPERS
 * ──────────────────────────────────────────────────────────────────────── */

function getBackend_() {
  if (!CONFIG.SHEET_ID) throw new Error('CONFIG.SHEET_ID no configurado.');
  return SpreadsheetApp.openById(CONFIG.SHEET_ID);
}

function getSheet_(name) {
  const sheet = getBackend_().getSheetByName(name);
  if (!sheet) throw new Error('No existe la pestaña "' + name + '" en el backend.');
  return sheet;
}

function appendRow_(tabName, rowArray) {
  getSheet_(tabName).appendRow(rowArray);
}

function logAudit_(action, target, details) {
  if (!CONFIG.SHEET_ID) return; // sin backend no hay dónde loguear
  appendRow_(CONFIG.TABS.AUDIT, [Utilities.getUuid(), nowIso_(), Session.getActiveUser().getEmail(), action, target, details || '']);
}

function getSnapshotsFolder_() {
  const parent = DriveApp.getFolderById(CONFIG.DATAROOM_PARENT_ID);
  const it = parent.getFoldersByName(CONFIG.SNAPSHOTS_FOLDER_NAME);
  return it.hasNext() ? it.next() : parent.createFolder(CONFIG.SNAPSHOTS_FOLDER_NAME);
}

function nowIso_() {
  return new Date().toISOString();
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ────────────────────────────────────────────────────────────────────────
 * TEST — para correr desde el editor sin desplegar el web app.
 * ──────────────────────────────────────────────────────────────────────── */

/** Simula un POST de snapshot. Cambiar TEST_FILE_ID por un archivo real del dataroom. */
function test_doPost() {
  const TEST_FILE_ID = 'PEGAR_UN_DRIVE_FILE_ID_DE_PRUEBA';
  const fake = { postData: { contents: JSON.stringify({ action: 'snapshot', fileId: TEST_FILE_ID, token: CONFIG.WEBHOOK_TOKEN }) } };
  Logger.log(doPost(fake).getContent());
}
