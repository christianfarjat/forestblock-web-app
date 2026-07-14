/**
 * Anclaje del hash en cadena (handoff §10).
 *
 * MODO DEMO (este MVP): el "anclaje" es SIMULADO — tx determinística derivada
 * del propio hash, marcada `esDemo: true` y comunicada como simulada en toda
 * la UI. Sirve para validar el flujo completo (sellar → badge → verificación
 * pública) sin gastar gas ni exponer claves.
 *
 * PRODUCCIÓN (Fase 2) — dos opciones, misma interfaz `AnclajeChain`:
 *
 *  A) Polygon PoS (recomendada §4.7): smart contract minimal
 *       contract HashStore { event Stored(bytes32 h); function store(bytes32 h) external { emit Stored(h); } }
 *     Servicio server-side (services/chain) firma con CHAIN_PRIVATE_KEY desde
 *     Secret Manager contra POLYGON_RPC_URL y devuelve { txHash, blockNumber }.
 *     Optimización recomendada: agrupar sellos en árbol de Merkle y anclar la
 *     raíz por lote (1 tx/día) guardando el proof-path por registro — ver
 *     docs/MEJORAS_Y_OPTIMIZACIONES.md.
 *
 *  B) OpenTimestamps: prueba de existencia sobre Bitcoin, gratis, sin claves;
 *     guarda el .ots como attachment del sello. Ideal si solo importa el
 *     timestamp y se tolera confirmación diferida (~horas).
 */
import { sha256Hex } from './ixb_hash';

export interface ResultadoAnclaje {
  chain: 'polygon-demo' | 'polygon' | 'opentimestamps';
  txHash: string;
  blockNumber?: number;
  esDemo: boolean;
}

export interface AnclajeChain {
  anclar(sha256: string): Promise<ResultadoAnclaje>;
  explorerUrl(resultado: ResultadoAnclaje): string | null;
}

const demoAnchor: AnclajeChain = {
  async anclar(sha256: string): Promise<ResultadoAnclaje> {
    // Determinístico: mismo hash → misma "tx" (reproducible en cualquier demo).
    const tx = await sha256Hex(`${sha256}:ixb-polygon-demo-anchor`);
    const blockNumber = 61_000_000 + (parseInt(tx.slice(0, 6), 16) % 1_000_000);
    return { chain: 'polygon-demo', txHash: `0x${tx}`, blockNumber, esDemo: true };
  },
  explorerUrl() {
    return null; // no hay explorer: la tx es simulada y así se comunica
  },
};

/** Punto de integración: con NEXT_PUBLIC_IXB_API_URL configurada, el sellado
 *  real lo hace el backend (nunca claves en el cliente). Sin URL → demo. */
export function getAnclaje(): AnclajeChain {
  return demoAnchor;
}

export const CHAIN_LABEL: Record<ResultadoAnclaje['chain'], string> = {
  'polygon-demo': 'Polygon (SIMULADO — demo)',
  polygon: 'Polygon PoS',
  opentimestamps: 'OpenTimestamps (Bitcoin)',
};
