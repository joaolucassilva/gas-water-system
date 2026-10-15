'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Users, Phone, MapPin, Calendar, Plus, Clock, MessageSquare, Search, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function CustomerList() {
  const { customers, addCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [avgDays, setAvgDays] = useState(35);
  const [preferredProduct, setPreferredProduct] = useState('Gás de Cozinha P13 (13kg)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name,
      phone,
      address,
      neighborhood,
      complement,
      avgConsumptionDays: avgDays,
      preferredProduct,
    });
    confetti({ particleCount: 30, spread: 60 });
    setShowModal(false);
    setName('');
    setPhone('');
    setAddress('');
    setNeighborhood('');
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) || 
    c.neighborhood.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Banner de Cabeçalho */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Base de Clientes & Regiões ({customers.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre novos clientes com frequência de consumo para alimentar o motor de recompra.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Cliente
        </button>
      </div>

      {/* Barra de Busca com Design Limpo */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente por nome, telefone ou bairro..."
          className="w-full text-xs font-bold text-slate-800 placeholder-slate-400 outline-hidden"
        />
      </div>

      {/* Cards de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base">{c.name}</h3>
                  <span className="text-xs text-blue-600 font-bold block mt-0.5">{c.phone}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {c.neighborhood}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2.5 flex items-start gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{c.address} {c.complement && `(${c.complement})`}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Ciclo: cada {c.avgConsumptionDays}d
              </span>

              <a
                href={`https://wa.me/55${c.phone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Abrir WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro de Cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3.5">
              <h3 className="font-black text-lg text-slate-900">Novo Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Endereço (Rua e Número) *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Complemento / Ponto de Referência</label>
                <input
                  type="text"
                  value={complement}
                  onChange={e => setComplement(e.target.value)}
                  placeholder="Ex: Em frente ao mercado"
                  className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ciclo Médio (Dias)</label>
                  <input
                    type="number"
                    value={avgDays}
                    onChange={e => setAvgDays(parseInt(e.target.value) || 35)}
                    className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Produto Habitual</label>
                  <select
                    value={preferredProduct}
                    onChange={e => setPreferredProduct(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 p-2.5 rounded-2xl bg-slate-50 focus:bg-white"
                  >
                    <option value="Gás de Cozinha P13 (13kg)">Gás de Cozinha P13 (13kg)</option>
                    <option value="Galão de Água Mineral 20L">Galão de Água Mineral 20L</option>
                    <option value="Cilindro Industrial P45">Cilindro Industrial P45</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-500/25"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
