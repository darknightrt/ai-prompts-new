import { NextRequest, NextResponse } from 'next/server';
import { getStorage, DbManager } from '@/lib/db';
import { STORAGE_TYPE } from '@/lib/storage.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    // 根据存储类型获取用户数量
    if (STORAGE_TYPE === 'd1') {
      const storage = getStorage();
      if (!storage) {
        return NextResponse.json({ error: '存储不可用' }, { status: 500 });
      }
      
      // 直接使用 D1 数据库查询
      const db = (process.env as unknown as { DB: any }).DB;
      if (!db) {
        return NextResponse.json({ error: 'D1 数据库不可用' }, { status: 500 });
      }
      
      const result = await db.prepare('SELECT COUNT(*) as count FROM users').first();
      return NextResponse.json({ count: result?.count || 0 });
    } else {
      // localStorage 模式，返回模拟数据
      // 在实际应用中，localStorage 模式下用户数据存储在客户端
      return NextResponse.json({ count: 0 });
    }
  } catch (error) {
    console.error('Failed to get user count:', error);
    return NextResponse.json({ error: '获取用户数量失败' }, { status: 500 });
  }
}
