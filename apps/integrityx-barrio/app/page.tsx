'use client';

/**
 * Inicio — presenta el módulo (habilitable dentro de IntegrityX) y las tres
 * superficies del §2. El selector de personas simula el SSO: cada persona
 * demuestra el RBAC y el scoping por barrio/vivienda.
 */
import Link from 'next/link';
import { superficiesDe } from '@/lib/ixb_rbac';
import { modoDatos } from '@/lib/ixb_api';
import { personaActual, setPersonaActual, useIxbState } from '@/lib/ixb_store';
import { ROL_LABEL } from '@/lib/ixb_types';
import { Badge, Boton, Card, Cargando, cx, SectionTitle } from '@/components/common/ui';

const SUPERFICIES = [
  {
    id: 'residente' as const,
    href: '/residente',
    icono: '🏡',
    titulo: 'Portal Residente',
    quien: 'Propietarios y familias',
    desc: 'Cargá los datos de tu casa en minutos, mirá tu huella explicada simple y sumate a las metas del barrio.',
  },
  {
    id: 'gestion' as const,
    href: '/gestion',
    icono: '📊',
    titulo: 'Backoffice Gestión',
    quien: 'Comité · Consorcio · Administración · Desarrollador',
    desc: 'Dashboards del barrio y multi-barrio, viviendas, metas, cuestionario de estándares y comunicación.',
  },
  {
    id: 'tecnico' as const,
    href: '/tecnico',
    icono: '🔬',
    titulo: 'Backoffice Técnico',
    quien: 'ForestBlock · Verificador externo',
    desc: 'Revisión de evidencia, estados Declarado→Verificado→Auditado, inventario ISO 14064, factores, expediente y sellado.',
  },
];

export default function Inicio() {
  const s = useIxbState();
  const persona = personaActual(s);

  if (!s.listo) return <Cargando />;

  const habilitadas = persona ? superficiesDe(persona.rol) : [];

  return (
    <div className="space-y-8">
      <Card className="bg-forest !text-cream">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="lime">Módulo IntegrityX</Badge>
              <Badge tone="declared">MODO DEMO — datos locales de ejemplo</Badge>
              {modoDatos() === 'demo' ? null : <Badge tone="verified">API conectada</Badge>}
            </div>
            <h1 className="text-2xl font-medium leading-snug md:text-3xl">
              Medición, monitoreo y preparación de certificación para{' '}
              <span className="text-limeBright">barrios de viviendas sustentables</span>
            </h1>
            <p className="max-w-2xl text-sm text-cream/80">
              Cada vivienda carga sus variables; el barrio se evalúa en conjunto: huella de carbono
              (ISO 14064-1 / GHG Protocol), KPIs y adecuación a estándares. Los registros
              verificados se sellan con hash en blockchain para integridad y trazabilidad. La app{' '}
              <strong>no certifica</strong>: prepara el expediente para un certificador tercero.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-cream/70">
              <span>Tres Pinos</span>·<span>Laguna de las Pampas</span>·
              <span>Chacras de San Andrés</span>·<span>MJM Inversiones</span>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-3 text-center md:grid-cols-1">
            <div>
              <div className="text-3xl font-medium text-limeBright">{s.barrios.length}</div>
              <div className="text-xs text-cream/70">barrios</div>
            </div>
            <div>
              <div className="text-3xl font-medium text-limeBright">{s.viviendas.length}</div>
              <div className="text-xs text-cream/70">viviendas</div>
            </div>
            <div>
              <div className="text-3xl font-medium text-limeBright">{s.registros.length}</div>
              <div className="text-xs text-cream/70">registros</div>
            </div>
          </div>
        </div>
      </Card>

      <section>
        <SectionTitle sub="Elegí una persona para recorrer la demo — el acceso replica el RBAC real (un residente solo ve su vivienda).">
          ¿Quién sos hoy? <span className="text-brandGrey">(SSO IntegrityX simulado)</span>
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.personas.map((p) => {
            const activa = p.id === s.personaActualId;
            const barrio = s.barrios.find((b) => b.id === p.barrioId)?.nombre ?? 'Multi-barrio';
            return (
              <button
                key={p.id}
                onClick={() => setPersonaActual(p.id)}
                className={cx(
                  'rounded-cardSm border p-4 text-left transition-all',
                  activa
                    ? 'border-forest bg-limeSoft/60 shadow-card'
                    : 'border-borderGray bg-white hover:border-forest'
                )}
              >
                <div className="font-medium text-forest">{p.nombre}</div>
                <div className="text-xs text-brandGrey">{ROL_LABEL[p.rol]}</div>
                <div className="mt-1 text-xs text-moss">
                  {barrio}
                  {p.viviendaId ? ` · vivienda ${s.viviendas.find((v) => v.id === p.viviendaId)?.lote}` : ''}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle>Tres superficies, una sola fuente de datos</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {SUPERFICIES.map((sup) => {
            const disponible = habilitadas.includes(sup.id);
            return (
              <Card key={sup.id} className={cx(!disponible && 'opacity-60')}>
                <div className="text-3xl">{sup.icono}</div>
                <h3 className="mt-2 font-medium text-forest">{sup.titulo}</h3>
                <div className="text-xs text-brandGrey">{sup.quien}</div>
                <p className="mt-2 min-h-16 text-sm text-filtersGray">{sup.desc}</p>
                {disponible ? (
                  <Link href={sup.href}>
                    <Boton variant="secondary" size="sm">
                      Entrar →
                    </Boton>
                  </Link>
                ) : (
                  <p className="text-xs italic text-brandGrey">
                    No disponible para {persona ? ROL_LABEL[persona.rol] : 'esta persona'} — cambiá
                    de persona para verla.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <SectionTitle sub="Cualquiera puede comprobar que un registro o reporte sellado no fue alterado — sin cuenta y sin exponer datos personales (a la cadena solo va el hash).">
          🔎 Verificación pública de sellos
        </SectionTitle>
        <Link href="/verificar">
          <Boton variant="ghost" size="sm">
            Abrir verificador de integridad →
          </Boton>
        </Link>
      </Card>
    </div>
  );
}
