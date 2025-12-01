"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SiteConfig {
  homeTitle: string;
  typewriterTexts: string[];
  announcement: {
    enabled: boolean;
    title: string;
    content: string;
  };
  // 新增提示词页面配置
  promptsPage: {
    title: string;
    description: string;
  };
}

const DEFAULT_CONFIG: SiteConfig = {
  homeTitle: "掌握与AI对话的<br/>",
  typewriterTexts: ["终极艺术", "顶级技巧", "思维能力"],
  announcement: {
    enabled: true,
    title: "🎉 欢迎来到 PromptMaster",
    content: "这是一个全新的 AI 提示词管理平台。现在支持管理员在线编辑所有内容！"
  },
  // 默认值匹配需求
  promptsPage: {
    title: "提示词指南",
    description: "发现复制高质量的ai提示词，高效完成你的ai创意"
  }
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('site_config');
    if (stored) {
      try {
        // Deep merge logic might be needed for production, but simplistic spread works for top level additions if we handle defaults carefully.
        // Here we ensure new fields exist even if old config is loaded
        const loadedConfig = JSON.parse(stored);
        setConfig({
            ...DEFAULT_CONFIG,
            ...loadedConfig,
            promptsPage: { ...DEFAULT_CONFIG.promptsPage, ...(loadedConfig.promptsPage || {}) }
        });
      } catch (e) {
        console.error("Failed to load site config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('site_config', JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return context;
};