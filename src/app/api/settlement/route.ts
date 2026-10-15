import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BlindSettlementSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = BlindSettlementSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos para fechamento', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { driverId, declaredCash, declaredPix, declaredCard, declaredEmpties } = validated.data;
    const driver = db.drivers.find(d => d.id === driverId);

    if (!driver) {
      return NextResponse.json({ success: false, error: 'Entregador não encontrado' }, { status: 404 });
    }

    // Calcular o que o SISTEMA espera deste motoqueiro
    const deliveredOrders = db.orders.filter(
      o => o.deliveryDriverId === driverId && o.status === 'entregue'
    );

    let systemCash = 0;
    let systemPix = 0;
    let systemCard = 0;
    let systemEmpties = 0;

    deliveredOrders.forEach(o => {
      if (o.paymentMethod === 'dinheiro') systemCash += o.total;
      else if (o.paymentMethod === 'pix') systemPix += o.total;
      else if (o.paymentMethod === 'debito' || o.paymentMethod === 'credito') systemCard += o.total;
      systemEmpties += (o.emptyBottlesReturned || 0);
    });

    // Comparação do Fechamento Cego (Divergências / Quebra de Caixa)
    const diffCash = declaredCash - systemCash;
    const diffPix = declaredPix - systemPix;
    const diffCard = declaredCard - systemCard;
    const diffEmpties = declaredEmpties - systemEmpties;

    const hasFinancialDivergence = Math.abs(diffCash) > 0.05 || Math.abs(diffPix) > 0.05 || Math.abs(diffCard) > 0.05;
    const hasEmptiesDivergence = diffEmpties !== 0;

    const report = {
      driverId,
      driverName: driver.name,
      totalOrders: deliveredOrders.length,
      system: {
        cash: systemCash,
        pix: systemPix,
        card: systemCard,
        empties: systemEmpties,
      },
      declared: {
        cash: declaredCash,
        pix: declaredPix,
        card: declaredCard,
        empties: declaredEmpties,
      },
      differences: {
        diffCash,
        diffPix,
        diffCard,
        diffEmpties,
      },
      status: (!hasFinancialDivergence && !hasEmptiesDivergence) ? 'CONCILIADO_PERFEITO' : 'DIVERGENCIA_ENCONTRADA',
      closedAt: new Date().toISOString(),
    };

    db.logAction('BLIND_SETTLEMENT', report);

    return NextResponse.json({
      success: true,
      report,
      message: (!hasFinancialDivergence && !hasEmptiesDivergence)
        ? 'Caixa conciliado perfeitamente! Sem divergências.'
        : 'Fechamento processado com divergências apontadas para conferência.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
