'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Package, Flame, Droplets, ArrowUpRight, ArrowDownRight, Layers, DollarSign } from 'lucide-react';

export function InventoryManagement() {
  const { products } = useApp();

  const totalFull = products.reduce((acc, p) => acc + p.stockFull, 0);
  const totalEmpty = products.reduce((acc, p) => acc + p.stockEmpty, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.stockFull * p.costPrice), 0);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal com Indicadores Financeiros */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Estoque Físico & Patrimônio de Cascos
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Visão consolidada entre mercadoria cheia pronta para venda e vasilhames vazios no pátio da empresa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-right">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Patrimônio em Mercadoria</span>
            <span className="text-slate-900 font-black text-base">R$ {totalStockValue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Grid de Produtos com Detalhamento de Margem e Cascos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map(p => {
          const totalBottles = p.stockFull + p.stockEmpty;
          const fullPercentage = totalBottles > 0 ? Math.round((p.stockFull / totalBottles) * 100) : 0;
          const profit = p.priceRefill - p.costPrice;
          const profitMargin = Math.round((profit / p.priceRefill) * 100);

          return (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4 hover:shadow-md transition">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.category === 'gas' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {p.category === 'gas' ? <Flame className="w-6 h-6" /> : <Droplets className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{p.name}</h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Categoria: <strong className="text-slate-600 capitalize">{p.category}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Cascos</span>
                  <span className="font-black text-slate-900 text-lg">{totalBottles} un</span>
                </div>
              </div>

              {/* Barra de Proporção Cheios / Vazios */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {p.stockFull} Cheios ({fullPercentage}%)
                  </span>
                  <span className="text-amber-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {p.stockEmpty} Vazios ({100 - fullPercentage}%)
                  </span>
                </div>
                
                <div className="w-full bg-amber-100/80 rounded-full h-3 overflow-hidden flex shadow-inner">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${fullPercentage}%` }}
                  />
                </div>
              </div>

              {/* Métricas Comerciais e Margem */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Custo Unitário</span>
                  <span className="font-bold text-slate-700 text-sm mt-0.5 block">R$ {p.costPrice.toFixed(2)}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Preço Refil</span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">R$ {p.priceRefill.toFixed(2)}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Lucro Unitário</span>
                  <span className="font-black text-blue-600 text-sm mt-0.5 block">
                    R$ {profit.toFixed(2)} <span className="text-[10px] text-blue-500 font-semibold">({profitMargin}%)</span>
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
