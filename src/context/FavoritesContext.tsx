"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Set<string | number>;
  isFavorite: (promptId: string | number) => boolean;
  toggleFavorite: (promptId: string | number) => void;
  getFavoriteCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const STORAGE_KEY = 'user_favorites_v1';

  // 加载当前用户的收藏
  useEffect(() => {
    if (isLoggedIn && user) {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        try {
          const allFavorites = JSON.parse(storedFavorites);
          const userFavorites = allFavorites[user.username] || [];
          setFavorites(new Set(userFavorites));
        } catch (e) {
          console.error('Failed to load favorites:', e);
          setFavorites(new Set());
        }
      }
    } else {
      // 未登录时清空收藏
      setFavorites(new Set());
    }
  }, [user, isLoggedIn]);

  // 保存收藏到 localStorage
  const saveFavorites = useCallback((newFavorites: Set<string | number>) => {
    if (!user) return;
    
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      const allFavorites = storedFavorites ? JSON.parse(storedFavorites) : {};
      allFavorites[user.username] = Array.from(newFavorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allFavorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [user]);

  // 检查是否收藏
  const isFavorite = useCallback((promptId: string | number) => {
    return favorites.has(String(promptId));
  }, [favorites]);

  // 切换收藏状态
  const toggleFavorite = useCallback((promptId: string | number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      const id = String(promptId);
      
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  // 获取收藏数量
  const getFavoriteCount = useCallback(() => {
    return favorites.size;
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isFavorite,
      toggleFavorite,
      getFavoriteCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
