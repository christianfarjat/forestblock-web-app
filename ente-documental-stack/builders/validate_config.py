#!/usr/bin/env python3
"""
Validador de config/dataroom.config.json.

Chequea que la fuente única esté sana antes de correr los builders o el deploy:
folder IDs con forma válida, conteos de mapeo (10 + 7), roles, backend, y que no
haya archivos ni códigos duplicados.

Uso:
    python3 validate_config.py        # exit 0 si OK, 1 si hay errores
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, "..", "config", "dataroom.config.json")

DRIVE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{20,}$")
# MJM-FB-<AREA(2)>-<TIPO(2–3)>-<NNN>-V<n>  (TIPO puede ser IT, INF, PLA, FOR, ...)
CODE_RE = re.compile(r"^MJM-FB-[A-Z]{2}-[A-Z]{2,3}-\d{3}-V\d+$")


def load_config(path=CONFIG_PATH):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def validate(cfg):
    """Devuelve (errores, advertencias) como listas de strings."""
    errors, warnings = [], []

    def req(cond, msg):
        if not cond:
            errors.append(msg)

    # Dataroom + folders.
    dataroom = cfg.get("dataroom", {})
    parent = dataroom.get("parentFolderId", "")
    req(bool(DRIVE_ID_RE.match(parent)), f"parentFolderId inválido: {parent!r}")

    folders = cfg.get("folders", {})
    req(len(folders) >= 2, "Se esperaban al menos 2 carpetas en 'folders'.")
    for name, fid in folders.items():
        req(bool(DRIVE_ID_RE.match(str(fid))), f"folder ID inválido para {name}: {fid!r}")

    # Roles.
    roles = {k: v for k, v in cfg.get("roles", {}).items() if not k.startswith("$")}
    req("INTERNAL" in roles and len(roles["INTERNAL"]) >= 1, "roles.INTERNAL debe tener ≥ 1 email.")
    for role, emails in roles.items():
        for e in emails:
            if "@" not in str(e):
                warnings.append(f"email sospechoso en rol {role}: {e!r}")
    for role in ("VVB", "BUYERS", "AUDITOR"):
        if role in roles and not roles[role]:
            warnings.append(f"rol {role} sin emails (se completará al designarse).")

    # File mapping: conteos, duplicados, códigos.
    mapping = cfg.get("fileMapping", {})
    expected = cfg.get("expectedCounts", {})
    seen_files, seen_codes = set(), set()
    for carpeta, files in mapping.items():
        req(carpeta in folders, f"fileMapping usa carpeta desconocida: {carpeta!r}")
        if carpeta in expected:
            req(len(files) == expected[carpeta],
                f"{carpeta}: {len(files)} archivos, se esperaban {expected[carpeta]}.")
        for filename in files:
            if filename in seen_files:
                errors.append(f"archivo duplicado en el mapeo: {filename}")
            seen_files.add(filename)
            code = filename.split("_", 1)[0]
            if code.startswith("MJM-FB"):
                if not CODE_RE.match(code):
                    warnings.append(f"código no matchea el patrón MJM-FB-XX-XXX-NNN-Vn: {code}")
                if code in seen_codes:
                    errors.append(f"código duplicado en el mapeo: {code}")
                seen_codes.add(code)

    # Backend.
    backend = cfg.get("backend", {})
    req(bool(backend.get("sourceXlsx")), "backend.sourceXlsx vacío.")
    if backend.get("targetFolder") and backend["targetFolder"] not in folders:
        warnings.append(f"backend.targetFolder desconocido: {backend['targetFolder']}")
    if not backend.get("sheetId"):
        warnings.append("backend.sheetId vacío (se completa tras convertir a Google Sheet en Fase 3).")

    return errors, warnings


def main():
    cfg = load_config()
    errors, warnings = validate(cfg)
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    if errors:
        print(f"\n✗ config inválida: {len(errors)} error(es), {len(warnings)} advertencia(s).")
        return 1
    print(f"\n✓ config OK ({len(warnings)} advertencia(s)).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
