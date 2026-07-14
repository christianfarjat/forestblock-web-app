'use client';

/**
 * Tab de acceso al módulo IntegrityX Barrio desde la app ForestBlock.
 *
 * El módulo corre como app propia (apps/integrityx-barrio) y se habilita
 * configurando NEXT_PUBLIC_IXB_URL con la URL desplegada (ver
 * apps/integrityx-barrio/docs/PRODUCCION.md). Sin la variable, esta página
 * presenta el módulo y muestra el acceso como "en habilitación".
 */
import { MdOutlineHolidayVillage } from 'react-icons/md';

const IXB_URL = process.env.NEXT_PUBLIC_IXB_URL ?? '';

const SUPERFICIES = [
  {
    icono: '🏡',
    titulo: 'Portal Residente',
    desc: 'Cada propietario carga los datos de su vivienda en minutos, con lenguaje simple, y ve su huella explicada.',
  },
  {
    icono: '📊',
    titulo: 'Backoffice Gestión',
    desc: 'Comité, consorcio y administración: dashboards del barrio, metas, estándares (EDGE · ISO 14064 · SITES) y comunicación.',
  },
  {
    icono: '🔬',
    titulo: 'Backoffice Técnico',
    desc: 'Verificación de evidencia, inventario ISO 14064-1, factores con fuente, expediente de certificación y sellado.',
  },
];

const PASOS_INTEGRIDAD = [
  { n: '1', t: 'Estados del dato', d: 'Declarado → Verificado → Auditado, con doble control.' },
  { n: '2', t: 'Hash SHA-256', d: 'Cada registro verificado se serializa y se hashea.' },
  { n: '3', t: 'Anclaje en cadena', d: 'Solo el hash va a blockchain — nunca datos personales.' },
  { n: '4', t: 'Verificación pública', d: 'Cualquiera puede comprobar la integridad, sin cuenta.' },
];

export default function IntegrityXBarrioAccess() {
  const habilitado = IXB_URL.length > 0;

  return (
    <div className="min-h-screen bg-backgroundGray px-4 py-8 font-aeonik text-forestGreen md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero */}
        <section className="rounded-3xl bg-forestGreen p-8 text-customWhite md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-mintGreen px-3 py-1 text-xs font-medium text-forestGreen">
              Módulo IntegrityX
            </span>
            <span className="rounded-full border border-customWhite/30 px-3 py-1 text-xs text-customWhite/80">
              MRV de barrios de viviendas sustentables
            </span>
          </div>
          <div className="mt-5 flex items-start gap-4">
            <span className="hidden rounded-2xl bg-mintGreen/15 p-3 text-mintGreen md:block">
              <MdOutlineHolidayVillage size={40} />
            </span>
            <div>
              <h1 className="text-3xl font-medium leading-tight md:text-4xl">
                IntegrityX <span className="text-mintGreen">Barrio</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-customWhite/85 md:text-base">
                Medición, monitoreo y preparación de certificación de sustentabilidad para barrios:
                cada vivienda carga sus variables, el barrio se evalúa en conjunto (huella ISO
                14064-1, KPIs, adecuación a estándares) y los datos verificados se sellan con hash
                en blockchain. La app <strong>no certifica</strong>: prepara el expediente para un
                certificador tercero.
              </p>
              <p className="mt-3 text-xs text-customWhite/60">
                Tres Pinos · Laguna de las Pampas · Chacras de San Andrés — MJM Inversiones
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {habilitado ? (
              <>
                <a
                  href={IXB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-mintGreen px-6 py-3 text-sm font-medium text-forestGreen transition-colors hover:bg-sageGreen"
                >
                  Abrir IntegrityX Barrio →
                </a>
                <a
                  href={`${IXB_URL.replace(/\/$/, '')}/verificar`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-customWhite/40 px-6 py-3 text-sm text-customWhite transition-colors hover:bg-white/10"
                >
                  🔎 Verificación pública de sellos
                </a>
              </>
            ) : (
              <>
                <span className="cursor-not-allowed rounded-full bg-customWhite/20 px-6 py-3 text-sm text-customWhite/60">
                  Abrir IntegrityX Barrio →
                </span>
                <span className="text-xs text-customWhite/70">
                  Módulo en habilitación — se activa configurando{' '}
                  <code className="rounded bg-black/30 px-1.5 py-0.5">NEXT_PUBLIC_IXB_URL</code>{' '}
                  (ver <code className="rounded bg-black/30 px-1.5 py-0.5">apps/integrityx-barrio/docs/PRODUCCION.md</code>).
                </span>
              </>
            )}
          </div>
        </section>

        {/* Superficies */}
        <section className="grid gap-4 md:grid-cols-3">
          {SUPERFICIES.map((s) => (
            <div key={s.titulo} className="rounded-3xl border border-borderGray bg-white p-6">
              <div className="text-3xl">{s.icono}</div>
              <h2 className="mt-2 text-lg font-medium">{s.titulo}</h2>
              <p className="mt-1 text-sm leading-relaxed text-filtersGray">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* Integridad */}
        <section className="rounded-3xl border border-borderGray bg-white p-6 md:p-8">
          <h2 className="text-lg font-medium">Integridad de punta a punta</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS_INTEGRIDAD.map((p) => (
              <div key={p.n} className="rounded-2xl bg-backgroundGray p-4">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-forestGreen text-xs font-medium text-mintGreen">
                  {p.n}
                </span>
                <div className="mt-2 text-sm font-medium">{p.t}</div>
                <p className="mt-1 text-xs leading-relaxed text-filtersGray">{p.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-customGray">
            Todo dato exhibe su estado de verificación y todo factor de emisión cita su fuente. La
            certificación la emite un tercero acreditado.
          </p>
        </section>
      </div>
    </div>
  );
}
