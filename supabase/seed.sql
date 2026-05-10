-- ============================================================
-- Seed data for Lanchonete São João Batista
-- Run this AFTER schema.sql
-- ============================================================

INSERT INTO items (name, price, active) VALUES
  -- Salgados
  ('Coxinha', 5.00, true),
  ('Coxinha Grande', 8.00, true),
  ('Croquete', 5.00, true),
  ('Quibe Frito', 5.00, true),
  ('Quibe Assado', 6.00, true),
  ('Empada de Frango', 6.00, true),
  ('Empada de Palmito', 6.00, true),
  ('Pastel de Carne', 6.00, true),
  ('Pastel de Queijo', 6.00, true),
  ('Pastel de Frango', 6.00, true),
  ('Pastel de Pizza', 7.00, true),
  ('Pão de Queijo', 4.00, true),
  ('Pão de Queijo Recheado', 6.00, true),
  ('Esfiha de Carne', 5.00, true),
  ('Esfiha de Queijo', 5.00, true),
  ('Enroladinho de Salsicha', 5.00, true),
  ('Bolinha de Queijo', 5.00, true),
  ('Rissole de Camarão', 7.00, true),
  ('Rissole de Frango', 6.00, true),

  -- Lanches / Sanduíches
  ('X-Salada', 12.00, true),
  ('X-Burguer', 14.00, true),
  ('X-Frango', 13.00, true),
  ('X-Bacon', 16.00, true),
  ('X-Egg', 15.00, true),
  ('X-Tudo', 18.00, true),
  ('Hot-Dog Simples', 10.00, true),
  ('Hot-Dog Completo', 14.00, true),
  ('Misto Quente', 8.00, true),
  ('Bauru', 12.00, true),
  ('Sanduíche Natural de Frango', 10.00, true),
  ('Sanduíche Natural de Atum', 10.00, true),

  -- Porções
  ('Porção de Fritas', 15.00, true),
  ('Porção de Fritas Pequena', 10.00, true),
  ('Porção de Mandioca Frita', 15.00, true),
  ('Porção de Nuggets', 16.00, true),
  ('Porção de Onion Rings', 14.00, true),
  ('Porção de Calabresa', 20.00, true),
  ('Porção Mista (Fritas + Nuggets)', 22.00, true),

  -- Pratos
  ('Prato Feito (PF)', 18.00, true),
  ('Prato Feito Completo', 22.00, true),
  ('Arroz com Feijão', 12.00, true),
  ('Frango Grelhado', 16.00, true),
  ('Bife Grelhado', 18.00, true),
  ('Bife à Milanesa', 18.00, true),
  ('Ovo Frito', 5.00, true),
  ('Macarrão ao Sugo', 14.00, true),
  ('Macarrão à Bolonhesa', 16.00, true),

  -- Pizzas (fatias)
  ('Fatia de Pizza Queijo', 8.00, true),
  ('Fatia de Pizza Calabresa', 9.00, true),
  ('Fatia de Pizza Frango', 9.00, true),
  ('Fatia de Pizza Portuguesa', 10.00, true),
  ('Fatia de Pizza 4 Queijos', 10.00, true),

  -- Doces e sobremesas
  ('Brigadeiro', 3.00, true),
  ('Beijinho', 3.00, true),
  ('Bolo de Chocolate (fatia)', 7.00, true),
  ('Bolo de Cenoura (fatia)', 7.00, true),
  ('Brownie', 8.00, true),
  ('Pudim', 6.00, true),
  ('Açaí 300ml', 16.00, true),
  ('Açaí 500ml', 22.00, true),
  ('Sorvete (1 bola)', 5.00, true),
  ('Sorvete (2 bolas)', 8.00, true),

  -- Bebidas quentes
  ('Café Expresso', 4.00, true),
  ('Café com Leite', 6.00, true),
  ('Cappuccino', 8.00, true),
  ('Chocolate Quente', 8.00, true),
  ('Chá (xícara)', 5.00, true),

  -- Bebidas frias (lata / garrafa)
  ('Água Mineral 500ml', 3.00, true),
  ('Refrigerante Lata', 5.00, true),
  ('Refrigerante 600ml', 7.00, true),
  ('Refrigerante 2L', 12.00, true),
  ('Suco Natural 300ml', 8.00, true),
  ('Suco Natural 500ml', 11.00, true),
  ('Vitamina de Frutas', 10.00, true),
  ('Caldo de Cana 400ml', 7.00, true),
  ('Cerveja Lata 350ml', 6.00, true),
  ('Cerveja Long Neck 355ml', 8.00, true),
  ('Energético 250ml', 9.00, true),
  ('Iogurte de Garrafa', 6.00, true);
