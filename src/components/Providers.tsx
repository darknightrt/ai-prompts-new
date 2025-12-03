"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { PromptProvider } from '../context/PromptContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { SiteConfigProvider } from '../context/SiteConfigContext';
import { FavoritesProvider } from '../context/FavoritesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <SiteConfigProvider>
          <AuthProvider>
            <FavoritesProvider>
              <PromptProvider>
                {children}
              </PromptProvider>
            </FavoritesProvider>
          </AuthProvider>
        </SiteConfigProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
