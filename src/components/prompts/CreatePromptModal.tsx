"use client";

import React, { useState, useEffect } from 'react';
import { usePrompts } from '@/context/PromptContext';
import { useToast } from '@/context/ToastContext';
import { Category, Complexity, PromptItem } from '@/lib/types';

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: PromptItem | null; // 支持传入编辑数据
}

const ICONS = [
  'fa-solid fa-robot',
  'fa-solid fa-code',
  'fa-solid fa-pen-nib',
  'fa-solid fa-image',
  'fa-solid fa-briefcase',
  'fa-solid fa-graduation-cap',
  'fa-solid fa-music',
  'fa-solid fa-gamepad'
];

export default function CreatePromptModal({ isOpen, onClose, editData }: CreatePromptModalProps) {
  const { addPrompt, updatePrompt } = usePrompts();
  const { showToast } = useToast();
  
  const initialForm = {
    title: '',
    category: 'code' as Category,
    complexity: 'beginner' as Complexity, // 默认初级
    type: 'icon' as 'icon' | 'image',
    desc: '',
    prompt: '',
    icon: 'fa-solid fa-robot',
    image: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // 当打开或 editData 变化时，重置/填充表单
  useEffect(() => {
      if (isOpen) {
          if (editData) {
              setFormData({
                  title: editData.title,
                  category: editData.category,
                  complexity: editData.complexity || 'beginner', // 兼容旧数据
                  type: editData.type,
                  desc: editData.desc || '',
                  prompt: editData.prompt,
                  icon: editData.icon || 'fa-solid fa-robot',
                  image: editData.image || ''
              });
          } else {
              setFormData(initialForm);
          }
      }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editData) {
        // 编辑模式
        updatePrompt(editData.id, formData);
        showToast('更新成功！', 'success');
    } else {
        // 新增模式
        addPrompt(formData);
        showToast('创建成功！', 'success');
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card text-left shadow-2xl transition-all w-[95%] mx-auto sm:w-full sm:max-w-lg border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white">
                {editData ? '编辑提示词' : '创建新提示词'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">标题 *</label>
              <input 
                type="text" 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:text-white px-3 py-2" 
                placeholder="例如：SEO 优化助手"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">分类</label>
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as Category})}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2"
                    >
                        <option value="code">编程开发</option>
                        <option value="mj">Midjourney</option>
                        <option value="writing">写作助手</option>
                        <option value="roleplay">角色扮演</option>
                        <option value="business">商务办公</option>
                        <option value="custom">个人收藏</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">复杂度</label>
                    <select 
                        value={formData.complexity}
                        onChange={e => setFormData({...formData, complexity: e.target.value as Complexity})}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2"
                    >
                        <option value="beginner">初级</option>
                        <option value="intermediate">中级</option>
                        <option value="advanced">高级</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">类型</label>
                <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={formData.type === 'icon'} onChange={() => setFormData({...formData, type: 'icon'})} className="text-purple-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">图标</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={formData.type === 'image'} onChange={() => setFormData({...formData, type: 'image'})} className="text-purple-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">图片</span>
                    </label>
                </div>
            </div>

            {formData.type === 'icon' ? (
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">选择图标</label>
                    <div className="grid grid-cols-8 gap-2">
                        {ICONS.map(icon => (
                            <div 
                                key={icon}
                                onClick={() => setFormData({...formData, icon})}
                                className={`cursor-pointer w-9 h-9 rounded-lg border flex items-center justify-center transition ${formData.icon === icon ? 'bg-purple-100 border-purple-500 text-purple-600' : 'border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                            >
                                <i className={icon}></i>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">图片 URL</label>
                    <input 
                        type="url" 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:text-white px-3 py-2"
                        placeholder="https://..."
                    />
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">提示词内容</label>
              <textarea 
                required
                rows={4}
                value={formData.prompt}
                onChange={e => setFormData({...formData, prompt: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2 font-mono text-xs" 
                placeholder="在这里输入完整的 Prompt..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">简介</label>
              <textarea 
                rows={2}
                value={formData.desc}
                onChange={e => setFormData({...formData, desc: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:text-white px-3 py-2" 
                placeholder="简要描述..."
              />
            </div>
          </form>
        </div>
        <div className="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button onClick={handleSubmit} type="button" className="inline-flex w-full justify-center rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto transition">
            保存
          </button>
          <button onClick={onClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto transition">
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
