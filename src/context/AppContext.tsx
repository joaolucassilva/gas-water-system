'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Driver, Order, NeighborhoodFee, PaymentMethod } from '@/types';

interface AppContextType {
  products: Product[];
  customers: Customer[];
  drivers: Driver[];
  orders: Order[];
  neighborhoods: NeighborhoodFee[];
  loading: boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<{ success: boolean; message?: string; error?: string }>;
  dispatchDriver: (orderId: string, driverId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  completeOrder: (orderId: string, paymentReceived?: boolean, emptiesReturned?: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  loadDriverTruck: (driverId: string, p13Full: number, waterFull: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  unloadDriverTruck: (driverId: string, p13Empty: number, waterEmpty: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  performBlindSettlement: (driverId: string, declaredCash: number, declaredPix: number, declaredCard: number, declaredEmpties: number) => Promise<{ success: boolean; report?: any; error?: string }>;
  payCreditDebt: (customerId: string, amountPaid: number, paymentMethod: PaymentMethod) => Promise<{ success: boolean; message?: string; error?: string }>;
  addCustomer: (customer: Omit<Customer, 'id' | 'pendingEmpties' | 'creditBalance'>) => Promise<{ success: boolean; message?: string }>;
  resetToDefaults: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodFee[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        setProducts(json.products || []);
        setCustomers(json.customers || []);
        setDrivers(json.drivers || []);
        setOrders(json.orders || []);
        setNeighborhoods(json.neighborhoods || []);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao criar pedido' };
      }
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const dispatchDriver = async (orderId: string, driverId: string) => {
    try {
      const res = await fetch('/api/orders/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, driverId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao despachar pedido' };
      }
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const completeOrder = async (orderId: string, paymentReceived = true, emptiesReturned = 1) => {
    try {
      const res = await fetch('/api/orders/dispatch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentReceived, emptyBottlesReturned: emptiesReturned }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao concluir entrega' };
      }
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const loadDriverTruck = async (driverId: string, p13Full: number, waterFull: number) => {
    try {
      const res = await fetch('/api/bottles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, p13Full, waterFull }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao abastecer veículo' };
      }
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const unloadDriverTruck = async (driverId: string, p13Empty: number, waterEmpty: number) => {
    try {
      const res = await fetch('/api/bottles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, p13Empty, waterEmpty }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao descarregar veículo' };
      }
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const performBlindSettlement = async (
    driverId: string,
    declaredCash: number,
    declaredPix: number,
    declaredCard: number,
    declaredEmpties: number
  ) => {
    try {
      const res = await fetch('/api/settlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, declaredCash, declaredPix, declaredCard, declaredEmpties }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro no acerto cego' };
      }
      await refreshData();
      return { success: true, report: data.report };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const payCreditDebt = async (customerId: string, amountPaid: number, paymentMethod: PaymentMethod) => {
    try {
      const res = await fetch('/api/credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, amountPaid, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao baixar débito' };
      }
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addCustomer = async (cust: Omit<Customer, 'id' | 'pendingEmpties' | 'creditBalance'>) => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      pendingEmpties: 0,
      creditBalance: 0,
    };
    setCustomers(prev => [newCust, ...prev]);
    return { success: true };
  };

  const resetToDefaults = async () => {
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        drivers,
        orders,
        neighborhoods,
        loading,
        createOrder,
        dispatchDriver,
        completeOrder,
        loadDriverTruck,
        unloadDriverTruck,
        performBlindSettlement,
        payCreditDebt,
        addCustomer,
        resetToDefaults,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
