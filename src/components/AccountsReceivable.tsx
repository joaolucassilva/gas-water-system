'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  MessageSquare, 
  ArrowUpRight,
  Receipt,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function AccountsReceivable() {
  const { customers, orders, payCreditDebt } = useApp();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'pix' | 'debito' | 'credito'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clientes com saldo devedor (vendas a prazo / empresas)
  const debtorCustomers = customers.filter(c => c.creditBalance > 0);
  const totalReceivable = debtorCustomers.reduce((acc, c) => acc + c.creditBalance, 0);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerOrders = orders.filter(
    o => o.customerPhone === selectedCustomer?.phone && o.paymentMethod === 'a_prazo'
  );

  const handlePayDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !paymentAmount) return;

    setIsSubmitting(true);
    const res = await payCreditDebt(selectedCustomerId, parseFloat(paymentAmount), paymentMethod);
    setIsSubmitting(false);

    if (!res.success) {
      alert(`⚠️ Erro ao registrar baixa:\n\n${res.error}`);
      return;
    }

    confetti({ particleCount: 50, spread: 70 });
    alert(res.message);
    setPaymentAmount('');
    setSelectedCustomerId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal com Indicador de Contas a Receber */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Contas a Receber & Vendas a Prazo (Empresas)
            </h1>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Gestão Financeira B2B
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Acompanhe o faturamento mensal de padarias, restaurantes e condomínios. Faça a conciliação de boletos, Pix e quitações com 1 clique.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-lg text-right min-w-[200px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Total a Receber na Praça
          </span>
          <span className="text-2xl font-black text-amber-400 mt-0.5 block">
            R$ {totalReceivable.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Em {debtorCustomers.length} empresas/clientes
          </span>
        </div>
      </div>

      {/* Grid de Empresas Devedoras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Devedores */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Empresas com Faturas em Aberto ({debtorCustomers.length})
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Clique para gerenciar</span>
          </div>

          <div className="divide-y divide-slate-100">
            {debtorCustomers.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                Parabéns! Nenhuma fatura a prazo em atraso ou em aberto no momento.
              </div>
            ) : (
              debtorCustomers.map(c => {
                const isSelected = selectedCustomerId === c.id;
                const message = encodeURIComponent(
                  `Olá ${c.name}! Tudo bem? Aqui é da Distribuidora Gás & Água Pro. Estamos fazendo o fechamento da fatura quinzenal dos pedidos entregues. O saldo atual em aberto é de R$ ${c.creditBalance.toFixed(2)}. Segue nossa chave Pix para acerto: (11) 98888-0000. Qualquer dúvida estamos à disposição!`
                );

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                      isSelected ? 'bg-purple-50/80 border-l-4 border-purple-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{c.name}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {c.neighborhood}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{c.address} • Fone: {c.phone}</p>
                      {c.notes && <p className="text-[11px] text-purple-700 font-semibold">{c.notes}</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Saldo Devedor:</span>
                        <span className="text-lg font-black text-rose-600">
                          R$ {c.creditBalance.toFixed(2)}
                        </span>
                      </div>

                      <a
                        href={`https://wa.me/55${c.phone}?text=${message}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                        title="Enviar extrato de cobrança no WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Painel de Baixa e Pagamento de Fatura */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Dar Baixa em Pagamento
            </h2>
          </div>

          {selectedCustomer ? (
            <form onSubmit={handlePayDebt} className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Empresa Selecionada:</span>
                <span className="font-black text-sm text-slate-900 block">{selectedCustomer.name}</span>
                <span className="text-xs text-rose-600 font-black block">
                  Dívida Total: R$ {selectedCustomer.creditBalance.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                  Valor Pago (R$) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    max={selectedCustomer.creditBalance}
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    placeholder={`Até R$ ${selectedCustomer.creditBalance.toFixed(2)}`}
                    className="w-full p-3 text-base font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(selectedCustomer.creditBalance.toString())}
                    className="absolute right-2.5 top-2.5 text-[10px] font-black uppercase px-2 py-1 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200"
                  >
                    Quitar Tudo
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                  Forma do Pagamento Recebido *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 text-xs font-bold border border-slate-300 rounded-2xl bg-slate-50 focus:bg-white outline-hidden"
                >
                  <option value="pix">PIX (Conta da Empresa)</option>
                  <option value="dinheiro">Dinheiro em Espécie</option>
                  <option value="debito">Cartão de Débito</option>
                  <option value="credito">Transferência / TED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-purple-600/25 transition cursor-pointer"
              >
                {isSubmitting ? 'Registrando Baixa...' : 'Confirmar Recebimento da Fatura'}
              </button>
            </form>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Selecione uma empresa ao lado para registrar o pagamento ou quitação de fatura.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
