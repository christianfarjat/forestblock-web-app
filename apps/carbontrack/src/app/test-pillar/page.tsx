import { PillarCard } from '@forestblock/ui/esg';

export default function TestPillar() {
  return (
    <div className="p-8">
      <h1>Testing PillarCard</h1>
      <PillarCard
        type="environmental"
        totalIndicators={15}
        completeness={87}
        status="on_track"
        highlights={[
          { label: 'Emissions', value: '1,240 tCO2e', trend: -8 }
        ]}
      />
    </div>
  );
}
