'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/revenue', label: 'Revenue', icon: '💰' },
    { href: '/dashboard/customers', label: 'Customers', icon: '👥' },
    { href: '/dashboard/inventory', label: 'Inventory', icon: '📦' },
    { href: '/dashboard/reports', label: 'Reports', icon: '📈' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">Analytics</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title={mounted ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle theme'}
              >
                {mounted ? (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />) : <Moon size={20} className="opacity-0" />}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 fixed md:static left-0 top-16 md:top-0 z-30 w-64 h-[calc(100vh-4rem)] md:h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out flex flex-col`}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-sidebar-foreground">Dashboard</h2>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Business Analytics</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom user section */}
            <div className="border-t border-sidebar-border p-4 space-y-3">
              <div className="px-2">
                <p className="text-sm text-sidebar-foreground/60">Logged in as</p>
                <p className="font-semibold text-sidebar-foreground truncate">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 top-16 bg-black/50 z-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {/* Top Navigation */}
            <nav className="hidden md:flex sticky top-0 z-20 h-16 items-center justify-between border-b border-border bg-card px-6">
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title={mounted ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle theme'}
                >
                  {mounted ? (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />) : <Moon size={20} className="opacity-0" />}
                </button>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </nav>

            {/* Page Content */}
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}
