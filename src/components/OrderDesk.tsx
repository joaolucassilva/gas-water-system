'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types';
import { 
  Plus, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Droplets, 
  Phone, 
  MapPin, 
  X,
  CreditCard,
  Banknote,
  QrCode,
  FileCheck,
  PackageCheck,
  ChevronRight,
  TrendingUp,
  Receipt,
  Printer,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThermalReceipt } from './ThermalReceipt';

export function OrderDesk() {
  const { products, customers, drivers, orders, neighborhoods, createOrder, dispatchDriver, completeOrder } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Campos do formulário
  const [phoneSearch, setPhoneSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'prod-p13');
  const [quantity, setQuantity] = useState(1);
  const [isCompleteBottle, setIsCompleteBottle] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'pix' | 'debito' | 'credito' | 'a_prazo'>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [driverId, setDriverId] = useState('');
  const [cascoStatus, setCascoStatus] = useState<'troca' | 'sem_casco' | 'fiado_casco'>('troca');

  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'em_rota' | 'entregue'>('todos');

  // Stats rápidos do dia
  const todayTotal = orders.reduce((sum, o) => sum + (o.status !== 'cancelado' ? o.total : 0), 0);
  const deliveredCount = orders.filter(o => o.status === 'entregue').length;
  const inRouteCount = orders.filter(o => o.status === 'em_rota').length;
  const pendingCount = orders.filter(o => o.status === 'pendente').length;

  // Atualizar taxa de entrega ao escolher bairro
  const handleNeighborhoodChange = (bName: string) => {
    setNeighborhood(bName);
    const found = neighborhoods.find(n => n.name === bName);
    setDeliveryFee(found ? found.deliveryFee : 0);
  };

  const handlePhoneSearch = (term: string) => {
    setPhoneSearch(term);
    const cleaned = term.replace(/\D/g, '');
    const found = customers.find(c => c.phone.includes(cleaned) || c.name.toLowerCase().includes(term.toLowerCase()));
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setAddress(found.address);
      handleNeighborhoodChange(found.neighborhood || 'Centro');
    }
  };

  const handleSelectCustomer = (c: typeof customers[0]) => {
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    setAddress(c.address + (c.complement ? ` (${c.complement})` : ''));
    handleNeighborhoodChange(c.neighborhood || 'Centro');
    setPhoneSearch('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !address) {
      alert('Por favor, preencha o nome e o endereço do cliente.');
      return;
    }

    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const unitPrice = isCompleteBottle ? prod.priceComplete : prod.priceRefill;
    const subtotal = unitPrice * quantity;
    const total = subtotal + deliveryFee;

    let emptyBottlesReturned = 0;
    let emptyBottlesOwed = 0;

    if (cascoStatus === 'troca') {
      emptyBottlesReturned = quantity;
    } else if (cascoStatus === 'fiado_casco') {
      emptyBottlesOwed = quantity;
    }

    const res = await createOrder({
      customerName,
      customerPhone: customerPhone || '11999999999',
      address,
      neighborhood: neighborhood || 'Centro',
      deliveryFee,
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          quantity,
          isCompleteBottle,
          unitPrice,
        }
      ],
      subtotal,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'pix' ? 'pago' : 'pendente',
      status: driverId ? 'em_rota' : 'pendente',
      deliveryDriverId: driverId || undefined,
      deliveryDriverName: drivers.find(d => d.id === driverId)?.name,
      emptyBottlesReturned,
      emptyBottlesOwed,
      changeFor: changeFor ? parseFloat(changeFor) : undefined,
      notes: notes || undefined,
    });

    if (!res.success) {
      alert(`⚠️ Bloqueio do Backend:\n\n${res.error}`);
      return;
    }

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });

    setIsModalOpen(false);
    setPhoneSearch('');
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setNeighborhood('Centro');
    setDeliveryFee(0);
    setQuantity(1);
    setIsCompleteBottle(false);
    setChangeFor('');
    setNotes('');
  };

  const handleDispatch = async (orderId: string, dId: string) => {
    const res = await dispatchDriver(orderId, dId);
    if (!res.success) {
      alert(`⚠️ Validação de Carga:\n\n${res.error}`);
    }
  };

  const handleComplete = async (orderId: string, empties = 1) => {
    const res = await completeOrder(orderId, true, empties);
    if (!res.success) {
      alert(`⚠️ Erro ao concluir:\n\n${res.error}`);
    } else {
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'todos') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card Faturamento */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-3xl border border-slate-800 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendas do Dia</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              R$ {todayTotal.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              {orders.length} pedidos registrados
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Card Pendentes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Aguardando Envio</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-900">{pendingCount}</span>
            <span className="text-xs text-slate-500 block mt-1">Precisam de entregador</span>
          </div>
        </div>

        {/* Card Em Rota */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Na Rua (Em Rota)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-900">{inRouteCount}</span>
            <span className="text-xs text-slate-500 block mt-1">Com motoqueiros</span>
          </div>
        </div>

        {/* Card Entregues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Entregas Concluídas</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-emerald-600">{deliveredCount}</span>
            <span className="text-xs text-slate-500 block mt-1">Finalizados com sucesso</span>
          </div>
        </div>

      </div>

      {/* Barra de Filtros e Botão Principal */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Filtros em Pílula */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'todos', label: 'Todos', count: orders.length },
            { id: 'pendente', label: 'Aguardando', count: pendingCount, color: 'text-amber-600' },
            { id: 'em_rota', label: 'Em Rota', count: inRouteCount, color: 'text-blue-600' },
            { id: 'entregue', label: 'Entregues', count: deliveredCount, color: 'text-emerald-600' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === filter.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === filter.id ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Botão Novo Pedido */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Novo Pedido (F2)</span>
        </button>
      </div>

      {/* Grid de Pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold text-base">Nenhum pedido com este status</p>
            <p className="text-slate-400 text-xs mt-1">Clique no botão "Novo Pedido" para lançar uma entrega.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isDelivered = order.status === 'entregue';
            const isInRoute = order.status === 'em_rota';
            const isPending = order.status === 'pendente';

            return (
              <div 
                key={order.id} 
                className="group relative bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Linha Superior com Botão de Imprimir Cupom Térmico */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                        {order.id}
                      </span>

                      {/* Botão de Impressão Térmica */}
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Imprimir cupom térmico (58mm/80mm) para o motoqueiro"
                      >
                        <Printer className="w-3 h-3 text-blue-600" />
                        <span>Cupom</span>
                      </button>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                      isPending ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' :
                      isInRoute ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : isInRoute ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {isPending && 'Aguardando Moto'}
                      {isInRoute && 'Em Rota'}
                      {isDelivered && 'Entregue'}
                    </span>
                  </div>

                  {/* Informações do Cliente */}
                  <div className="mt-4">
                    <h3 className="font-black text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      {order.customerName}
                    </h3>
                    
                    <div className="mt-2 space-y-1.5">
                      <a 
                        href={`https://wa.me/55${order.customerPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.customerPhone}</span>
                      </a>

                      <p className="text-xs text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.address} ({order.neighborhood})</span>
                      </p>

                      {order.notes && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                          Obs: {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detalhes dos Itens e Taxa de Entrega */}
                  <div className="mt-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <span className="w-5 h-5 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-[10px]">
                            {item.quantity}x
                          </span>
                          <span>{item.productName}</span>
                          {item.isCompleteBottle && (
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                              Casco Novo
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-900">
                          R$ {(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-xs text-slate-500 font-semibold pt-1 border-t border-slate-200/60">
                        <span>Taxa de Entrega ({order.neighborhood}):</span>
                        <span className="text-slate-700">R$ {order.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Valor Total:</span>
                      <span className="text-base font-black text-blue-600">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Informações de Casco e Pagamento */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block font-medium">Forma:</span>
                      <span className="font-black text-slate-800 uppercase tracking-wider">
                        {order.paymentMethod === 'a_prazo' ? 'A Prazo (Fatura)' : order.paymentMethod}
                      </span>
                      {order.changeFor && (
                        <span className="block text-amber-700 font-bold mt-0.5">Troco p/ R$ {order.changeFor}</span>
                      )}
                    </div>

                    <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block font-medium">Casco:</span>
                      <span className="font-bold text-slate-800">
                        {order.emptyBottlesReturned > 0 ? (
                          <span className="text-emerald-700">✓ 1x1 Retornado</span>
                        ) : order.emptyBottlesOwed > 0 ? (
                          <span className="text-rose-600 font-black">⚠️ Ficou Devendo ({order.emptyBottlesOwed})</span>
                        ) : (
                          'Venda Casco Novo'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações Inferiores do Card */}
                <div className="mt-5 pt-3.5 border-t border-slate-100">
                  {isPending && (
                    <div className="space-y-2">
                      <select 
                        onChange={(e) => handleDispatch(order.id, e.target.value)}
                        className="w-full text-xs font-bold bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 rounded-xl p-2.5 cursor-pointer transition focus:outline-hidden"
                        defaultValue=""
                      >
                        <option value="" disabled>🛵 Despachar Motoqueiro...</option>
                        {drivers.filter(d => d.active).map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.vehicle})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isInRoute && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-blue-800 bg-blue-50/80 px-3 py-2 rounded-xl border border-blue-100 font-medium">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Truck className="w-4 h-4 text-blue-600" />
                          {order.deliveryDriverName}
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600">Entregando</span>
                      </div>
                      <button
                        onClick={() => handleComplete(order.id, order.emptyBottlesReturned || 1)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" />
                        Dar Baixa & Confirmar Entrega
                      </button>
                    </div>
                  )}

                  {isDelivered && (
                    <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/80 px-3 py-2.5 rounded-xl border border-emerald-100">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Entregue por {order.deliveryDriverName || 'Balcão'}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                        Pago
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE NOVO PEDIDO COM TAXA DE ENTREGA AUTOMÁTICA POR BAIRRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cabeçalho Modal */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Atendimento Balcão & Telefone</span>
                <h2 className="text-xl font-black tracking-tight text-white mt-0.5">Lançar Novo Pedido</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              
              {/* 1. Busca Instantânea */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  1. Localizar Cliente ou Cadastrar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phoneSearch}
                    onChange={(e) => handlePhoneSearch(e.target.value)}
                    placeholder="Comece a digitar telefone ou nome do cliente..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>

                {phoneSearch && (
                  <div className="mt-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-2xl bg-white shadow-lg divide-y divide-slate-100">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(phoneSearch.toLowerCase()) || c.phone.includes(phoneSearch))
                      .map(c => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectCustomer(c)}
                          className="p-3 text-xs hover:bg-blue-50/80 cursor-pointer flex justify-between items-center transition"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{c.name}</span>
                            <span className="text-slate-500 text-[11px]">{c.address} ({c.neighborhood})</span>
                            {c.creditBalance > 0 && (
                              <span className="text-rose-600 font-bold text-[10px] block">
                                Débito a prazo em aberto: R$ {c.creditBalance.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg">{c.phone}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Dados do Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Endereço (Rua e Nº) *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Ex: Rua das Palmeiras, 340"
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Bairro / Taxa *</label>
                  <select
                    value={neighborhood}
                    onChange={e => handleNeighborhoodChange(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:bg-white"
                  >
                    {neighborhoods.map(n => (
                      <option key={n.id} value={n.name}>
                        {n.name} (+R$ {n.deliveryFee.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Observação / Ponto de Referência */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Ponto de Referência / Obs para o Motoqueiro</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Portão preto, campainha duas vezes, entregar nos fundos"
                  className="w-full text-xs border border-slate-300 rounded-xl p-2 bg-slate-50"
                />
              </div>

              {/* 2. Seleção de Produto */}
              <div className="pt-3 border-t border-slate-200">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                  2. Produto
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {products.map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        selectedProductId === p.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs ring-2 ring-blue-500/20' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${p.category === 'gas' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          {p.category === 'gas' ? <Flame className="w-4 h-4" /> : <Droplets className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-500">Refil: R$ {p.priceRefill.toFixed(2)}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantidade e Situação do Vasilhame */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Quantidade</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition"
                    >
                      -
                    </button>
                    <span className="font-black text-base w-8 text-center text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Situação do Vasilhame</label>
                  <select
                    value={cascoStatus}
                    onChange={(e: any) => setCascoStatus(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                  >
                    <option value="troca">Troca 1x1 (Entrega vazio)</option>
                    <option value="sem_casco">Venda de Casco Novo (+ valor)</option>
                    <option value="fiado_casco">Fiado de Casco (Devolve depois)</option>
                  </select>
                </div>
              </div>

              {/* 3. Pagamento e Despacho */}
              <div className="pt-3 border-t border-slate-200">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                  3. Forma de Pagamento & Motoqueiro
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={paymentMethod}
                      onChange={(e: any) => setPaymentMethod(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                    >
                      <option value="pix">PIX (Chave na Entrega)</option>
                      <option value="dinheiro">Dinheiro em Espécie</option>
                      <option value="debito">Cartão de Débito</option>
                      <option value="credito">Cartão de Crédito</option>
                      <option value="a_prazo">A Prazo / Fatura Mensal (Empresas)</option>
                    </select>

                    {paymentMethod === 'dinheiro' && (
                      <input
                        type="number"
                        placeholder="Troco para quanto? (Ex: 150)"
                        value={changeFor}
                        onChange={e => setChangeFor(e.target.value)}
                        className="w-full mt-2 text-xs border border-amber-300 bg-amber-50 rounded-xl p-2 font-medium"
                      />
                    )}
                  </div>

                  <div>
                    <select
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                    >
                      <option value="">🛵 Despachar depois</option>
                      {drivers.filter(d => d.active).map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Resumo Final com Taxa de Entrega */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Subtotal: R$ {((isCompleteBottle ? (products.find(p => p.id === selectedProductId)?.priceComplete || 0) : (products.find(p => p.id === selectedProductId)?.priceRefill || 0)) * quantity).toFixed(2)}</span>
                  <span className="text-slate-500 block">Taxa de Entrega ({neighborhood}): R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total do Pedido:</span>
                  <span className="text-lg font-black text-blue-600">
                    R$ {(((isCompleteBottle ? (products.find(p => p.id === selectedProductId)?.priceComplete || 0) : (products.find(p => p.id === selectedProductId)?.priceRefill || 0)) * quantity) + deliveryFee).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Rodapé com Botão de Confirmação */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition cursor-pointer"
                >
                  Salvar Pedido (Enter)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE IMPRESSÃO TÉRMICA */}
      {selectedReceiptOrder && (
        <ThermalReceipt
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}

    </div>
  );
}
