-- =========================================================================
-- Script SQL DDL Oficial para Inicialização do Banco de Dados MySQL
-- Banco: gas_water_pro
-- REGRA DE OURO: Valores monetários são inteiros (INT) em CENTAVOS
-- Evita erros de arredondamento de ponto flutuante / precisão bancária.
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `gas_water_pro` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gas_water_pro`;

-- 1. Tabela de Produtos (Gás P13, P20, P45 e Galão 20L)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `category` ENUM('gas', 'water') NOT NULL,
  `priceRefillCents` INT NOT NULL COMMENT 'Preço refil em centavos (ex: 11000 = R$ 110,00)',
  `priceCompleteCents` INT NOT NULL COMMENT 'Preço completo em centavos (ex: 29000 = R$ 290,00)',
  `costPriceCents` INT NOT NULL COMMENT 'Preço de custo em centavos (ex: 7500 = R$ 75,00)',
  `stockFull` INT NOT NULL DEFAULT 0,
  `stockEmpty` INT NOT NULL DEFAULT 0,
  `icon` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabela de Bairros e Taxas de Entrega
CREATE TABLE IF NOT EXISTS `neighborhood_fees` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL UNIQUE,
  `deliveryFeeCents` INT NOT NULL DEFAULT 0 COMMENT 'Taxa de entrega em centavos (ex: 400 = R$ 4,00)',
  `estimatedMinutes` INT NOT NULL DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabela de Clientes e CRM de Recompra
CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL UNIQUE,
  `address` VARCHAR(255) NOT NULL,
  `neighborhood` VARCHAR(191) NOT NULL,
  `complement` VARCHAR(191) NULL,
  `lastPurchaseDate` DATE NULL,
  `avgConsumptionDays` INT NOT NULL DEFAULT 35,
  `preferredProduct` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `pendingEmpties` INT NOT NULL DEFAULT 0 COMMENT 'Quantidade de botijões que o cliente deve',
  `creditBalanceCents` INT NOT NULL DEFAULT 0 COMMENT 'Dívida a prazo em centavos (ex: 12800 = R$ 128,00)',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabela de Entregadores / Motoqueiros
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `vehicle` VARCHAR(191) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `p13FullLoaded` INT NOT NULL DEFAULT 0,
  `waterFullLoaded` INT NOT NULL DEFAULT 0,
  `p13EmptyLoaded` INT NOT NULL DEFAULT 0,
  `waterEmptyLoaded` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `customerId` VARCHAR(191) NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `customerPhone` VARCHAR(191) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `neighborhood` VARCHAR(191) NOT NULL,
  `deliveryFeeCents` INT NOT NULL DEFAULT 0,
  `subtotalCents` INT NOT NULL,
  `totalCents` INT NOT NULL,
  `paymentMethod` ENUM('dinheiro', 'pix', 'debito', 'credito', 'a_prazo') NOT NULL,
  `paymentStatus` ENUM('pago', 'pendente') NOT NULL DEFAULT 'pendente',
  `status` ENUM('pendente', 'em_rota', 'entregue', 'cancelado') NOT NULL DEFAULT 'pendente',
  `deliveryDriverId` VARCHAR(191) NULL,
  `deliveryDriverName` VARCHAR(191) NULL,
  `emptyBottlesReturned` INT NOT NULL DEFAULT 0,
  `emptyBottlesOwed` INT NOT NULL DEFAULT 0,
  `changeForCents` INT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deliveredAt` DATETIME(3) NULL,
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_driver` (`deliveryDriverId`),
  FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`deliveryDriverId`) REFERENCES `drivers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `productName` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL,
  `isCompleteBottle` BOOLEAN NOT NULL DEFAULT FALSE,
  `unitPriceCents` INT NOT NULL,
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabela de Pagamentos e Quitações de Fiado B2B
CREATE TABLE IF NOT EXISTS `credit_payments` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `customerId` VARCHAR(191) NOT NULL,
  `amountPaidCents` INT NOT NULL,
  `paymentMethod` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabela de Auditoria de Fechamento Cego de Entregador
CREATE TABLE IF NOT EXISTS `driver_settlement_logs` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `driverId` VARCHAR(191) NOT NULL,
  `driverName` VARCHAR(191) NOT NULL,
  `declaredCashCents` INT NOT NULL,
  `declaredPixCents` INT NOT NULL,
  `declaredCardCents` INT NOT NULL,
  `declaredEmpties` INT NOT NULL,
  `systemCashCents` INT NOT NULL,
  `systemPixCents` INT NOT NULL,
  `systemCardCents` INT NOT NULL,
  `systemEmpties` INT NOT NULL,
  `diffCashCents` INT NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `closedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados Iniciais (Valores em Centavos)
INSERT IGNORE INTO `products` (`id`, `name`, `category`, `priceRefillCents`, `priceCompleteCents`, `costPriceCents`, `stockFull`, `stockEmpty`, `icon`) VALUES
('prod-p13', 'Gás de Cozinha P13 (13kg)', 'gas', 11000, 29000, 7500, 84, 32, 'flame'),
('prod-water20l', 'Galão de Água Mineral 20L', 'water', 1600, 4800, 750, 120, 45, 'droplets'),
('prod-p45', 'Cilindro Industrial P45', 'gas', 42000, 98000, 31000, 12, 5, 'cylinder'),
('prod-p20', 'Gás Empilhadeira P20', 'gas', 18000, 45000, 12500, 18, 8, 'truck');

INSERT IGNORE INTO `neighborhood_fees` (`id`, `name`, `deliveryFeeCents`, `estimatedMinutes`) VALUES
('b-1', 'Centro', 0, 15),
('b-2', 'Jardim Primavera', 400, 20),
('b-3', 'Bela Vista', 500, 25),
('b-4', 'Vila Mariana', 600, 30),
('b-5', 'Distrito Industrial', 1200, 40),
('b-6', 'Zona Rural / Chácaras', 1800, 50);
