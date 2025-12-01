/**
 * 存储层类型定义
 * 支持多种存储方式：localStorage、D1
 */

import { PromptItem, Category, Complexity } from './types';

// D1 数据库类型定义
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1Result>;
}

export interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: {
    changes: number;
    last_row_id: number;
  };
}

// 数据库中的提示词记录
export interface DbPromptRecord {
  id: number;
  title: string;
  description: string | null;
  prompt: string;
  category: Category;
  complexity: Complexity;
  type: 'icon' | 'image';
  icon: string | null;
  image: string | null;
  is_custom: number; // SQLite boolean
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

// 数据库中的用户记录
export interface DbUserRecord {
  id: number;
  username: string;
  password: string;
  role: 'guest' | 'user' | 'admin';
  avatar: string | null;
  created_at: string;
}

// 存储接口定义
export interface IStorage {
  // 提示词操作
  getAllPrompts(): Promise<PromptItem[]>;
  getPromptById(id: string | number): Promise<PromptItem | null>;
  addPrompt(prompt: Omit<PromptItem, 'id' | 'createdAt'>, userId?: number): Promise<PromptItem>;
  updatePrompt(id: string | number, data: Partial<PromptItem>): Promise<boolean>;
  deletePrompts(ids: (string | number)[]): Promise<boolean>;
  
  // 用户操作
  getUserById(id: number): Promise<DbUserRecord | null>;
  getUserByUsername(username: string): Promise<DbUserRecord | null>;
  createUser(username: string, password: string, role: string): Promise<DbUserRecord | null>;
  verifyUser(username: string, password: string): Promise<DbUserRecord | null>;
  
  // 初始化
  initializeWithStaticData?(prompts: PromptItem[]): Promise<void>;
}

// 存储类型
export type StorageType = 'localstorage' | 'd1';

// 环境变量配置
export const STORAGE_TYPE: StorageType = 
  (process.env.NEXT_PUBLIC_STORAGE_TYPE as StorageType) || 'localstorage';

// 判断是否使用服务端存储
export const isServerStorage = () => STORAGE_TYPE === 'd1';
