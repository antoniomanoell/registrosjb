-- ============================================================
-- Migration: adiciona coluna "categoria" na tabela items
-- Execute este SQL no Supabase APÓS o schema.sql inicial
-- ============================================================

ALTER TABLE items ADD COLUMN IF NOT EXISTS categoria TEXT NOT NULL DEFAULT 'Outros';

-- Atualizar categorias dos itens já existentes no banco
UPDATE items SET categoria = 'Salgados' WHERE name IN (
  'Coxinha', 'Coxinha Grande', 'Croquete', 'Quibe Frito', 'Quibe Assado',
  'Empada de Frango', 'Empada de Palmito', 'Pastel de Carne', 'Pastel de Queijo',
  'Pastel de Frango', 'Pastel de Pizza', 'Pão de Queijo', 'Pão de Queijo Recheado',
  'Esfiha de Carne', 'Esfiha de Queijo', 'Enroladinho de Salsicha', 'Bolinha de Queijo',
  'Rissole de Camarão', 'Rissole de Frango'
);

UPDATE items SET categoria = 'Lanches' WHERE name IN (
  'X-Salada', 'X-Burguer', 'X-Frango', 'X-Bacon', 'X-Egg', 'X-Tudo',
  'Hot-Dog Simples', 'Hot-Dog Completo', 'Misto Quente', 'Bauru',
  'Sanduíche Natural de Frango', 'Sanduíche Natural de Atum'
);

UPDATE items SET categoria = 'Porções' WHERE name IN (
  'Porção de Fritas', 'Porção de Fritas Pequena', 'Porção de Mandioca Frita',
  'Porção de Nuggets', 'Porção de Onion Rings', 'Porção de Calabresa',
  'Porção Mista (Fritas + Nuggets)'
);

UPDATE items SET categoria = 'Pratos' WHERE name IN (
  'Prato Feito (PF)', 'Prato Feito Completo', 'Arroz com Feijão', 'Frango Grelhado',
  'Bife Grelhado', 'Bife à Milanesa', 'Ovo Frito', 'Macarrão ao Sugo', 'Macarrão à Bolonhesa'
);

UPDATE items SET categoria = 'Pizzas' WHERE name IN (
  'Fatia de Pizza Queijo', 'Fatia de Pizza Calabresa', 'Fatia de Pizza Frango',
  'Fatia de Pizza Portuguesa', 'Fatia de Pizza 4 Queijos'
);

UPDATE items SET categoria = 'Doces e Sobremesas' WHERE name IN (
  'Brigadeiro', 'Beijinho', 'Bolo de Chocolate (fatia)', 'Bolo de Cenoura (fatia)',
  'Brownie', 'Pudim', 'Açaí 300ml', 'Açaí 500ml', 'Sorvete (1 bola)', 'Sorvete (2 bolas)'
);

UPDATE items SET categoria = 'Bebidas Quentes' WHERE name IN (
  'Café Expresso', 'Café com Leite', 'Cappuccino', 'Chocolate Quente', 'Chá (xícara)'
);

UPDATE items SET categoria = 'Bebidas Frias' WHERE name IN (
  'Água Mineral 500ml', 'Refrigerante Lata', 'Refrigerante 600ml', 'Refrigerante 2L',
  'Suco Natural 300ml', 'Suco Natural 500ml', 'Vitamina de Frutas', 'Caldo de Cana 400ml',
  'Cerveja Lata 350ml', 'Cerveja Long Neck 355ml', 'Energético 250ml', 'Iogurte de Garrafa'
);
