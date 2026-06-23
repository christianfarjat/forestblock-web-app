'use client';

import { useAuth } from '@/hooks/use-auth';
import { OrgSwitcher } from '@/components/auth/org-switcher';
import { Button } from '@/components/common/button';
import { Leaf, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Prisma ESG</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <OrgSwitcher />
            <div className="border-l border-gray-200 pl-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.display_name || user?.email}
                  </p>
                </div>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <OrgSwitcher />
            <Button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
