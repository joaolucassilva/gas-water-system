export type ProductType = 'gas_p13' | 'gas_p20' | 'gas_p45' | 'water_20l' | 'water_copo';

export interface Product {
  id: string;
  name: string;
  category: 'gas' | 'water';
  priceRefill: number; // Preço com troca de vasilhame
  priceComplete: number; // Preço com casco novo
  costPrice: number;
  stockFull: number; // Estoque cheio
  stockEmpty: number; // Estoque vazio (cascos)
  icon: string;
}

export interface NeighborhoodFee {
  id: string;
  name: string;
  deliveryFee: number;
  estimatedMinutes: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  complement?: string;
  lastPurchaseDate?: string;
  avgConsumptionDays: number; // Ex: a cada 35 dias compra gás
  preferredProduct: string;
  notes?: string;
  pendingEmpties: number; // Vasilhames devidos pelo cliente (fiado de casco)
  creditBalance: number; // Saldo devedor financeiro (fiado monetário de empresas)
}

export type PaymentMethod = 'dinheiro' | 'pix' | 'debito' | 'credito' | 'a_prazo';

export type OrderStatus = 'pendente' | 'em_rota' | 'entregue' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  isCompleteBottle: boolean; // Se comprou o botijão completo ou só a carga
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood: string;
  deliveryFee: number; // Taxa de entrega do bairro
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pago' | 'pendente';
  status: OrderStatus;
  deliveryDriverId?: string;
  deliveryDriverName?: string;
  emptyBottlesReturned: number; // Cascos vazios recolhidos na entrega
  emptyBottlesOwed: number; // Se o cliente ficou devendo casco
  changeFor?: number; // Troco para quanto
  notes?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  active: boolean;
  currentBottlesLoaded: {
    p13Full: number;
    waterFull: number;
    p13Empty: number;
    waterEmpty: number;
  };
}

export interface CashClosing {
  date: string;
  driverId: string;
  driverName: string;
  totalOrdersDelivered: number;
  totalCash: number;
  totalPix: number;
  totalCard: number;
  totalCreditDebt: number; // Fiado
  emptiesReturned: number;
  differenceEmpties: number;
}
