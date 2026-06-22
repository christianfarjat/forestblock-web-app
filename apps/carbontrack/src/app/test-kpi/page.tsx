import { KPIWidget } from '@forestblock/ui/esg';

export default function TestKPI() {
  return (
    <div className="p-8">
      <h1>Testing KPIWidget</h1>
      <KPIWidget
        label="Test"
        value={1000}
        unit="tCO2e"
        status="on_track"
      />
    </div>
  );
}
