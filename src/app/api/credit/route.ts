import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PayCreditDebtSchema } from '@/lib/validation';

// POST /api/credit - Baixar/pagar fiado de empresas e clientes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = PayCreditDebtSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos para acerto de contas', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { customerId, amountPaid, paymentMethod } = validated.data;
    const customer = db.customers.find(c => c.id === customerId);

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Cliente não encontrado' }, { status: 404 });
    }

    if (customer.creditBalance <= 0) {
      return NextResponse.json(
        { success: false, error: `O cliente ${customer.name} não possui dívida em aberto no momento.` },
        { status: 422 }
      );
    }

    const previousBalance = customer.creditBalance;
    customer.creditBalance = Math.max(0, customer.creditBalance - amountPaid);

    db.logAction('PAY_CREDIT_DEBT', {
      customerId,
      customerName: customer.name,
      amountPaid,
      paymentMethod,
      previousBalance,
      remainingBalance: customer.creditBalance,
    });

    return NextResponse.json({
      success: true,
      customer,
      message: `Pagamento de R$ ${amountPaid.toFixed(2)} registrado com sucesso via ${paymentMethod.toUpperCase()}! Saldo devedor restante: R$ ${customer.creditBalance.toFixed(2)}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
