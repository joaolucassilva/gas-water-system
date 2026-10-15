import { z } from 'zod';

export const MAX_CUSTOMER_EMPTIES_DEBT = 2; // Máximo de cascos que um cliente pode ficar devendo
export const MAX_CUSTOMER_CREDIT_LIMIT = 500; // Limite padrão de fiado em dinheiro para clientes/empresas

export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  productName: z.string().min(1, 'Nome do produto é obrigatório'),
  quantity: z.number().int().positive('Quantidade deve ser pelo menos 1'),
  isCompleteBottle: z.boolean(),
  unitPrice: z.number().positive('Preço unitário deve ser maior que zero'),
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres'),
  customerPhone: z.string().min(8, 'Telefone inválido'),
  address: z.string().min(4, 'Endereço completo é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  deliveryFee: z.number().min(0, 'Taxa de entrega não pode ser negativa').default(0),
  items: z.array(OrderItemSchema).min(1, 'O pedido deve conter pelo menos 1 item'),
  subtotal: z.number().positive('Subtotal deve ser maior que zero'),
  total: z.number().positive('Total deve ser maior que zero'),
  paymentMethod: z.enum(['dinheiro', 'pix', 'debito', 'credito', 'a_prazo']),
  paymentStatus: z.enum(['pago', 'pendente']),
  status: z.enum(['pendente', 'em_rota', 'entregue', 'cancelado']),
  deliveryDriverId: z.string().optional(),
  deliveryDriverName: z.string().optional(),
  emptyBottlesReturned: z.number().int().min(0),
  emptyBottlesOwed: z.number().int().min(0),
  changeFor: z.number().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'dinheiro' && data.changeFor !== undefined && data.changeFor > 0) {
    return data.changeFor >= data.total;
  }
  return true;
}, {
  message: 'O valor do troco não pode ser menor que o total do pedido',
  path: ['changeFor'],
});

export const DispatchDriverSchema = z.object({
  orderId: z.string().min(1, 'ID do pedido obrigatório'),
  driverId: z.string().min(1, 'ID do motorista obrigatório'),
});

export const CompleteOrderSchema = z.object({
  orderId: z.string().min(1, 'ID do pedido obrigatório'),
  paymentReceived: z.boolean().default(true),
  emptyBottlesReturned: z.number().int().min(0).default(1),
});

export const LoadTruckSchema = z.object({
  driverId: z.string().min(1, 'ID do motorista obrigatório'),
  p13Full: z.number().int().min(0),
  waterFull: z.number().int().min(0),
});

export const UnloadTruckSchema = z.object({
  driverId: z.string().min(1, 'ID do motorista obrigatório'),
  p13Empty: z.number().int().min(0),
  waterEmpty: z.number().int().min(0),
});

export const BlindSettlementSchema = z.object({
  driverId: z.string().min(1, 'ID do motorista obrigatório'),
  declaredCash: z.number().min(0, 'Valor declarado não pode ser negativo'),
  declaredPix: z.number().min(0, 'Valor declarado não pode ser negativo'),
  declaredCard: z.number().min(0, 'Valor declarado não pode ser negativo'),
  declaredEmpties: z.number().int().min(0, 'Vasilhames não podem ser negativos'),
});

export const PayCreditDebtSchema = z.object({
  customerId: z.string().min(1, 'ID do cliente obrigatório'),
  amountPaid: z.number().positive('Valor do pagamento deve ser positivo'),
  paymentMethod: z.enum(['dinheiro', 'pix', 'debito', 'credito']),
});
