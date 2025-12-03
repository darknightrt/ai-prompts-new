export type Category = 'code' | 'mj' | 'writing' | 'roleplay' | 'business' | 'custom' | 'all';

export type Complexity = 'beginner' | 'intermediate' | 'advanced';

export interface PromptItem {
  id: number | string;
  title: string;
  desc?: string;
  prompt: string;
  category: Category;
  complexity?: Complexity; // 新增复杂度字段
  type: 'icon' | 'image';
  icon?: string; // FontAwesome class, e.g., "fa-solid fa-robot"
  image?: string;
  isCustom?: boolean; // 区分是系统预置还是用户创建
  createdAt?: number;
  isFavorite?: boolean; // 收藏状态
}
