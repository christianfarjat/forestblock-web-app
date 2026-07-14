'use client';

/**
 * Verificación pública de sellos (§10): recalcula el SHA-256 del contenido
 * canónico y lo compara con el hash anclado en cadena. No requiere cuenta.
 * A la cadena solo va el hash — nunca datos personales (§13).
 *
 * En el MVP el anclaje es SIMULADO (esDemo): la "tx" se deriva
 * determinísticamente del hash, así el flujo completo es verificable
 * sin gas. Con el servicio real (Polygon/OpenTimestamps) esta página
 * consulta la cadena vía GET /api/v1/sellos/:sha256.
 */
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Banner,
  Boton,
  Card,
  Cargando,
  Field,
  inputCls,
  SectionTitle,
} from '@/components/common/ui';
import { getAnclaje } from '@/lib/ixb_chain';
import { canonicalJson, sha256Hex } from '@/lib/ixb_hash';
import { nombrePersona, useIxbState } from '@/lib/ixb_store';
import type { HashStamp } from '@/lib/ixb_types';
import { CHAIN_LABEL } from '@/lib/ixb_chain';

export default function PaginaVerificar() {
  return (
    <Suspense fallback={<Cargando />}>
      <Verificador />
    </Suspense>
  );
}

interface Resultado {
  ok: boolean;
  shaCalculado: string;
  stamp: HashStamp | null;
  detalle: string;
}

function Verificador() {
  const s = useIxbState();
  const params = useSearchParams();
  const [selloId, setSelloId] = useState(params.get('sello') ?? '');
  const [pegado, setPegado] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [verificando, setVerificando] = useState(false);

  const verificarSello = useCallback(
    async (stamp: HashStamp) => {
      setVerificando(true);
      try {
        // 1. Recalcular el hash del contenido canónico sellado.
        const sha = await sha256Hex(stamp.payloadCanonico);
        // 2. "Consultar la cadena": en demo la tx se re-deriva del hash.
        const anclaje = await getAnclaje().anclar(sha);
        const okSha = sha === stamp.sha256;
        const okTx = anclaje.txHash === stamp.txHash;
        setResultado({
          ok: okSha && okTx,
          shaCalculado: sha,
          stamp,
          detalle: okSha
            ? okTx
              ? 'El hash recalculado coincide con el sello y con la transacción anclada: el contenido no fue alterado desde el sellado.'
              : 'El hash coincide con el sello pero no con la transacción anclada.'
            : 'El hash recalculado NO coincide: el contenido fue modificado después del sellado.',
        });
      } finally {
        setVerificando(false);
      }
    },
    []
  );

  // Verificación directa al llegar con ?sello=…
  useEffect(() => {
    if (!s.listo || !selloId) return;
    const stamp = s.stamps.find((st) => st.id === selloId);
    if (stamp) void verificarSello(stamp);
  }, [s.listo, selloId, s.stamps, verificarSello]);

  async function verificarPegado() {
    setVerificando(true);
    try {
      let sha = '';
      const texto = pegado.trim();
      if (/^[0-9a-f]{64}$/i.test(texto)) {
        sha = texto.toLowerCase();
      } else {
        const canonico = canonicalJson(JSON.parse(texto));
        sha = await sha256Hex(canonico);
      }
      const stamp = s.stamps.find((st) => st.sha256 === sha) ?? null;
      setResultado({
        ok: !!stamp,
        shaCalculado: sha,
        stamp,
        detalle: stamp
          ? 'Existe un sello anclado para este contenido: es exactamente el que se verificó.'
          : 'No hay ningún sello para este contenido: o fue alterado, o nunca se selló.',
      });
    } catch {
      setResultado({
        ok: false,
        shaCalculado: '',
        stamp: null,
        detalle: 'No se pudo interpretar lo pegado: pegá el JSON del payload o un SHA-256 (64 hex).',
      });
    } finally {
      setVerificando(false);
    }
  }

  if (!s.listo) return <Cargando />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-medium">🔎 Verificación pública de integridad</h1>
        <p className="mt-1 text-sm text-brandGrey">
          Cuando un registro o reporte pasa a <strong>Verificado/Auditado</strong>, su contenido se
          serializa de forma canónica, se calcula su <strong>SHA-256</strong> y ese hash se ancla en
          una cadena pública. Acá cualquiera puede repetir el cálculo y compararlo — sin cuenta.
        </p>
      </div>

      <Banner tone="warn">
        <strong>Demo:</strong> el anclaje de esta versión es <strong>simulado</strong> (la
        transacción se deriva del propio hash, sin blockchain real). En producción: contrato mínimo{' '}
        <code>store(bytes32)</code> en Polygon PoS o prueba OpenTimestamps sobre Bitcoin.
      </Banner>

      <Card>
        <SectionTitle sub="Elegí un sello de la demo, o pegá el contenido/hash que te compartieron.">
          Verificar
        </SectionTitle>
        <div className="space-y-4">
          <Field label={`Sello (${s.stamps.length} emitidos en la demo)`}>
            <select
              className={inputCls}
              value={selloId}
              onChange={(e) => {
                setSelloId(e.target.value);
                setResultado(null);
              }}
            >
              <option value="">— elegir un sello —</option>
              {s.stamps.slice(0, 400).map((st) => (
                <option key={st.id} value={st.id}>
                  {st.targetType === 'reporte' ? '📑' : '📄'} {st.targetId} · {st.id.endsWith('auditado') ? 'auditado' : st.targetType === 'reporte' ? 'reporte' : 'verificado'}
                </option>
              ))}
            </select>
          </Field>

          <div className="text-center text-xs uppercase tracking-wide text-brandGrey">— o —</div>

          <Field label="Pegar payload JSON o hash SHA-256">
            <textarea
              className={`${inputCls} font-mono text-xs`}
              rows={4}
              value={pegado}
              onChange={(e) => setPegado(e.target.value)}
              placeholder='{"tipo":"registro", …}  ó  3fa1bc…(64 hex)'
            />
          </Field>
          <Boton onClick={verificarPegado} disabled={!pegado.trim() || verificando}>
            {verificando ? 'Verificando…' : 'Verificar contenido pegado'}
          </Boton>
        </div>
      </Card>

      {resultado && (
        <Card className={resultado.ok ? 'border-2 border-verified' : 'border-2 border-customRed'}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{resultado.ok ? '✅' : '❌'}</span>
            <div>
              <div className="text-lg font-medium">
                {resultado.ok ? 'Íntegro — coincide con el sello' : 'No coincide'}
              </div>
              <p className="text-sm text-filtersGray">{resultado.detalle}</p>
            </div>
          </div>

          {resultado.shaCalculado && (
            <div className="mt-4 space-y-1 text-xs">
              <div>
                <span className="text-brandGrey">SHA-256 recalculado: </span>
                <code className="break-all">{resultado.shaCalculado}</code>
              </div>
              {resultado.stamp && (
                <>
                  <div>
                    <span className="text-brandGrey">SHA-256 sellado: </span>
                    <code className="break-all">{resultado.stamp.sha256}</code>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <span>
                      <span className="text-brandGrey">Cadena: </span>
                      {CHAIN_LABEL[resultado.stamp.chain]}
                    </span>
                    <span>
                      <span className="text-brandGrey">Tx: </span>
                      <code>{resultado.stamp.txHash.slice(0, 22)}…</code>
                    </span>
                    {resultado.stamp.blockNumber && (
                      <span>
                        <span className="text-brandGrey">Bloque: </span>
                        {resultado.stamp.blockNumber}
                      </span>
                    )}
                    <span>
                      <span className="text-brandGrey">Sellado: </span>
                      {new Date(resultado.stamp.timestamp).toLocaleString('es-AR')} por{' '}
                      {nombrePersona(s, resultado.stamp.signer)}
                    </span>
                    {resultado.stamp.esDemo && <Badge tone="declared">anclaje simulado (demo)</Badge>}
                  </div>
                </>
              )}
            </div>
          )}

          {resultado.stamp && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-brandGrey">
                Ver contenido sellado (payload canónico)
              </summary>
              <pre className="custom-scrollbar mt-2 max-h-64 overflow-auto rounded-cardSm bg-backgroundGray p-3 text-[11px]">
                {JSON.stringify(JSON.parse(resultado.stamp.payloadCanonico), null, 2)}
              </pre>
            </details>
          )}
        </Card>
      )}

      <Card>
        <SectionTitle>¿Cómo funciona?</SectionTitle>
        <ol className="list-inside list-decimal space-y-1 text-sm text-filtersGray">
          <li>
            El contenido verificado se serializa en <strong>JSON canónico</strong> (claves
            ordenadas, sin espacios) — mismo contenido, mismos bytes.
          </li>
          <li>
            Se calcula el <strong>SHA-256</strong>: cualquier cambio (un decimal, una coma) produce
            un hash totalmente distinto.
          </li>
          <li>
            El hash se ancla en cadena pública (<code>store(bytes32)</code> en Polygon, u
            OpenTimestamps). La transacción prueba <em>qué</em> existía y <em>cuándo</em>.
          </li>
          <li>Esta página repite 1–2 y compara con 3. Si coincide, nadie tocó el dato.</li>
        </ol>
      </Card>
    </div>
  );
}
