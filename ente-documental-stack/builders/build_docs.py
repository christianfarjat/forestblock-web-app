#!/usr/bin/env python3
"""
Builder: documentos .docx estructurales del stack (python-docx).

Genera con el estilo de casa MJM-FB (carátula + metadatos + historial de cambios):
  - 00_INDICE_Stack_Documental_ENTE.docx           (índice DERIVADO del config: registro completo)
  - MJM-FB-TI-PLA-001-V0_Arquitectura_Stack_Documental_ENTE.docx   (esqueleto)
  - MJM-FB-TI-PLA-002-V0_Dataroom_Gobernanza.docx                  (esqueleto)
  - MJM-FB-TI-IT-001-V0_Dataroom_Deployment_Runbook.docx           (esqueleto)

NO genera el contenido sustantivo del PDD (los MJM-FB-PR-INF-0xx se redactan aparte):
estos son andamiajes para completar, no documentos finales.

Uso:
    python3 build_docs.py [--fecha AAAA-MM-DD]
Salida:
    builders/output/*.docx
"""

import argparse
import datetime
import json
import os

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, "..", "config", "dataroom.config.json")
OUT_DIR = os.path.join(HERE, "output")

FOREST = RGBColor(0x1F, 0x4E, 0x3D)
PROYECTO = "Proyecto Carbono ENTE — Río Negro (Ganadería Regenerativa)"
ESTANDAR = "Verra VCS + CCB"


def load_config():
    with open(CONFIG_PATH, encoding="utf-8") as fh:
        return json.load(fh)


def parse_code(filename):
    stem = filename.rsplit(".", 1)[0]
    code, _, slug = stem.partition("_")
    titulo = slug.replace("_", " ").strip() or stem
    return code, titulo


def add_cover(doc, codigo, titulo, fecha, version="V0", clasificacion="Interno / Confidencial"):
    h = doc.add_paragraph()
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = h.add_run(codigo)
    run.bold = True
    run.font.size = Pt(11)
    run.font.color.rgb = FOREST

    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    tr = t.add_run(titulo)
    tr.bold = True
    tr.font.size = Pt(20)
    tr.font.color.rgb = FOREST

    doc.add_paragraph()
    meta = [
        ("Código", codigo),
        ("Versión", version),
        ("Fecha", fecha),
        ("Proyecto", PROYECTO),
        ("Estándar", ESTANDAR),
        ("Clasificación", clasificacion),
    ]
    table = doc.add_table(rows=len(meta), cols=2)
    table.style = "Light Grid Accent 1"
    for i, (k, v) in enumerate(meta):
        table.rows[i].cells[0].paragraphs[0].add_run(k).bold = True
        table.rows[i].cells[1].text = v
    doc.add_paragraph()


def add_change_history(doc, fecha, descripcion="Emisión inicial."):
    doc.add_heading("Historial de cambios", level=1)
    table = doc.add_table(rows=2, cols=4)
    table.style = "Light Grid Accent 1"
    for j, head in enumerate(["Versión", "Fecha", "Descripción", "Responsable"]):
        table.rows[0].cells[j].paragraphs[0].add_run(head).bold = True
    row = table.rows[1].cells
    row[0].text, row[1].text, row[2].text, row[3].text = "V0", fecha, descripcion, "Christian Farjat"


def add_outline(doc, sections):
    for heading, hint in sections:
        doc.add_heading(heading, level=1)
        p = doc.add_paragraph(hint)
        p.runs[0].italic = True
        p.runs[0].font.color.rgb = RGBColor(0x70, 0x70, 0x70)


def new_doc(codigo, titulo, fecha):
    doc = Document()
    add_cover(doc, codigo, titulo, fecha)
    add_change_history(doc, fecha)
    doc.add_page_break()
    return doc


def build_indice(cfg, fecha):
    doc = new_doc("00_INDICE", "Índice del Stack Documental ENTE", fecha)
    doc.add_heading("Registro documental", level=1)
    doc.add_paragraph(
        "Índice generado automáticamente desde config/dataroom.config.json. "
        "Lista los entregables del expediente interno por carpeta destino."
    )
    for carpeta, files in cfg["fileMapping"].items():
        doc.add_heading(carpeta, level=2)
        table = doc.add_table(rows=1, cols=3)
        table.style = "Light Grid Accent 1"
        for j, head in enumerate(["Código", "Título", "Archivo"]):
            table.rows[0].cells[j].paragraphs[0].add_run(head).bold = True
        for filename in files:
            code, titulo = parse_code(filename)
            cells = table.add_row().cells
            cells[0].text, cells[1].text, cells[2].text = code, titulo, filename

    # Backend (va como Google Sheet, no como binario en la carpeta).
    doc.add_heading("Backend (convertido a Google Sheet en Fase 3)", level=2)
    b = cfg["backend"]
    p = doc.add_paragraph()
    p.add_run("Fuente: ").bold = True
    p.add_run(b["sourceXlsx"])
    return "00_INDICE_Stack_Documental_ENTE.docx", doc


def build_arquitectura(fecha):
    doc = new_doc("MJM-FB-TI-PLA-001-V0", "Arquitectura del Stack Documental ENTE", fecha)
    add_outline(doc, [
        ("1. Propósito y alcance", "Objetivo del stack documental y qué cubre / qué no."),
        ("2. Estructura del dataroom", "Árbol de carpetas del Shared Drive y su racional (Expediente Interno, PDD, Base Habilitantes, Snapshots)."),
        ("3. Convención de códigos", "MJM-FB-<AREA>-<TIPO>-<NNN>-V<n>: significado de cada segmento."),
        ("4. Roles y niveles de acceso", "INTERNAL / VVB / BUYERS / AUDITOR y qué ve cada uno."),
        ("5. Flujo de aprobación y snapshots", "Del Draft al Approved for VVB; disparo del webhook y copia inmutable."),
        ("6. Backend AppSheet + Apps Script", "Tablas del backend, webhook y automatizaciones."),
        ("7. Seguridad y confidencialidad", "Repo privado, gitignore, manejo del WEBHOOK_TOKEN."),
        ("8. Anexos", "Diagramas, referencias, folder IDs."),
    ])
    return "MJM-FB-TI-PLA-001-V0_Arquitectura_Stack_Documental_ENTE.docx", doc


def build_gobernanza(fecha):
    doc = new_doc("MJM-FB-TI-PLA-002-V0", "Gobernanza del Dataroom", fecha)
    add_outline(doc, [
        ("1. Objeto", "Alcance de la gobernanza documental del dataroom."),
        ("2. Roles y responsabilidades", "RACI de los roles internos y externos (VVB, compradores, auditor)."),
        ("3. Matriz de accesos por rol", "Qué carpeta/documento puede ver/comentar/editar cada rol."),
        ("4. Ciclo de vida documental", "Estados (Draft, QA/QC, Approved for VVB, Shared, Verified) y transiciones."),
        ("5. Control de versiones", "Nomenclatura, versionado Vn y control de cambios."),
        ("6. Seguridad y confidencialidad", "Clasificación de la información y reglas de compartición externa."),
        ("7. Retención y archivo", "Política de retención y de snapshots inmutables."),
        ("8. Auditoría", "Uso de Audit_Log y trazabilidad de eventos."),
    ])
    return "MJM-FB-TI-PLA-002-V0_Dataroom_Gobernanza.docx", doc


def build_runbook_doc(fecha):
    doc = new_doc("MJM-FB-TI-IT-001-V0", "Dataroom — Deployment Runbook", fecha)
    add_outline(doc, [
        ("1. Precondiciones", "Cuenta Google, herramientas (git, python, clasp) y accesos."),
        ("2. Fase 0 — Entorno", "Verificación de herramientas y método de subida a Drive."),
        ("3. Fase 1 — Repo", "Versionado del stack (subcarpeta o repo propio)."),
        ("4. Fase 2 — Poblado del dataroom", "Subida de binarios y verificación de conteos (10 + 7)."),
        ("5. Fase 3 — Backend + Apps Script", "Conversión a Google Sheet, config y clasp push/deploy."),
        ("6. Pasos manuales", "Autorización de setupDataroom() y Bot de AppSheet."),
        ("Nota", "El detalle operativo vive en runbooks/DEPLOYMENT_RUNBOOK.md; este .docx es la versión de expediente."),
    ])
    return "MJM-FB-TI-IT-001-V0_Dataroom_Deployment_Runbook.docx", doc


def main():
    parser = argparse.ArgumentParser(description="Genera los .docx estructurales del stack ENTE.")
    parser.add_argument("--fecha", default=datetime.date.today().isoformat(),
                        help="Fecha de emisión AAAA-MM-DD (default: hoy).")
    args = parser.parse_args()

    cfg = load_config()
    os.makedirs(OUT_DIR, exist_ok=True)

    builders = [
        build_indice(cfg, args.fecha),
        build_arquitectura(args.fecha),
        build_gobernanza(args.fecha),
        build_runbook_doc(args.fecha),
    ]
    for name, doc in builders:
        path = os.path.join(OUT_DIR, name)
        doc.save(path)
        print(f"OK  {path}")
    print(f"    {len(builders)} documentos generados · fecha {args.fecha}")


if __name__ == "__main__":
    main()
