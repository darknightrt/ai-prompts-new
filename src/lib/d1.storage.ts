/**
 * Cloudflare D1 数据库存储实现
 * 仅在 Cloudflare Pages 环境下可用
 */

import { PromptItem, Category, Complexity } from './types';
import { 
  IStorage, 
  D1Database, 
  DbPromptRecord, 
  DbUserRecord 
} from './storage.types';

export class D1Storage implements IStorage {
  private db: D1Database;

  constructor() {
    // 从 Cloudflare Pages 环境获取 D1 数据库绑定
    const db = (process.env as unknown as { DB: D1Database }).DB;
    
    if (!db) {
      throw new Error(
        'D1 database is only available in Cloudflare Pages environment. ' +
        'Please ensure the D1 binding is configured correctly.'
      );
    }
    
    this.db = db;
  }

  /**
   * 将数据库记录转换为 PromptItem
   */
  private recordToPromptItem(record: DbPromptRecord): PromptItem {
    return {
      id: record.id,
      title: record.title,
      desc: record.description || undefined,
      prompt: record.prompt,
      category: record.category,
      complexity: record.complexity,
      type: record.type,
      icon: record.icon || undefined,
      image: record.image || undefined,
      isCustom: Boolean(record.is_custom),
      createdAt: new Date(record.created_at).getTime(),
    };
  }

  // ==================== 提示词操作 ====================

  /**
   * 获取所有提示词
   */
  async getAllPrompts(): Promise<PromptItem[]> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM prompts ORDER BY created_at DESC')
        .all<DbPromptRecord>();
      
      return (result.results || []).map(record => this.recordToPromptItem(record));
    } catch (error) {
      console.error('Failed to get all prompts:', error);
      return [];
    }
  }

  /**
   * 根据 ID 获取提示词
   */
  async getPromptById(id: string | number): Promise<PromptItem | null> {
    try {
      const record = await this.db
        .prepare('SELECT * FROM prompts WHERE id = ?')
        .bind(Number(id))
        .first<DbPromptRecord>();
      
      return record ? this.recordToPromptItem(record) : null;
    } catch (error) {
      console.error('Failed to get prompt by id:', error);
      return null;
    }
  }

  /**
   * 添加提示词
   */
  async addPrompt(
    prompt: Omit<PromptItem, 'id' | 'createdAt'>, 
    userId?: number
  ): Promise<PromptItem> {
    try {
      const now = new Date().toISOString();
      
      const result = await this.db
        .prepare(`
          INSERT INTO prompts (
            title, description, prompt, category, complexity, 
            type, icon, image, is_custom, user_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          prompt.title,
          prompt.desc || null,
          prompt.prompt,
          prompt.category,
          prompt.complexity || 'beginner',
          prompt.type,
          prompt.icon || null,
          prompt.image || null,
          prompt.isCustom ? 1 : 0,
          userId || null,
          now,
          now
        )
        .run();

      const newId = result.meta?.last_row_id || Date.now();
      
      return {
        ...prompt,
        id: newId,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error('Failed to add prompt:', error);
      throw error;
    }
  }

  /**
   * 更新提示词
   */
  async updatePrompt(id: string | number, data: Partial<PromptItem>): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: unknown[] = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title);
      }
      if (data.desc !== undefined) {
        updates.push('description = ?');
        values.push(data.desc);
      }
      if (data.prompt !== undefined) {
        updates.push('prompt = ?');
        values.push(data.prompt);
      }
      if (data.category !== undefined) {
        updates.push('category = ?');
        values.push(data.category);
      }
      if (data.complexity !== undefined) {
        updates.push('complexity = ?');
        values.push(data.complexity);
      }
      if (data.type !== undefined) {
        updates.push('type = ?');
        values.push(data.type);
      }
      if (data.icon !== undefined) {
        updates.push('icon = ?');
        values.push(data.icon);
      }
      if (data.image !== undefined) {
        updates.push('image = ?');
        values.push(data.image);
      }

      if (updates.length === 0) return true;

      updates.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(Number(id));

      const query = `UPDATE prompts SET ${updates.join(', ')} WHERE id = ?`;
      
      const result = await this.db
        .prepare(query)
        .bind(...values)
        .run();

      return result.success;
    } catch (error) {
      console.error('Failed to update prompt:', error);
      return false;
    }
  }

  /**
   * 批量删除提示词
   */
  async deletePrompts(ids: (string | number)[]): Promise<boolean> {
    try {
      if (ids.length === 0) return true;

      const placeholders = ids.map(() => '?').join(',');
      const numericIds = ids.map(id => Number(id));

      const result = await this.db
        .prepare(`DELETE FROM prompts WHERE id IN (${placeholders})`)
        .bind(...numericIds)
        .run();

      return result.success;
    } catch (error) {
      console.error('Failed to delete prompts:', error);
      return false;
    }
  }

  // ==================== 用户操作 ====================

  /**
   * 根据 ID 获取用户
   */
  async getUserById(id: number): Promise<DbUserRecord | null> {
    try {
      return await this.db
        .prepare('SELECT * FROM users WHERE id = ?')
        .bind(id)
        .first<DbUserRecord>();
    } catch (error) {
      console.error('Failed to get user by id:', error);
      return null;
    }
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<DbUserRecord | null> {
    try {
      return await this.db
        .prepare('SELECT * FROM users WHERE username = ?')
        .bind(username)
        .first<DbUserRecord>();
    } catch (error) {
      console.error('Failed to get user by username:', error);
      return null;
    }
  }

  /**
   * 创建用户
   */
  async createUser(
    username: string, 
    password: string, 
    role: string = 'user'
  ): Promise<DbUserRecord | null> {
    try {
      const now = new Date().toISOString();
      
      const result = await this.db
        .prepare(`
          INSERT INTO users (username, password, role, created_at) 
          VALUES (?, ?, ?, ?)
        `)
        .bind(username, password, role, now)
        .run();

      if (result.success) {
        return this.getUserByUsername(username);
      }
      return null;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  /**
   * 验证用户登录
   */
  async verifyUser(username: string, password: string): Promise<DbUserRecord | null> {
    try {
      const user = await this.db
        .prepare('SELECT * FROM users WHERE username = ? AND password = ?')
        .bind(username, password)
        .first<DbUserRecord>();
      
      return user;
    } catch (error) {
      console.error('Failed to verify user:', error);
      return null;
    }
  }

  // ==================== 初始化 ====================

  /**
   * 用静态数据初始化数据库
   */
  async initializeWithStaticData(prompts: PromptItem[]): Promise<void> {
    try {
      // 检查是否已有数据
      const existing = await this.db
        .prepare('SELECT COUNT(*) as count FROM prompts')
        .first<{ count: number }>();
      
      if (existing && existing.count > 0) {
        console.log('Database already has data, skipping initialization');
        return;
      }

      // 批量插入静态数据
      for (const prompt of prompts) {
        await this.addPrompt({
          title: prompt.title,
          desc: prompt.desc,
          prompt: prompt.prompt,
          category: prompt.category,
          complexity: prompt.complexity || 'beginner',
          type: prompt.type,
          icon: prompt.icon,
          image: prompt.image,
          isCustom: false,
        });
      }

      console.log(`Initialized database with ${prompts.length} prompts`);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
}
