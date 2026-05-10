-- ============================================================
-- Migration: tabela de adicionais para itens da categoria Lanches
-- Execute no Supabase após migration_add_categoria.sql
-- ============================================================

CREATE TABLE adicionais (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT NOT NULL,
  preco      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ativo      BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_item_adicionais (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id  UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  adicional_nome TEXT NOT NULL,
  preco_unitario NUMERIC(10, 2) NOT NULL,
  quantidade     INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE adicionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_adicionais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON adicionais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON order_item_adicionais FOR ALL USING (true) WITH CHECK (true);

-- Seed inicial de adicionais comuns
INSERT INTO adicionais (nome, preco) VALUES
  ('Carne extra',   4.00),
  ('Ovo',           2.00),
  ('Bacon',         3.00),
  ('Queijo',        2.00),
  ('Alface',        0.00),
  ('Tomate',        0.00),
  ('Cebola',        0.00),
  ('Milho',         1.00),
  ('Catupiry',      3.00),
  ('Molho especial',1.00);
