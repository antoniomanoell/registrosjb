-- ============================================================
-- Migration: taxa de entrega e configurações
-- Execute no Supabase após migration_adicionais.sql
-- ============================================================

-- Tabela de configurações gerais do sistema
CREATE TABLE configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);

ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON configuracoes FOR ALL USING (true) WITH CHECK (true);

-- Valor inicial da taxa de entrega
INSERT INTO configuracoes (chave, valor) VALUES ('taxa_entrega', '1.00');

-- Adiciona campos de entrega na tabela de pedidos
ALTER TABLE orders ADD COLUMN IF NOT EXISTS entrega      BOOLEAN        NOT NULL DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS taxa_entrega NUMERIC(10, 2) NOT NULL DEFAULT 0;
