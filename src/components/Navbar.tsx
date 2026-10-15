'use client';

import React from 'react';
import { 
  Flame, 
  ShoppingBag, 
  RefreshCw, 
  Users, 
  DollarSign, 
  Smartphone, 
  Package, 
  Sparkles,
  TrendingUp,
  Building2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  reorderAlertCount: number;
  debtorCount: number;
  todayTotalRevenue: number;
}

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  pendingCount, 
  reorderAlertCount, 
  debtorCount, 
  todayTotalRevenue 
}: NavbarProps) {
  const navItems = [
    { id: 'pdv', label: 'Balcão / Pedidos', icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : null, badgeColor: 'bg-amber-500' },
    { id: 'cascos', label: 'Gestão de Cascos', icon: RefreshCw },
    { id: 'recompra', label: 'CRM de Recompra', icon: Sparkles, badge: reorderAlertCount > 0 ? reorderAlertCount : null, badgeColor: 'bg-emerald-500' },
    { id: 'contas_receber', label: 'Vendas a Prazo (B2B)', icon: Building2, badge: debtorCount > 0 ? debtorCount : null, badgeColor: 'bg-rose-500' },
    { id: 'acerto', label: 'Fechamento Entregador', icon: DollarSign },
    { id: 'estoque', label: 'Estoque Físico', icon: Package },
    { id: 'clientes', label: 'Clientes & Bairros', icon: Users },
    { id: 'entregador_view', label: 'Modo Entregador', icon: Smartphone, highlight: true },
  ];

  return (
    <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white sticky top-0 z-40 transition-all shadow-xl print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo e Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveTab('pdv')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-blue-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-6 h-6 text-white drop-shadow-md" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  GÁS & ÁGUA<span className="text-amber-400">PRO</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Central de Operações</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  R$ {todayTotalRevenue.toFixed(2)} hoje
                </span>
              </p>
            </div>
          </div>

          {/* Menus Desktop com Design Moderno */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold scale-[1.02]'
                      : item.highlight
                      ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${item.badgeColor || 'bg-amber-500'} text-slate-950 animate-soft-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className="lg:hidden flex overflow-x-auto py-2.5 px-4 gap-2 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
              {item.badge && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-amber-400'} text-slate-950`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
