"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123456') {
      login('Admin', 'admin');
      onClose();
    } else if (username === 'user' && password === '123456') {
      login('User', 'user');
      onClose();
    } else {
      showToast('用户名或密码错误 (试用: admin/123456)', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fade-in-up border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">欢迎登录</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">用户名</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">密码</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder=""
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30">
            立即登录
          </button>
        </form>
        <div className="mt-4 text-xs text-center text-gray-400">
          </div>
          {/*演示账号: admin / 123456/*/}
          {/*普通账号: user / 123456/*/}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
    </div>
  );
}
