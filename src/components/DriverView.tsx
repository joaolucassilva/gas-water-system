'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, Navigation, Phone, CheckCircle, PackageCheck, AlertCircle, Smartphone, Flame, Droplets } from 'lucide-react';
import confetti from 'canvas-confetti';

export function DriverView() {
  const { drivers, orders, completeOrder } = useApp();
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || '');

  const driver = drivers.find(d => d.id === selectedDriverId);
  const myPendingOrders = orders.filter(
    o => o.deliveryDriverId === selectedDriverId && (o.status === 'em_rota' || o.status === 'pendente')
  );

  const handleCompleteOrder = async (orderId: string, empties: number) => {
    await completeOrder(orderId, true, empties);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-16">
      
      {/* Moldura Superior de Celular com Seletor */}
      <div className="bg-slate-950 text-white p-4 rounded-3xl shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 block">App do Entregador</span>
              <h2 className="text-sm font-black text-white">Dispositivo Mobile</h2>
            </div>
          </div>

          <select
            value={selectedDriverId}
            onChange={e => setSelectedDriverId(e.target.value)}
            className="bg-slate-900 text-white text-xs font-bold p-2 rounded-xl border border-slate-700 outline-hidden"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Carga Atual do Motoqueiro */}
      {driver && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Estoque Carregado na Moto
            </span>
            <span className="text-xs font-bold text-slate-400">{driver.vehicle}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl">
              <span className="text-emerald-700 block font-black text-lg">{driver.currentBottlesLoaded.p13Full}</span>
              <span className="text-[10px] font-bold text-emerald-800">P13 Cheio</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-2xl">
              <span className="text-amber-700 block font-black text-lg">{driver.currentBottlesLoaded.p13Empty}</span>
              <span className="text-[10px] font-bold text-amber-800">P13 Vazio</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-2xl">
              <span className="text-blue-700 block font-black text-lg">{driver.currentBottlesLoaded.waterFull}</span>
              <span className="text-[10px] font-bold text-blue-800">20L Cheio</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-2xl">
              <span className="text-indigo-700 block font-black text-lg">{driver.currentBottlesLoaded.waterEmpty}</span>
              <span className="text-[10px] font-bold text-indigo-800">20L Vazio</span>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Entregas no Roteiro */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Fila de Entregas ({myPendingOrders.length})
          </span>
          <span className="text-[11px] font-bold text-slate-400">Em tempo real</span>
        </div>

        {myPendingOrders.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-base font-black text-slate-900">Roteiro Limpo!</p>
            <p className="text-xs text-slate-400 mt-1">Todas as entregas atribuídas foram finalizadas.</p>
          </div>
        ) : (
          myPendingOrders.map(order => (
            <div 
              key={order.id}
              className="bg-white rounded-3xl border-2 border-blue-600/30 p-5 shadow-md space-y-3 relative overflow-hidden"
            >
              {/* Topo do card mobile */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-slate-400">{order.id}</span>
                <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  R$ {order.total.toFixed(2)} • {order.paymentMethod.toUpperCase()}
                </span>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="font-black text-slate-900 text-base">{order.customerName}</h3>
                <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{order.address}</span>
                </p>
              </div>

              {/* Itens */}
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-100">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between font-bold text-slate-800">
                    <span>{i.quantity}x {i.productName}</span>
                    <span className="text-blue-600">R$ {(i.unitPrice * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {order.changeFor && (
                  <div className="text-amber-800 font-black text-[11px] pt-1.5 border-t border-slate-200">
                    ⚠️ Atenção: Levar troco para R$ {order.changeFor.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Ações de Trânsito */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  Traçar Rota GPS
                </a>

                <a
                  href={`https://wa.me/55${order.customerPhone}?text=Olá ${order.customerName}, o motoqueiro da Gás e Água já está chegando com sua entrega!`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Avisar Chegada
                </a>
              </div>

              {/* Botão de Finalização da Entrega */}
              <button
                onClick={() => handleCompleteOrder(order.id, order.emptyBottlesReturned || 1)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <PackageCheck className="w-5 h-5" />
                Confirmar Entrega Realizada
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
