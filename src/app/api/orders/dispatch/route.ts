import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DispatchDriverSchema, CompleteOrderSchema } from '@/lib/validation';

// POST /api/orders/dispatch - Despachar motoqueiro com validação de carga na moto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = DispatchDriverSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos para despacho', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, driverId } = validated.data;
    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Pedido não encontrado' }, { status: 404 });
    }

    const driver = db.drivers.find(d => d.id === driverId);
    if (!driver) {
      return NextResponse.json({ success: false, error: 'Entregador não encontrado' }, { status: 404 });
    }

    if (!driver.active) {
      return NextResponse.json({ success: false, error: 'Entregador está inativo ou de folga' }, { status: 422 });
    }

    // REGRA: Validar se a moto tem os botijões necessários
    for (const item of order.items) {
      if (item.productId === 'prod-p13' && driver.currentBottlesLoaded.p13Full < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Carga Insuficiente na Moto: O entregador ${driver.name} tem apenas ${driver.currentBottlesLoaded.p13Full} botijão P13 na moto (necessário: ${item.quantity}). Adicione carga a ele na aba "Gestão de Cascos".`,
          },
          { status: 422 }
        );
      }
      if (item.productId === 'prod-water20l' && driver.currentBottlesLoaded.waterFull < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Carga Insuficiente na Moto: O entregador ${driver.name} tem apenas ${driver.currentBottlesLoaded.waterFull} galão 20L na moto (necessário: ${item.quantity}). Adicione carga a ele na aba "Gestão de Cascos".`,
          },
          { status: 422 }
        );
      }
    }

    order.deliveryDriverId = driver.id;
    order.deliveryDriverName = driver.name;
    order.status = 'em_rota';

    db.logAction('DISPATCH_ORDER', { orderId, driverId: driver.id, driverName: driver.name });

    return NextResponse.json({
      success: true,
      order,
      message: `Pedido ${orderId} despachado com sucesso com ${driver.name}!`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/orders/dispatch - Dar baixa e confirmar entrega com recolhimento de casco
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = CompleteOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos para conclusão', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, paymentReceived, emptyBottlesReturned } = validated.data;
    const order = db.orders.find(o => o.id === orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Pedido não encontrado' }, { status: 404 });
    }

    order.status = 'entregue';
    order.deliveredAt = new Date().toISOString();
    order.paymentStatus = paymentReceived ? 'pago' : order.paymentStatus;
    order.emptyBottlesReturned = emptyBottlesReturned;

    // REGRA DE MOVIMENTAÇÃO DE CASCOS NA MOTO
    if (order.deliveryDriverId) {
      const driver = db.drivers.find(d => d.id === order.deliveryDriverId);
      if (driver) {
        order.items.forEach(item => {
          if (item.productId === 'prod-p13') {
            driver.currentBottlesLoaded.p13Full = Math.max(0, driver.currentBottlesLoaded.p13Full - item.quantity);
            driver.currentBottlesLoaded.p13Empty += emptyBottlesReturned;
          } else if (item.productId === 'prod-water20l') {
            driver.currentBottlesLoaded.waterFull = Math.max(0, driver.currentBottlesLoaded.waterFull - item.quantity);
            driver.currentBottlesLoaded.waterEmpty += emptyBottlesReturned;
          }
        });
      }
    }

    db.logAction('COMPLETE_ORDER', { orderId, emptiesReturned: emptyBottlesReturned });

    return NextResponse.json({
      success: true,
      order,
      message: `Entrega ${orderId} concluída com sucesso! Cascos e pagamentos registrados.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
