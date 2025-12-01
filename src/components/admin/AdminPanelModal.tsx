"use client";

import React, { useState } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useToast } from '@/context/ToastContext';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const { config, updateConfig, resetConfig } = useSiteConfig();
  const { showToast } = useToast();
  
  // Local state for editing
  const [formData, setFormData] = useState(config);

  if (!isOpen) return null;

  const handleSave = () => {
    updateConfig(formData);
    showToast('站点配置已更新', 'success');
    onClose();
  };

  const handleReset = () => {
    if(confirm('确定恢复默认设置吗？')) {
        resetConfig();
        setFormData(config); // Sync back
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-screwdriver-wrench text-purple-600"></i>
                站点全局配置
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-xl"></i>
            </button>
        </div>

        <div className="p-6 space-y-8">
            {/* Section 1: 首页设置 */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2">首页 Hero 内容</h3>
                
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">主标题 (支持 HTML)</label>
                    <input 
                        type="text" 
                        value={formData.homeTitle}
                        onChange={e => setFormData({...formData, homeTitle: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">打字机文本 (逗号分隔)</label>
                    <input 
                        type="text" 
                        value={formData.typewriterTexts.join(',')}
                        onChange={e => setFormData({...formData, typewriterTexts: e.target.value.split(',')})}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="文本1,文本2,文本3"
                    />
                </div>
            </div>

            {/* Section 2: 提示词页面设置 (新增) */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2">提示词页面设置</h3>
                
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">页面标题</label>
                    <input 
                        type="text" 
                        value={formData.promptsPage.title}
                        onChange={e => setFormData({
                            ...formData, 
                            promptsPage: { ...formData.promptsPage, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">宣传语/描述</label>
                    <textarea 
                        rows={2}
                        value={formData.promptsPage.description}
                        onChange={e => setFormData({
                            ...formData, 
                            promptsPage: { ...formData.promptsPage, description: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Section 3: 公告设置 */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">全站公告</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-500">启用</span>
                        <input 
                            type="checkbox" 
                            checked={formData.announcement.enabled}
                            onChange={e => setFormData({...formData, announcement: {...formData.announcement, enabled: e.target.checked}})}
                            className="toggle-checkbox text-purple-600 rounded focus:ring-purple-500" 
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">公告标题</label>
                    <input 
                        type="text" 
                        value={formData.announcement.title}
                        onChange={e => setFormData({...formData, announcement: {...formData.announcement, title: e.target.value}})}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">公告内容</label>
                    <textarea 
                        rows={3}
                        value={formData.announcement.content}
                        onChange={e => setFormData({...formData, announcement: {...formData.announcement, content: e.target.value}})}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between sticky bottom-0">
            <button 
                onClick={handleReset}
                className="text-red-500 hover:text-red-600 text-sm font-medium px-4 py-2"
            >
                重置默认
            </button>
            <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                    取消
                </button>
                <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition font-medium">
                    保存更改
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}