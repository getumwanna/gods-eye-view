import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Globe2,
  LayoutDashboard,
  Moon,
  Settings2,
  Sun,
  X,
} from 'lucide-react';
import { branding } from '../../../src/custom/shared/branding.js';
import {
  getTheme,
  setTheme,
  subscribeTheme,
} from '../../../src/custom/shared/theme.js';
import { createGlobeUrl } from '../../../src/custom/shared/shareHandoff.js';
import { Button } from './ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';

const navigation = [
  { title: 'Globe', href: createGlobeUrl(), icon: Globe2, page: 'globe' },
  {
    title: 'Dashboard',
    href: '#/dashboard',
    icon: LayoutDashboard,
    page: 'dashboard',
  },
  { title: 'Library', href: '#/library', icon: BookOpen, page: 'library' },
  { title: 'Settings', href: '#/settings', icon: Settings2, page: 'settings' },
];

export function ThemeToggle() {
  const [theme, updateTheme] = useState(getTheme);
  useEffect(() => subscribeTheme(updateTheme), []);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </Button>
  );
}

function Navigation({ page }: { page: string }) {
  const { setOpenMobile, isMobile } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="gih-sidebar">
      <SidebarHeader className="gih-brand-header">
        <a
          href="#/dashboard"
          className="gih-brand"
          onClick={() => setOpenMobile(false)}
          aria-label={`${branding.name} home`}
        >
          <img src={branding.logo} alt="" className="gih-brand-mark" />
          <span className="gih-brand-copy">
            <strong>{branding.shortName}</strong>
            <span>LOCAL WORKSPACE</span>
          </span>
        </a>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            onClick={() => setOpenMobile(false)}
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="gih-sidebar-content">
        <p className="gih-nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.page}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.page === page ||
                    ([
                      'source',
                      'data-sources',
                      'knowledge',
                      'knowledge-article',
                      'library-search',
                    ].includes(page) &&
                      item.page === 'library')
                  }
                  tooltip={item.title}
                  className="gih-nav-button"
                >
                  <a
                    href={item.href}
                    aria-current={
                      item.page === page ||
                      ([
                        'source',
                        'data-sources',
                        'knowledge',
                        'knowledge-article',
                        'library-search',
                      ].includes(page) &&
                        item.page === 'library')
                        ? 'page'
                        : undefined
                    }
                    onClick={() => setOpenMobile(false)}
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.title}</span>
                    {item.page === 'globe' && (
                      <ArrowUpRight
                        className="gih-nav-external"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </nav>
      </SidebarContent>
      <SidebarFooter className="gih-sidebar-footer">
        <div className="gih-local-mark">
          <span aria-hidden="true" />
          LOCAL · PERSONAL USE
        </div>
        <p>Data may be delayed, modeled or wrong. Not for operational use.</p>
      </SidebarFooter>
    </Sidebar>
  );
}

function ShellHeader({ title }: { title: string }) {
  const { isMobile, openMobile, open } = useSidebar();
  return (
    <header className="gih-header">
      <div className="gih-header-start">
        <SidebarTrigger
          aria-label="Toggle navigation"
          aria-expanded={isMobile ? openMobile : open}
        />
        <span className="gih-header-divider" />
        <span className="gih-header-location">
          Workspace <span>/</span> <strong>{title}</strong>
        </span>
      </div>
      <div className="gih-header-actions">
        <ThemeToggle />
        <Button asChild size="sm" className="gih-open-globe">
          <a href={createGlobeUrl()} aria-label="Open globe">
            <Globe2 aria-hidden="true" />
            <span>Open globe</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </header>
  );
}

export function HubShell({
  page,
  title,
  children,
}: {
  page: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        className="gih-skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to main content
      </a>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '15.5rem',
            '--sidebar-width-icon': '4.25rem',
          } as React.CSSProperties
        }
      >
        <Navigation page={page} />
        <SidebarInset>
          <ShellHeader title={title} />
          <div id="main-content" tabIndex={-1} className="gih-page" key={title}>
            {children}
          </div>
          <footer className="gih-page-footer">
            <span>GEV FOUNDATION · PHASE 1</span>
            <span>Built on God's Eye View</span>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
