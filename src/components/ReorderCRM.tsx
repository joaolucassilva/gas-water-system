'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, MessageCircle, Clock, Zap, ArrowRight, ShieldCheck, Flame, Droplets } from 'lucide-react';

export function ReorderCRM() {
  const { customers } = useApp();
  const [scoredCustomers, setScoredCustomers] = useState<any[]>([]);

  useEffect(() => {
    const calculateDaysSince = (dateStr?: string) => {
      if (!dateStr) return 999;
      const last = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - last.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const scored = customers.map(c => {
      const daysSince = calculateDaysSince(c.lastPurchaseDate);
      const isDue = daysSince >= c.avgConsumptionDays;
      const daysLate = Math.max(0, daysSince - c.avgConsumptionDays);
      return {
        ...c,
        daysSince,
        isDue,
        daysLate
      };
    }).sort((a, b) => b.daysLate - a.daysLate);

    setScoredCustomers(scored);
  }, [customers]);

  const dueCount = scoredCustomers.filter(c => c.isDue).length;

  return (
    <div className="space-y-6">
      
      {/* Banner Hero com Gradiente e Visual de Alta Conversão */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-7 rounded-3xl shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Geração de Caixa Imediata</span>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white">
              Motor de Recompra Inteligente
            </h1>
            
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              O sistema monitora a velocidade de consumo da família ou empresa e avisa você antes que o gás acabe e eles comprem de outra revenda. Envie a mensagem pré-formatada no WhatsApp com 1 clique.
            </p>
          </div>

          {/* Contador de Oportunidades em Destaque */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 shadow-lg min-w-[170px]">
            <span className="text-[11px] font-black uppercase tracking-wider block text-emerald-300">
              Prontos para Repor
            </span>
            <span className="text-4xl font-black text-white mt-1 block">
              {dueCount}
            </span>
            <span className="text-[11px] text-amber-300 font-bold block mt-1">
              Clientes no Prazo
            </span>
          </div>
        </div>

        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Lista de Clientes no Ciclo de Recompra */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-black text-xs uppercase tracking-wider text-slate-800">
              Fila de Contatos Prioritários do Dia
            </h2>
            <p className="text-xs text-slate-500">Ordenados pelo cliente que mais tempo está sem pedir</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {dueCount} clientes precisam de contato hoje
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {scoredCustomers.map(cust => {
            const isGas = cust.preferredProduct.includes('Gás');
            const message = encodeURIComponent(
              `Olá, ${cust.name}! Tudo bem? Aqui é da Gás & Água Pro. Notamos que seu ${cust.preferredProduct} costuma durar cerca de ${cust.avgConsumptionDays} dias (já se passaram ${cust.daysSince} dias do último pedido). Gostaria que enviássemos um novo hoje para você não correr o risco de ficar na mão? 🛵💨`
            );

            return (
              <div 
                key={cust.id} 
                className={`p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  cust.isDue ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-slate-900 text-sm">{cust.name}</span>
                    {cust.isDue && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 animate-pulse">
                        Gás Quase Acabando (+{cust.daysLate}d do ciclo)
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{cust.address} • {cust.neighborhood}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-600 font-bold">{cust.phone}</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="p-1 rounded-md bg-slate-100 text-slate-600">
                      {isGas ? <Flame className="w-3.5 h-3.5 text-amber-500 inline mr-1" /> : <Droplets className="w-3.5 h-3.5 text-blue-500 inline mr-1" />}
                      {cust.preferredProduct}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px]">
                      Ciclo habitual: cada <strong>{cust.avgConsumptionDays} dias</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Último Pedido:</span>
                    <span className="font-black text-slate-700 text-sm">
                      {cust.lastPurchaseDate ? `${cust.daysSince} dias atrás` : 'Sem registro'}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/55${cust.phone}?text=${message}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Lembrar no WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
