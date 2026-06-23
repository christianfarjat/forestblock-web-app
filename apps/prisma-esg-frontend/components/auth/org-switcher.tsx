'use client';

import { useState } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Modal } from '@/components/common/modal';

export function OrgSwitcher() {
  const { currentOrganization, organizations, selectOrganization } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Building2 size={20} />
        <span className="text-sm font-medium text-gray-700">
          {currentOrganization?.name || 'Select Organization'}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Switch Organization"
      >
        <div className="space-y-2">
          {organizations.map(membership => (
            <button
              key={membership.id}
              onClick={() => {
                selectOrganization(membership.organization!, membership.role);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentOrganization?.id === membership.organization?.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900">
                {membership.organization?.name}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {membership.role}
              </p>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
