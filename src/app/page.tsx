'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { OrderDesk } from '@/components/OrderDesk';
import { BottleControl } from '@/components/BottleControl';
import { ReorderCRM } from '@/components/ReorderCRM';
import { AccountsReceivable } from '@/components/AccountsReceivable';
import { DriverSettlement } from '@/components/DriverSettlement';
import { InventoryManagement } from '@/components/InventoryManagement';
import { CustomerList } from '@/components/CustomerList';
import { DriverView } from '@/components/DriverView';
import { RotateCcw } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('pdv');
  const { orders, customers, resetToDefaults } = useApp();

  const pendingCount = orders.filter(o => o.status === 'pendente').length;
  const todayTotalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelado' ? o.total : 0), 0);
  const debtorCount = customers.filter(c => c.creditBalance > 0).length;

  const [reorderAlertCount, setReorderAlertCount] = useState(0);

  useEffect(() => {
    const count = customers.filter(c => {
      if (!c.lastPurchaseDate) return false;
      const diffDays = Math.ceil(Math.abs(Date.now() - new Date(c.lastPurchaseDate).getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= c.avgConsumptionDays;
    }).length;
    setReorderAlertCount(count);
  }, [customers]);

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-800">
      
      {/* Barra de Navegação Superior */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount}
        reorderAlertCount={reorderAlertCount}
        debtorCount={debtorCount}
        todayTotalRevenue={todayTotalRevenue}
      />

      {/* Conteúdo Dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {activeTab === 'pdv' && <OrderDesk />}
        {activeTab === 'cascos' && <BottleControl />}
        {activeTab === 'recompra' && <ReorderCRM />}
        {activeTab === 'contas_receber' && <AccountsReceivable />}
        {activeTab === 'acerto' && <DriverSettlement />}
        {activeTab === 'estoque' && <InventoryManagement />}
        {activeTab === 'clientes' && <CustomerList />}
        {activeTab === 'entregador_view' && <DriverView />}
      </main>

      {/* Rodapé Clean */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Gás & Água Pro</span>
            <span className="text-slate-400">• Sistema Operacional para Revendas de GLP e Água Mineral</span>
          </div>

          <button
            onClick={() => {
              if (confirm('Deseja restaurar os dados de demonstração originais?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Demonstração</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
