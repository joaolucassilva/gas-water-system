'use client';

import React from 'react';
import { Order } from '@/types';
import { Printer, X, Check, Flame, Droplets } from 'lucide-react';

interface ThermalReceiptProps {
  order: Order;
  onClose: () => void;
}

export function ThermalReceipt({ order, onClose }: ThermalReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Barra superior de ações */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between print:hidden">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            Impressão Térmica (58mm / 80mm)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cupom Impresso Formatado Estilo Bobina Térmica */}
        <div id="thermal-print-area" className="p-6 font-mono text-xs text-slate-900 bg-slate-50 space-y-3 leading-tight select-all">
          
          {/* Cabeçalho da Empresa */}
          <div className="text-center border-b border-dashed border-slate-400 pb-3 space-y-1">
            <h2 className="font-black text-sm tracking-tight text-slate-950 uppercase">
              DISTRIBUIDORA GÁS & ÁGUA PRO
            </h2>
            <p className="text-[10px] text-slate-600">CNPJ: 12.345.678/0001-90</p>
            <p className="text-[10px] text-slate-600">Av. Principal, 1000 - Disk: (11) 98888-0000</p>
            <p className="text-[10px] text-slate-500 mt-1">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Dados do Pedido & Entrega */}
          <div className="border-b border-dashed border-slate-400 pb-2 space-y-1">
            <div className="flex justify-between font-black text-sm">
              <span>VIA ENTREGA:</span>
              <span className="underline">{order.id}</span>
            </div>
            <div className="text-[11px] font-bold">
              <span>MOTOQUEIRO: </span>
              <span className="uppercase text-blue-900">{order.deliveryDriverName || 'BALCÃO / CENTRAL'}</span>
            </div>
          </div>

          {/* Dados do Cliente e Endereço */}
          <div className="border-b border-dashed border-slate-400 pb-2 space-y-1">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">CLIENTE:</span>
              <span className="font-black text-xs uppercase">{order.customerName}</span>
            </div>
            <div className="text-[11px]">
              <span className="font-bold">FONE: </span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="text-[11px]">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">ENDEREÇO:</span>
              <span className="font-black">{order.address}</span>
            </div>
            <div className="text-[11px]">
              <span className="font-bold">BAIRRO: </span>
              <span className="uppercase">{order.neighborhood}</span>
            </div>
            {order.notes && (
              <div className="p-1.5 bg-amber-100 rounded text-[10px] font-bold text-amber-900 border border-amber-300">
                OBS: {order.notes}
              </div>
            )}
          </div>

          {/* Itens do Pedido */}
          <div className="border-b border-dashed border-slate-400 pb-2 space-y-1.5">
            <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase border-b border-slate-200 pb-1">
              <span>ITEM / DESCRIÇÃO</span>
              <span>TOTAL</span>
            </div>
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between font-bold text-xs">
                <span>{i.quantity}x {i.productName} {i.isCompleteBottle ? '(C/ CASCO)' : ''}</span>
                <span>R$ {(i.unitPrice * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-xs text-slate-600">
                <span>Taxa Entrega ({order.neighborhood}):</span>
                <span>R$ {order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Totais e Forma de Pagamento */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between font-black text-sm">
              <span>TOTAL A COBRAR:</span>
              <span className="text-base font-black">R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold uppercase">
              <span>PAGAMENTO:</span>
              <span className="px-1.5 py-0.5 bg-slate-200 rounded">{order.paymentMethod}</span>
            </div>
            {order.changeFor && (
              <div className="flex justify-between text-[11px] font-black text-amber-800 bg-amber-100 p-1 rounded">
                <span>LEVAR TROCO P/:</span>
                <span>R$ {order.changeFor.toFixed(2)} (Troco: R$ {(order.changeFor - order.total).toFixed(2)})</span>
              </div>
            )}
            <div className="flex justify-between text-[11px] font-bold">
              <span>SITUAÇÃO DO CASCO:</span>
              <span>
                {order.emptyBottlesReturned > 0 ? `RECOLHER ${order.emptyBottlesReturned} VAZIO(S)` :
                 order.emptyBottlesOwed > 0 ? `DEVE ${order.emptyBottlesOwed} CASCO (FIADO)` :
                 'SEM TROCA (CASCO NOVO)'}
              </span>
            </div>
          </div>

          {/* Canhoto de Assinatura */}
          <div className="pt-6 text-center space-y-2 border-t border-dashed border-slate-400">
            <div className="border-b border-slate-500 w-3/4 mx-auto" />
            <p className="text-[9px] uppercase text-slate-600 font-bold">Assinatura do Recebedor</p>
            <p className="text-[8px] text-slate-400">Obrigado pela preferência! Não compre gás sem lacre.</p>
          </div>

        </div>

        {/* Estilo específico para impressora térmica de 58/80mm */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #thermal-print-area, #thermal-print-area * {
              visibility: visible;
            }
            #thermal-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 80mm;
              padding: 0;
              background: white;
            }
          }
        `}</style>

      </div>
    </div>
  );
}
