# 🚀 Gás & Água Pro - Sistema de Gestão para Revendas de GLP e Água Mineral

Sistema completo e moderno para controle operacional, financeiro e logístico de revendas de gás (P13, P20, P45) e galões de água mineral (20L).

---

## 🌟 Funcionalidades Principais

- ⚡ **PDV Balcão Ultrarrápido (3 cliques):** Lançamento ágil de pedidos com identificação instantânea de cliente e taxa de entrega automática por bairro.
- 🔄 **Controle Especial de Vasilhames & Cascos:** Controle de cheios vs. vazios no depósito e em poder dos motoqueiros. Trava automática de inadimplência de cascos.
- 🖨️ **Impressão Térmica de Cupom (58mm / 80mm):** Via de entrega formatada para impressoras de bobina térmica com canhoto de assinatura.
- 📱 **Modo Entregador (PWA Mobile):** Roteiro de entregas para celular com atalhos para traçar rota no GPS (Google Maps) e avisar cliente no WhatsApp.
- 🤖 **CRM Ativo de Recompra:** Cálculo inteligente da velocidade de consumo e disparo de mensagens no WhatsApp para clientes com gás/água perto de acabar.
- 🙈 **Fechamento Cego de Caixa (Anti-fraude):** O entregador declara valores e cascos às cegas, e o backend audita e aponta quebra de caixa.
- 🏢 **Contas a Receber B2B (Vendas a Prazo):** Gestão de faturas e quitações para clientes corporativos (padarias, restaurantes e condomínios).
- 💰 **Precisão Financeira em Centavos (Inteiros):** Valores monetários armazenados como inteiros (`INT`) em centavos para evitar erros de ponto flutuante.
- 🐬 **Modelagem MySQL & Prisma:** Schemas DDL e ORM prontos para persistência relacional de alta performance.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** [Next.js](https://nextjs.org/) (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Back-end:** Next.js Route Handlers (APIs RESTful), Zod para validação rigorosa de esquemas.
- **Banco de Dados:** MySQL (`mysql2` connection pool e `Prisma ORM`).

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/gas-water-system.git
cd gas-water-system
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/gas_water_pro"
```

### 4. Executar em desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
