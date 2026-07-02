#!/usr/bin/env python3
"""
Tests de los builders. Correr desde builders/:  python3 -m pytest -q

Blindan la sincronía backend <-> CONFIG.TABS de Dataroom.gs, los conteos del
mapeo y las salidas de los builders. No requieren red ni Google.
"""

import os
import re

import build_appsheet_schema as bas
import build_checklist as bch
import build_docs as bdoc
import validate_config as vc

HERE = os.path.dirname(os.path.abspath(__file__))
GS_PATH = os.path.join(HERE, "..", "appsscript", "Dataroom.gs")
PDD_FOLDER = "A_Expediente_Interno/01_PDD"


def script_tabs():
    """Nombres de pestañas declarados en CONFIG.TABS de Dataroom.gs."""
    text = open(GS_PATH, encoding="utf-8").read()
    block = re.search(r"TABS:\s*\{(.*?)\}", text, re.S).group(1)
    return set(re.findall(r":\s*'([^']+)'", block))


def test_config_valida():
    errors, _ = vc.validate(vc.load_config())
    assert errors == [], errors


def test_backend_tabs_match_script():
    wb = bas.build_workbook(vc.load_config())
    assert set(wb.sheetnames) == script_tabs()


def test_backend_documents_count():
    cfg = vc.load_config()
    wb = bas.build_workbook(cfg)
    total = sum(len(v) for v in cfg["fileMapping"].values())
    assert wb["Documents"].max_row - 1 == total == 17


def test_backend_shares_header():
    wb = bas.build_workbook(vc.load_config())
    header = [c.value for c in wb["Shares"][1]]
    assert header == ["share_id", "file_id", "file_name", "role", "email", "access", "shared_at", "shared_by"]


def test_access_matrix_covers_roles():
    wb = bas.build_workbook(vc.load_config())
    roles = {r[0] for r in wb["Access_Matrix"].iter_rows(min_row=2, values_only=True)}
    assert {"INTERNAL", "VVB", "BUYERS", "AUDITOR"} <= roles


def test_checklist_columns_and_count():
    wb, n = bch.build_workbook("VM0042")
    assert n == 50
    assert wb.sheetnames == ["Checklist", "Metodologia"]
    assert [c.value for c in wb["Checklist"][1]] == bch.HEADERS


def test_checklist_both_methodologies():
    for m in ("VM0042", "VM0032"):
        _, n = bch.build_workbook(m)
        assert n == 50


def test_pdd_skeleton_names_match_config():
    cfg = vc.load_config()
    names = {name for name, _ in bdoc.build_pdd_skeletons(cfg, "2026-01-01")}
    assert names == set(cfg["fileMapping"][PDD_FOLDER])
    assert len(names) == 10


def test_structural_docs_count():
    cfg = vc.load_config()
    docs = [
        bdoc.build_indice(cfg, "2026-01-01"),
        bdoc.build_arquitectura("2026-01-01"),
        bdoc.build_gobernanza("2026-01-01"),
        bdoc.build_runbook_doc("2026-01-01"),
    ]
    assert len(docs) == 4
    assert all(name.endswith(".docx") for name, _ in docs)
