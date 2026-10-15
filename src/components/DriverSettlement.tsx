'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  DollarSign, 
  CheckCircle2, 
  UserCheck, 
  ShieldAlert, 
  FileText,
  Banknote,
  QrCode,
  CreditCard,
  RefreshCw,
  Printer,
  EyeOff,
  AlertTriangle,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DriverSettlement() {
  const { drivers, orders, performBlindSettlement } = useApp();
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || '');
  
  // Declaração cega do entregador
  const [declaredCash, setDeclaredCash] = useState('');
  const [declaredPix, setDeclaredPix] = useState('');
  const [declaredCard, setDeclaredCard] = useState('');
  const [declaredEmpties, setDeclaredEmpties] = useState('');
  
  // Relatório retornado pelo backend
  const [report, setReport] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  const driverOrders = orders.filter(
    o => o.deliveryDriverId === selectedDriverId && o.status === 'entregue'
  );

  const handleBlindSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await performBlindSettlement(
      selectedDriverId,
      parseFloat(declaredCash) || 0,
      parseFloat(declaredPix) || 0,
      parseFloat(declaredCard) || 0,
      parseInt(declaredEmpties) || 0
    );

    setIsSubmitting(false);

    if (!res.success) {
      alert(`⚠️ Erro ao processar acerto:\n\n${res.error}`);
      return;
    }

    setReport(res.report);
    if (res.report.status === 'CONCILIADO_PERFEITO') {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header com Descrição da Validação Cega */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <EyeOff className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Fechamento Cego de Caixa (Anti-fraude)
            </h1>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Validação Auditada
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            O entregador declara os valores que tem em mãos <strong>sem ver os totais do sistema</strong>. O backend faz a conciliação automática e aponta eventuais faltas de dinheiro ou cascos.
          </p>
        </div>
      </div>

      {/* Seleção do Entregador */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3">
        <UserCheck className="w-5 h-5 text-purple-600 ml-1" />
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Motoqueiro no Balcão:</span>
        <select
          value={selectedDriverId}
          onChange={e => {
            setSelectedDriverId(e.target.value);
            setReport(null);
          }}
          className="flex-1 p-2.5 text-xs font-bold border border-slate-300 rounded-2xl bg-slate-50 focus:bg-white focus:outline-hidden"
        >
          {drivers.map(d => (
            <option key={d.id} value={d.id}>{d.name} • {d.vehicle}</option>
          ))}
        </select>
      </div>

      {/* Formulário de Declaração Cega */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Scale className="w-5 h-5 text-purple-600" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Declaração Física na Volta da Rota
          </h2>
        </div>

        <form onSubmit={handleBlindSettlement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Dinheiro Declarado */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <label className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                Dinheiro em Espécie (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={declaredCash}
                onChange={e => setDeclaredCash(e.target.value)}
                placeholder="Ex: 330.00"
                className="w-full p-2.5 text-base font-black text-slate-900 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
              <span className="text-[10px] text-emerald-700 block">Contar notas na frente do entregador</span>
            </div>

            {/* Pix Declarado */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
              <label className="text-xs font-black text-blue-800 uppercase tracking-wider block">
                Pix Confirmado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={declaredPix}
                onChange={e => setDeclaredPix(e.target.value)}
                placeholder="Ex: 110.00"
                className="w-full p-2.5 text-base font-black text-slate-900 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <span className="text-[10px] text-blue-700 block">Comprovantes mostrados na tela</span>
            </div>

            {/* Cartão Declarado */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
              <label className="text-xs font-black text-indigo-800 uppercase tracking-wider block">
                Cartão na Maquininha (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={declaredCard}
                onChange={e => setDeclaredCard(e.target.value)}
                placeholder="Ex: 0.00"
                className="w-full p-2.5 text-base font-black text-slate-900 bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
              <span className="text-[10px] text-indigo-700 block">Total do relatório da maquininha</span>
            </div>

            {/* Cascos Declarados */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
              <label className="text-xs font-black text-amber-800 uppercase tracking-wider block">
                Cascos Vazios Trazidos (un)
              </label>
              <input
                type="number"
                required
                value={declaredEmpties}
                onChange={e => setDeclaredEmpties(e.target.value)}
                placeholder="Ex: 4"
                className="w-full p-2.5 text-base font-black text-slate-900 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
              <span className="text-[10px] text-amber-700 block">Botijões e galões vazios na moto</span>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-purple-600/25 transition cursor-pointer"
            >
              {isSubmitting ? 'Processando Auditoria...' : 'Auditar e Conciliar Caixa (Backend)'}
            </button>
          </div>
        </form>
      </div>

      {/* Relatório de Auditoria e Divergências */}
      {report && (
        <div className={`p-6 rounded-3xl border ${report.status === 'CONCILIADO_PERFEITO' ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'} shadow-md space-y-4 animate-in fade-in`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {report.status === 'CONCILIADO_PERFEITO' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {report.status === 'CONCILIADO_PERFEITO' ? '✓ Turno 100% Conciliado e Aprovado!' : '⚠️ Atenção: Divergência Detectada no Fechamento!'}
                </h3>
                <p className="text-xs text-slate-600">
                  Auditado pelo backend para {report.driverName} • {report.totalOrders} entregas registradas.
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${report.status === 'CONCILIADO_PERFEITO' ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
              {report.status}
            </span>
          </div>

          {/* Comparativo Lado a Lado (Declarado vs. Esperado pelo Sistema) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block">Dinheiro:</span>
              <div className="mt-1 flex justify-between">
                <span>Declarado: <strong>R$ {report.declared.cash.toFixed(2)}</strong></span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Esperado: R$ {report.system.cash.toFixed(2)}</span>
              </div>
              <div className={`mt-1 font-black ${report.differences.diffCash === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Diferença: {report.differences.diffCash >= 0 ? '+' : ''}R$ {report.differences.diffCash.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block">PIX:</span>
              <div className="mt-1 flex justify-between">
                <span>Declarado: <strong>R$ {report.declared.pix.toFixed(2)}</strong></span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Esperado: R$ {report.system.pix.toFixed(2)}</span>
              </div>
              <div className={`mt-1 font-black ${report.differences.diffPix === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Diferença: {report.differences.diffPix >= 0 ? '+' : ''}R$ {report.differences.diffPix.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block">Cartão:</span>
              <div className="mt-1 flex justify-between">
                <span>Declarado: <strong>R$ {report.declared.card.toFixed(2)}</strong></span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Esperado: R$ {report.system.card.toFixed(2)}</span>
              </div>
              <div className={`mt-1 font-black ${report.differences.diffCard === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Diferença: {report.differences.diffCard >= 0 ? '+' : ''}R$ {report.differences.diffCard.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block">Cascos Vazios:</span>
              <div className="mt-1 flex justify-between">
                <span>Trazidos: <strong>{report.declared.empties} un</strong></span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Esperado: {report.system.empties} un</span>
              </div>
              <div className={`mt-1 font-black ${report.differences.diffEmpties === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Diferença: {report.differences.diffEmpties >= 0 ? '+' : ''}{report.differences.diffEmpties} casco(s)
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Extrato Detalhado de Pedidos do Turno */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Pedidos Finalizados na Rota ({driverOrders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Casco Recolhido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {driverOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Nenhuma entrega finalizada por este motoqueiro no turno.
                  </td>
                </tr>
              ) : (
                driverOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{ord.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{ord.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {ord.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-black uppercase text-[10px] text-slate-700">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      R$ {ord.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                        ✓ {ord.emptyBottlesReturned} casco(s)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
