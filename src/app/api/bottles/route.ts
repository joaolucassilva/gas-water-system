import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LoadTruckSchema, UnloadTruckSchema } from '@/lib/validation';

// POST /api/bottles - Carregar moto com cheios
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = LoadTruckSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos para carga', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { driverId, p13Full, waterFull } = validated.data;
    const driver = db.drivers.find(d => d.id === driverId);

    if (!driver) {
      return NextResponse.json({ success: false, error: 'Entregador não encontrado' }, { status: 404 });
    }

    const prodP13 = db.products.find(p => p.id === 'prod-p13');
    const prodWater = db.products.find(p => p.id === 'prod-water20l');

    // Validação de estoque no pátio para abastecer a moto
    if (prodP13 && prodP13.stockFull < p13Full) {
      return NextResponse.json(
        { success: false, error: `Estoque insuficiente no pátio: Existem apenas ${prodP13.stockFull} botijões P13 cheios disponíveis.` },
        { status: 422 }
      );
    }

    if (prodWater && prodWater.stockFull < waterFull) {
      return NextResponse.json(
        { success: false, error: `Estoque insuficiente no pátio: Existem apenas ${prodWater.stockFull} galões 20L cheios disponíveis.` },
        { status: 422 }
      );
    }

    // Movimentação
    if (prodP13) prodP13.stockFull -= p13Full;
    if (prodWater) prodWater.stockFull -= waterFull;

    driver.currentBottlesLoaded.p13Full += p13Full;
    driver.currentBottlesLoaded.waterFull += waterFull;

    db.logAction('LOAD_TRUCK', { driverId, p13Full, waterFull });

    return NextResponse.json({
      success: true,
      driver,
      message: 'Carga de botijões cheios transferida com sucesso para o veículo!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/bottles - Descarregar moto com vazios
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = UnloadTruckSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos para descarga', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { driverId, p13Empty, waterEmpty } = validated.data;
    const driver = db.drivers.find(d => d.id === driverId);

    if (!driver) {
      return NextResponse.json({ success: false, error: 'Entregador não encontrado' }, { status: 404 });
    }

    if (driver.currentBottlesLoaded.p13Empty < p13Empty) {
      return NextResponse.json(
        { success: false, error: `O motorista possui apenas ${driver.currentBottlesLoaded.p13Empty} cascos P13 vazios na moto para descarregar.` },
        { status: 422 }
      );
    }

    if (driver.currentBottlesLoaded.waterEmpty < waterEmpty) {
      return NextResponse.json(
        { success: false, error: `O motorista possui apenas ${driver.currentBottlesLoaded.waterEmpty} cascos de água vazios na moto para descarregar.` },
        { status: 422 }
      );
    }

    const prodP13 = db.products.find(p => p.id === 'prod-p13');
    const prodWater = db.products.find(p => p.id === 'prod-water20l');

    driver.currentBottlesLoaded.p13Empty -= p13Empty;
    driver.currentBottlesLoaded.waterEmpty -= waterEmpty;

    if (prodP13) prodP13.stockEmpty += p13Empty;
    if (prodWater) prodWater.stockEmpty += waterEmpty;

    db.logAction('UNLOAD_TRUCK', { driverId, p13Empty, waterEmpty });

    return NextResponse.json({
      success: true,
      driver,
      message: 'Vasilhames vazios devolvidos com sucesso ao pátio da empresa!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
