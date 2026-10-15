'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  RefreshCw, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  CheckCircle2,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export function BottleControl() {
  const { products, drivers, customers, loadDriverTruck, unloadDriverTruck } = useApp();

  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || '');
  const [loadP13, setLoadP13] = useState(0);
  const [loadWater, setLoadWater] = useState(0);

  const [unloadP13, setUnloadP13] = useState(0);
  const [unloadWater, setUnloadWater] = useState(0);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);
  const customersWithDebts = customers.filter(c => c.pendingEmpties > 0);

  const handleCarga = async () => {
    if (loadP13 === 0 && loadWater === 0) return;
    const res = await loadDriverTruck(selectedDriverId, loadP13, loadWater);
    if (!res.success) {
      alert(`⚠️ Bloqueio de Estoque no Pátio:\n\n${res.error}`);
      return;
    }
    setLoadP13(0);
    setLoadWater(0);
    alert('✓ Carga de vasilhames cheios validada e atribuída ao entregador!');
  };

  const handleDescarga = async () => {
    if (unloadP13 === 0 && unloadWater === 0) return;
    const res = await unloadDriverTruck(selectedDriverId, unloadP13, unloadWater);
    if (!res.success) {
      alert(`⚠️ Erro na Descarga:\n\n${res.error}`);
      return;
    }
    setUnloadP13(0);
    setLoadWater(0);
    alert('✓ Vasilhames vazios devolvidos e contabilizados no pátio com sucesso!');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Topo com Destaque de Negócio */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Gestão de Vasilhames & Cascos
            </h1>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Antiperda
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monitore em tempo real o fluxo de botijões cheios saindo para as ruas e cascos vazios retornando ao depósito.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Cascos Devedores</span>
            <span className="text-slate-900 font-black text-base">{customersWithDebts.reduce((acc, c) => acc + c.pendingEmpties, 0)} vasilhames</span>
          </div>
        </div>
      </div>

      {/* 4 Cards de Estoque de Cascos no Pátio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gás P13 Cheio</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            {products.find(p => p.id === 'prod-p13')?.stockFull || 0}
            <span className="text-xs font-bold text-slate-400 ml-1">un</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            Prontos para venda imediata
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gás P13 Vazio</span>
            <div className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">
            {products.find(p => p.id === 'prod-p13')?.stockEmpty || 0}
            <span className="text-xs font-bold text-slate-400 ml-1">un</span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium block mt-1">
            Aguardando troca na distribuidora
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Galão 20L Cheio</span>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 mt-2">
            {products.find(p => p.id === 'prod-water20l')?.stockFull || 0}
            <span className="text-xs font-bold text-slate-400 ml-1">un</span>
          </div>
          <span className="text-[11px] text-blue-700 font-medium block mt-1">
            Prontos no depósito
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Galão 20L Vazio</span>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <div className="text-3xl font-black text-indigo-600 mt-2">
            {products.find(p => p.id === 'prod-water20l')?.stockEmpty || 0}
            <span className="text-xs font-bold text-slate-400 ml-1">un</span>
          </div>
          <span className="text-[11px] text-indigo-700 font-medium block mt-1">
            Prontos para retorno à fonte
          </span>
        </div>

      </div>

      {/* Operação de Carga & Descarga por Veículo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Painel do Veículo Selecionado */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">1. Veículo / Entregador</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <select
            value={selectedDriverId}
            onChange={e => setSelectedDriverId(e.target.value)}
            className="w-full p-3 text-xs font-bold border border-slate-300 rounded-2xl bg-slate-50 focus:bg-white focus:outline-hidden"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} • {d.vehicle}</option>
            ))}
          </select>

          {selectedDriver && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Na posse do entregador agora:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block text-[10px] font-bold">P13 Cheios</span>
                  <span className="font-black text-emerald-600 text-xl">{selectedDriver.currentBottlesLoaded.p13Full}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block text-[10px] font-bold">P13 Vazios</span>
                  <span className="font-black text-amber-600 text-xl">{selectedDriver.currentBottlesLoaded.p13Empty}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block text-[10px] font-bold">Água 20L Cheios</span>
                  <span className="font-black text-blue-600 text-xl">{selectedDriver.currentBottlesLoaded.waterFull}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block text-[10px] font-bold">Água 20L Vazios</span>
                  <span className="font-black text-indigo-600 text-xl">{selectedDriver.currentBottlesLoaded.waterEmpty}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lançar Carga (Pátio -> Moto) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4" />
              2. Carregar Moto (Cheios)
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Libere botijões cheios do depósito para a moto do entregador.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Gás P13 Cheios:</label>
              <input
                type="number"
                min="0"
                value={loadP13}
                onChange={e => setLoadP13(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Galão Água 20L Cheios:</label>
              <input
                type="number"
                min="0"
                value={loadWater}
                onChange={e => setLoadWater(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-slate-50"
              />
            </div>

            <button
              onClick={handleCarga}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              Confirmar Saída p/ Moto
            </button>
          </div>
        </div>

        {/* Lançar Descarga (Moto -> Pátio) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <ArrowDownLeft className="w-4 h-4" />
              3. Descarregar Vazios
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Dê entrada nos vasilhames recolhidos pelo motoqueiro no dia.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Gás P13 Vazios:</label>
              <input
                type="number"
                min="0"
                value={unloadP13}
                onChange={e => setUnloadP13(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Galão Água 20L Vazios:</label>
              <input
                type="number"
                min="0"
                value={unloadWater}
                onChange={e => setUnloadWater(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-slate-50"
              />
            </div>

            <button
              onClick={handleDescarga}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              Registrar Entrada de Vazios
            </button>
          </div>
        </div>

      </div>

      {/* Clientes em Débito de Casco (Comodato / Fiado) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Clientes com Devolução de Casco Pendente
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {customersWithDebts.length} clientes em débito
          </span>
        </div>

        {customersWithDebts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhum cliente está devendo cascos vazios no momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Endereço / Bairro</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4 text-center">Quantidade Devida</th>
                  <th className="py-3 px-4 text-right">Cobrança Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customersWithDebts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.address} ({c.neighborhood})</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{c.phone}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-800 border border-amber-500/20 font-black rounded-full text-[11px]">
                        {c.pendingEmpties} vasilhame(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/55${c.phone}?text=Olá ${c.name}, tudo bem? Aqui é da revenda de Gás e Água. Vimos no sistema que ficou pendente a devolução de ${c.pendingEmpties} vasilhame(s). Poderíamos agendar a retirada com o entregador hoje?`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shadow-xs transition"
                      >
                        Cobrar no WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
