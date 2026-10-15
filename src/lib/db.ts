import { Product, Customer, Driver, Order, NeighborhoodFee } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_DRIVERS, INITIAL_ORDERS, INITIAL_NEIGHBORHOODS } from '@/mockData';

class MemoryDatabase {
  private static instance: MemoryDatabase;
  public products: Product[] = [...INITIAL_PRODUCTS];
  public customers: Customer[] = [...INITIAL_CUSTOMERS];
  public drivers: Driver[] = [...INITIAL_DRIVERS];
  public orders: Order[] = [...INITIAL_ORDERS];
  public neighborhoods: NeighborhoodFee[] = [...INITIAL_NEIGHBORHOODS];
  public auditLogs: Array<{ id: string; timestamp: string; action: string; details: any }> = [];

  private constructor() {}

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }
    return MemoryDatabase.instance;
  }

  public logAction(action: string, details: any) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    });
  }
}

export const db = MemoryDatabase.getInstance();
