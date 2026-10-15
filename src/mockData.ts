import { Product, Customer, Driver, Order, NeighborhoodFee } from './types';

export const INITIAL_NEIGHBORHOODS: NeighborhoodFee[] = [
  { id: 'b-1', name: 'Centro', deliveryFee: 0.00, estimatedMinutes: 15 },
  { id: 'b-2', name: 'Jardim Primavera', deliveryFee: 4.00, estimatedMinutes: 20 },
  { id: 'b-3', name: 'Bela Vista', deliveryFee: 5.00, estimatedMinutes: 25 },
  { id: 'b-4', name: 'Vila Mariana', deliveryFee: 6.00, estimatedMinutes: 30 },
  { id: 'b-5', name: 'Distrito Industrial', deliveryFee: 12.00, estimatedMinutes: 40 },
  { id: 'b-6', name: 'Zona Rural / Chácaras', deliveryFee: 18.00, estimatedMinutes: 50 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-p13',
    name: 'Gás de Cozinha P13 (13kg)',
    category: 'gas',
    priceRefill: 110.00,
    priceComplete: 290.00,
    costPrice: 75.00,
    stockFull: 84,
    stockEmpty: 32,
    icon: 'flame',
  },
  {
    id: 'prod-water20l',
    name: 'Galão de Água Mineral 20L',
    category: 'water',
    priceRefill: 16.00,
    priceComplete: 48.00,
    costPrice: 7.50,
    stockFull: 120,
    stockEmpty: 45,
    icon: 'droplets',
  },
  {
    id: 'prod-p45',
    name: 'Cilindro Industrial P45',
    category: 'gas',
    priceRefill: 420.00,
    priceComplete: 980.00,
    costPrice: 310.00,
    stockFull: 12,
    stockEmpty: 5,
    icon: 'cylinder',
  },
  {
    id: 'prod-p20',
    name: 'Gás Empilhadeira P20',
    category: 'gas',
    priceRefill: 180.00,
    priceComplete: 450.00,
    costPrice: 125.00,
    stockFull: 18,
    stockEmpty: 8,
    icon: 'truck',
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Carlos "Motoshow"',
    phone: '(11) 98765-4321',
    vehicle: 'Honda Cargo 160 (Placa ABC-1234)',
    active: true,
    currentBottlesLoaded: {
      p13Full: 6,
      waterFull: 4,
      p13Empty: 2,
      waterEmpty: 1
    }
  },
  {
    id: 'drv-2',
    name: 'Roberto Silveira',
    phone: '(11) 97654-3210',
    vehicle: 'Triciclo de Carga (Placa XYZ-9876)',
    active: true,
    currentBottlesLoaded: {
      p13Full: 12,
      waterFull: 8,
      p13Empty: 4,
      waterEmpty: 3
    }
  },
  {
    id: 'drv-3',
    name: 'Marcos Entregas',
    phone: '(11) 91234-5678',
    vehicle: 'Fiorino Refrigerada (Placa GHH-4455)',
    active: true,
    currentBottlesLoaded: {
      p13Full: 20,
      waterFull: 25,
      p13Empty: 10,
      waterEmpty: 12
    }
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Maria de Fátima Oliveira',
    phone: '11988881111',
    address: 'Rua das Flores, 142',
    neighborhood: 'Jardim Primavera',
    complement: 'Casa 2 (Portão Branco)',
    lastPurchaseDate: '2026-09-08',
    avgConsumptionDays: 35,
    preferredProduct: 'Gás de Cozinha P13 (13kg)',
    notes: 'Tocar a campainha duas vezes',
    pendingEmpties: 0,
    creditBalance: 0.00
  },
  {
    id: 'cust-2',
    name: 'Padaria e Confeitaria Bella Vista',
    phone: '11999992222',
    address: 'Av. Brasil, 850',
    neighborhood: 'Centro',
    complement: 'Entrada de serviço nos fundos',
    lastPurchaseDate: '2026-10-06',
    avgConsumptionDays: 7,
    preferredProduct: 'Galão de Água Mineral 20L',
    notes: 'Pede 5 galões por semana. Fatura fechada todo dia 20.',
    pendingEmpties: 2,
    creditBalance: 128.00 // R$ 128 devidos de pedidos a prazo
  },
  {
    id: 'cust-3',
    name: 'Restaurante Sabor Gaúcho',
    phone: '11977773333',
    address: 'Rua XV de Novembro, 310',
    neighborhood: 'Centro',
    complement: 'Cozinha Industrial',
    lastPurchaseDate: '2026-09-15',
    avgConsumptionDays: 28,
    preferredProduct: 'Cilindro Industrial P45',
    notes: 'Precisa de chave de boca para troca',
    pendingEmpties: 0,
    creditBalance: 420.00 // Devedor de 1 P45 a prazo
  },
  {
    id: 'cust-4',
    name: 'João Pedro Mendes',
    phone: '11966664444',
    address: 'Alameda dos Ipês, 77 - Apto 402',
    neighborhood: 'Bela Vista',
    complement: 'Bloco B',
    lastPurchaseDate: '2026-09-02',
    avgConsumptionDays: 40,
    preferredProduct: 'Gás de Cozinha P13 (13kg)',
    notes: 'Interfone 402. Deixar na portaria se não atender.',
    pendingEmpties: 0,
    creditBalance: 0.00
  },
  {
    id: 'cust-5',
    name: 'Clínica Odonto Vida',
    phone: '11955555555',
    address: 'Rua São Paulo, 520 - Sala 3',
    neighborhood: 'Centro',
    lastPurchaseDate: '2026-10-01',
    avgConsumptionDays: 12,
    preferredProduct: 'Galão de Água Mineral 20L',
    notes: 'Recepcionista Carla assina canhoto',
    pendingEmpties: 0,
    creditBalance: 0.00
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PED-1001',
    customerName: 'Maria de Fátima Oliveira',
    customerPhone: '11988881111',
    address: 'Rua das Flores, 142',
    neighborhood: 'Jardim Primavera',
    deliveryFee: 4.00,
    items: [
      {
        productId: 'prod-p13',
        productName: 'Gás de Cozinha P13 (13kg)',
        quantity: 1,
        isCompleteBottle: false,
        unitPrice: 110.00
      }
    ],
    subtotal: 110.00,
    total: 114.00,
    paymentMethod: 'pix',
    paymentStatus: 'pago',
    status: 'entregue',
    deliveryDriverId: 'drv-1',
    deliveryDriverName: 'Carlos "Motoshow"',
    emptyBottlesReturned: 1,
    emptyBottlesOwed: 0,
    notes: 'Portão branco',
    createdAt: '2026-10-14T09:15:00',
    deliveredAt: '2026-10-14T09:42:00'
  },
  {
    id: 'PED-1002',
    customerName: 'Padaria e Confeitaria Bella Vista',
    customerPhone: '11999992222',
    address: 'Av. Brasil, 850',
    neighborhood: 'Centro',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-water20l',
        productName: 'Galão de Água Mineral 20L',
        quantity: 4,
        isCompleteBottle: false,
        unitPrice: 16.00
      }
    ],
    subtotal: 64.00,
    total: 64.00,
    paymentMethod: 'a_prazo',
    paymentStatus: 'pendente',
    status: 'em_rota',
    deliveryDriverId: 'drv-2',
    deliveryDriverName: 'Roberto Silveira',
    emptyBottlesReturned: 0,
    emptyBottlesOwed: 0,
    notes: 'Entregar na copa dos fundos',
    createdAt: '2026-10-14T11:20:00'
  },
  {
    id: 'PED-1003',
    customerName: 'Dona Antônia Santos',
    customerPhone: '11944443333',
    address: 'Rua Amazonas, 98',
    neighborhood: 'Vila Mariana',
    deliveryFee: 6.00,
    items: [
      {
        productId: 'prod-p13',
        productName: 'Gás de Cozinha P13 (13kg)',
        quantity: 1,
        isCompleteBottle: false,
        unitPrice: 110.00
      },
      {
        productId: 'prod-water20l',
        productName: 'Galão de Água Mineral 20L',
        quantity: 1,
        isCompleteBottle: false,
        unitPrice: 16.00
      }
    ],
    subtotal: 126.00,
    total: 132.00,
    paymentMethod: 'dinheiro',
    paymentStatus: 'pendente',
    status: 'pendente',
    emptyBottlesReturned: 0,
    emptyBottlesOwed: 0,
    changeFor: 150.00,
    notes: 'Troco para 150',
    createdAt: '2026-10-14T12:10:00'
  }
];
