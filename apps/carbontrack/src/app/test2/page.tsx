import { esgOverviewData } from '@forestblock/data';

export default function Test2Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page 2</h1>
      <p>Data loaded: {esgOverviewData.organization}</p>
    </div>
  );
}
