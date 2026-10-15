import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateOrderSchema, MAX_CUSTOMER_EMPTIES_DEBT, MAX_CUSTOMER_CREDIT_LIMIT } from '@/lib/validation';

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: db.orders,
    products: db.products,
    drivers: db.drivers,
    customers: db.customers,
    neighborhoods: db.neighborhoods,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateOrderSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Falha na validação dos dados do pedido.',
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validatedData.data;

    // REGRA 1: Validar se o cliente já ultrapassou o limite de cascos devidos (fiado de vasilhame)
    const existingCustomer = db.customers.find(
      c => c.phone.replace(/\D/g, '') === data.customerPhone.replace(/\D/g, '') ||
           c.name.toLowerCase() === data.customerName.toLowerCase()
    );

    if (existingCustomer && data.emptyBottlesOwed > 0) {
      const totalFutureDebt = existingCustomer.pendingEmpties + data.emptyBottlesOwed;
      if (totalFutureDebt > MAX_CUSTOMER_EMPTIES_DEBT) {
        return NextResponse.json(
          {
            success: false,
            error: `Bloqueio de Casco: O cliente ${existingCustomer.name} já deve ${existingCustomer.pendingEmpties} vasilhame(s). O limite máximo de cascos em fiado é ${MAX_CUSTOMER_EMPTIES_DEBT}. Exija a entrega do vasilhame ou cobre o valor do casco novo.`,
          },
          { status: 422 }
        );
      }
    }

    // REGRA 2: Validar Limite de Crédito Financeiro (Venda a Prazo / Fiado de Empresas)
    if (data.paymentMethod === 'a_prazo') {
      const currentBalance = existingCustomer ? existingCustomer.creditBalance : 0;
      if (currentBalance + data.total > MAX_CUSTOMER_CREDIT_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            error: `Bloqueio Financeiro: Limite de crédito a prazo excedido! O cliente ${data.customerName} já possui R$ ${currentBalance.toFixed(2)} em aberto (limite máximo: R$ ${MAX_CUSTOMER_CREDIT_LIMIT.toFixed(2)}). Exija o acerto dos débitos anteriores antes de liberar nova venda a prazo.`,
          },
          { status: 422 }
        );
      }
    }

    // REGRA 3: Validar Estoque Físico Cheio no Pátio
    for (const item of data.items) {
      const prod = db.products.find(p => p.id === item.productId);
      if (!prod) {
        return NextResponse.json(
          { success: false, error: `Produto não localizado: ${item.productName}` },
          { status: 404 }
        );
      }

      if (prod.stockFull < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Estoque Insuficiente: Restam apenas ${prod.stockFull} unidade(s) de "${prod.name}" no pátio. Quantidade solicitada: ${item.quantity}. Reabasteça o depósito antes de confirmar a venda.`,
          },
          { status: 422 }
        );
      }
    }

    // REGRA 4: Validar Carga do Entregador se já despachado na criação
    if (data.deliveryDriverId) {
      const driver = db.drivers.find(d => d.id === data.deliveryDriverId);
      if (!driver) {
        return NextResponse.json({ success: false, error: 'Motorista não encontrado' }, { status: 404 });
      }

      for (const item of data.items) {
        if (item.productId === 'prod-p13' && driver.currentBottlesLoaded.p13Full < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              error: `O entregador ${driver.name} só possui ${driver.currentBottlesLoaded.p13Full} botijão P13 cheio na moto. Quantidade necessária: ${item.quantity}. Carregue a moto dele primeiro na tela de Cascos.`,
            },
            { status: 422 }
          );
        }
        if (item.productId === 'prod-water20l' && driver.currentBottlesLoaded.waterFull < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              error: `O entregador ${driver.name} só possui ${driver.currentBottlesLoaded.waterFull} galão 20L cheio na moto. Quantidade necessária: ${item.quantity}. Carregue a moto dele primeiro na tela de Cascos.`,
            },
            { status: 422 }
          );
        }
      }
    }

    // DESCONTO DE ESTOQUE
    for (const item of data.items) {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stockFull -= item.quantity;
      }
    }

    // ATUALIZAÇÃO / CADASTRO DE CLIENTE
    if (existingCustomer) {
      existingCustomer.lastPurchaseDate = new Date().toISOString().split('T')[0];
      existingCustomer.pendingEmpties += data.emptyBottlesOwed;
      if (data.paymentMethod === 'a_prazo') {
        existingCustomer.creditBalance += data.total;
      }
    } else {
      db.customers.unshift({
        id: `cust-${Date.now()}`,
        name: data.customerName,
        phone: data.customerPhone,
        address: data.address,
        neighborhood: data.neighborhood,
        lastPurchaseDate: new Date().toISOString().split('T')[0],
        avgConsumptionDays: 35,
        preferredProduct: data.items[0]?.productName || 'Gás P13',
        pendingEmpties: data.emptyBottlesOwed,
        creditBalance: data.paymentMethod === 'a_prazo' ? data.total : 0,
      });
    }

    const newId = `PED-${1000 + db.orders.length + 1}`;
    const newOrder = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);

    db.logAction('CREATE_ORDER', {
      orderId: newId,
      total: data.total,
      customer: data.customerName,
      paymentMethod: data.paymentMethod,
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Pedido criado e validado com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar pedido.', details: error.message },
      { status: 500 }
    );
  }
}
