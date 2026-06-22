import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EvidenceTable } from '../EvidenceTable';

describe('EvidenceTable', () => {
  const mockDocuments = [
    {
      id: 'doc_001',
      name: 'GHG Inventory Report 2024',
      indicator: 'Scope 1 Emissions',
      pillar: 'environmental' as const,
      type: 'PDF',
      version: 'v3.2',
      source: 'ForestScan MRV',
      validation: 'verified' as const,
      uploadedBy: 'A. Mendez',
      lastUpdated: '2026-06-15',
    },
    {
      id: 'doc_002',
      name: 'Supply Chain Emissions Survey',
      indicator: 'Scope 3 Emissions',
      pillar: 'environmental' as const,
      type: 'CSV',
      version: 'v0.8',
      source: 'Supplier Portal',
      validation: 'partial' as const,
      uploadedBy: 'L. Torres',
      lastUpdated: '2026-05-30',
    },
    {
      id: 'doc_003',
      name: 'Water Recycling Certificate',
      indicator: 'Water Recycled',
      pillar: 'environmental' as const,
      type: 'PDF',
      version: '—',
      source: 'Pending Upload',
      validation: 'missing' as const,
      uploadedBy: '—',
      lastUpdated: '—',
    },
  ];

  it('renders table headers', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('Indicator')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
  });

  it('renders all documents', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText('GHG Inventory Report 2024')).toBeInTheDocument();
    expect(screen.getByText('Supply Chain Emissions Survey')).toBeInTheDocument();
    expect(screen.getByText('Water Recycling Certificate')).toBeInTheDocument();
  });

  it('displays document indicators', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText('Scope 1 Emissions')).toBeInTheDocument();
    expect(screen.getByText('Scope 3 Emissions')).toBeInTheDocument();
    expect(screen.getByText('Water Recycled')).toBeInTheDocument();
  });

  it('displays file types', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getAllByText('PDF')).toHaveLength(2);
    expect(screen.getByText('CSV')).toBeInTheDocument();
  });

  it('shows version information', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText('v3.2')).toBeInTheDocument();
    expect(screen.getByText('v0.8')).toBeInTheDocument();
  });

  it('displays source/workflow', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText('ForestScan MRV')).toBeInTheDocument();
    expect(screen.getByText('Supplier Portal')).toBeInTheDocument();
    expect(screen.getByText('Pending Upload')).toBeInTheDocument();
  });

  it('shows validation status with icons', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Partial')).toBeInTheDocument();
    expect(screen.getByText('Missing')).toBeInTheDocument();
  });

  it('displays uploader and last updated date', () => {
    render(<EvidenceTable documents={mockDocuments} />);

    expect(screen.getByText(/Mendez/)).toBeInTheDocument();
    expect(screen.getByText(/Torres/)).toBeInTheDocument();
    expect(screen.getByText('2026-06-15')).toBeInTheDocument();
  });

  it('shows pillar tag with correct color', () => {
    const { container } = render(<EvidenceTable documents={mockDocuments} />);

    // Should have E, S, G tags (in this case only E for environmental)
    const pillarTags = container.querySelectorAll('[class*="bg-"][class*="-soft"]');
    expect(pillarTags.length).toBeGreaterThan(0);
  });

  it('displays title when provided', () => {
    render(
      <EvidenceTable
        documents={mockDocuments}
        title="Supporting Documents"
      />
    );

    expect(screen.getByText('Supporting Documents')).toBeInTheDocument();
  });

  it('renders with empty documents', () => {
    const { container } = render(<EvidenceTable documents={[]} />);

    expect(container.querySelector('tbody')).toBeEmptyDOMElement();
  });
});
