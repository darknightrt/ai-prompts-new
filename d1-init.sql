-- ================================================================================
-- AI Prompts Mini - D1 数据库初始化脚本
-- 执行方式：在 Cloudflare D1 控制台中运行此脚本
-- ================================================================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('guest', 'user', 'admin')),
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 提示词表
CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('code', 'mj', 'writing', 'roleplay', 'business', 'custom', 'all')),
    complexity TEXT DEFAULT 'beginner' CHECK(complexity IN ('beginner', 'intermediate', 'advanced')),
    type TEXT NOT NULL CHECK(type IN ('icon', 'image')),
    icon TEXT,
    image TEXT,
    is_custom INTEGER DEFAULT 0,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prompt_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, prompt_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
);

-- 使用记录表（可选，用于统计热门提示词）
CREATE TABLE IF NOT EXISTS usage_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    prompt_id INTEGER NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('view', 'copy', 'use')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_complexity ON prompts(complexity);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_custom ON prompts(is_custom);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_prompt_id ON usage_records(prompt_id);

-- 插入默认管理员账号（密码需要在部署时修改）
-- 注意：生产环境请使用环境变量配置管理员账号
INSERT OR IGNORE INTO users (username, password, role) 
VALUES ('admin', 'admin123', 'admin');

-- ================================================================================
-- 初始化完成
-- ================================================================================
