# São João Batista — Sistema de Registro de Saídas

## Visão Geral

Sistema web progressivo (PWA) para registro de pedidos e saída de itens da Lanchonete São João Batista, localizada em Cedro de São João, Sergipe. O sistema foi projetado para usuários com pouco domínio tecnológico e visão reduzida, priorizando **simplicidade extrema**, **botões grandes** e **fluxo de no máximo 3 toques** para registrar um pedido.

Os registros são salvos em tempo real em um banco de dados (Supabase/PostgreSQL) e podem ser exportados a qualquer momento como planilha Excel (.xlsx).

---

## Requisitos Funcionais

### RF-01 — Registro de pedido
- O usuário deve ser capaz de registrar um pedido selecionando itens de uma grade visual (grid de cards grandes).
- Cada card de item exibe: nome do item e preço unitário.
- Ao tocar em um card, o item é adicionado ao pedido atual com quantidade 1.
- Toques subsequentes no mesmo card incrementam a quantidade (+1 por toque).
- Um botão "-" visível em cada item do pedido permite decrementar (mínimo 0, que remove o item).
- O total do pedido é calculado automaticamente e exibido em destaque na parte inferior da tela.

### RF-02 — Confirmação e salvamento
- Após montar o pedido, o usuário toca no botão "CONFIRMAR PEDIDO".
- Uma tela de confirmação resume: itens, quantidades, subtotais e total geral.
- O usuário confirma com um botão grande "✓ SALVAR" ou cancela com "← VOLTAR".
- Ao salvar: o pedido é gravado no banco de dados e adicionado ao registro da planilha.

### RF-03 — Exportação para Excel
- Uma tela "Exportar" permite escolher um intervalo de datas (data inicial e data final).
- O sistema gera e baixa um arquivo .xlsx com os pedidos do período.
- A planilha contém as colunas: Data, Hora, Item, Quantidade, Preço Unitário, Subtotal, Total do Pedido.
- Cada item de cada pedido ocupa uma linha. O total do pedido aparece apenas na última linha do grupo.

### RF-04 — Gerenciamento de itens (área administrativa)
- Tela protegida por PIN de 4 dígitos (definido em variável de ambiente).
- Permite: criar item (nome + preço), editar item existente, ativar/desativar item.
- Itens inativos não aparecem na tela de pedido, mas seus históricos são preservados.

### RF-05 — Histórico de pedidos
- Tela simples listando os pedidos do dia atual (padrão) com opção de filtrar por data.
- Exibe: horário, itens resumidos, total. Sem edição — apenas consulta.

---

## Requisitos Não Funcionais

### RNF-01 — Acessibilidade para usuários idosos
- Tamanho mínimo de fonte: **20px** para textos de suporte, **28px** para nomes de itens, **40px** para preços e totais.
- Área mínima tocável de todos os botões: **72px × 72px**.
- Contraste de cores WCAG AA (mínimo 4,5:1 para texto normal, 3:1 para texto grande).
- Paleta de cores: fundo branco, texto preto/cinza escuro, botão principal laranja/vermelho (#E05A00 ou similar), botão de cancelar cinza neutro.
- Feedback visual imediato ao tocar (escurecer/pulsação do botão).
- Sem modais complexos. Navegação linear e previsível.
- Mensagens de erro em português claro, sem jargão técnico.

### RNF-02 — Funcionamento offline parcial
- O PWA deve funcionar sem internet para registrar pedidos localmente (usando IndexedDB como fila).
- Quando a conexão retornar, os pedidos na fila são sincronizados automaticamente com o Supabase.
- Um indicador simples (ícone de nuvem) mostra o status de sincronização.

### RNF-03 — Performance
- O app deve carregar completamente em menos de 3 segundos em conexão 4G.
- As interações de toque devem responder em menos de 100ms (sem delays perceptíveis).

### RNF-04 — PWA (instalável)
- O app deve ter um arquivo `manifest.json` correto para ser instalável via "Adicionar à tela inicial" em Android e iOS.
- Ícone do app: simples, legível, referência à identidade da lanchonete.
- Service Worker configurado para cache de assets estáticos.

---

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR, suporte a PWA, deploy simples na Vercel |
| Linguagem | **TypeScript** | Tipagem previne bugs em produção |
| Estilização | **Tailwind CSS** | Utilidades de tamanho/contraste fáceis de ajustar |
| Banco de dados | **Supabase** (PostgreSQL) | Gratuito, tempo real, SDK simples, backup automático |
| Exportação Excel | **SheetJS (xlsx)** | Geração client-side de .xlsx sem servidor |
| Cache offline | **Dexie.js** (IndexedDB) | API simples para fila de sincronização offline |
| Deploy | **Vercel** | Integração nativa com Next.js, HTTPS automático, tier gratuito |
| PWA | **next-pwa** | Plugin para geração automática de Service Worker |
| Ícones | **Lucide React** | Ícones claros e legíveis |

---

## Estrutura do Banco de Dados (Supabase)

### Tabela: `items`
```sql
CREATE TABLE items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Tabela: `orders`
```sql
CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total       NUMERIC(10, 2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced      BOOLEAN NOT NULL DEFAULT true  -- false = veio de fila offline
);
```

### Tabela: `order_items`
```sql
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES items(id),
  item_name     TEXT NOT NULL,  -- snapshot do nome na hora da venda
  unit_price    NUMERIC(10, 2) NOT NULL,  -- snapshot do preço na hora da venda
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  subtotal      NUMERIC(10, 2) NOT NULL
);
```

> **Importante:** `item_name` e `unit_price` são snapshots do momento da venda. Se o preço de um item for alterado depois, os registros históricos permanecem corretos.

---

## Estrutura do Projeto (Diretórios)

```
/
├── app/
│   ├── layout.tsx              # Layout global (fonte, metadata, PWA tags)
│   ├── page.tsx                # Tela principal: registro de pedido
│   ├── confirmar/
│   │   └── page.tsx            # Tela de confirmação do pedido
│   ├── historico/
│   │   └── page.tsx            # Histórico de pedidos
│   ├── exportar/
│   │   └── page.tsx            # Exportação Excel
│   └── admin/
│       └── page.tsx            # Gerenciamento de itens (protegida por PIN)
├── components/
│   ├── ItemCard.tsx             # Card de item (botão grande)
│   ├── OrderSummary.tsx         # Resumo do pedido em construção
│   ├── ConfirmScreen.tsx        # Tela de confirmação
│   ├── NavBar.tsx               # Barra de navegação inferior
│   └── SyncIndicator.tsx        # Indicador de status offline/online
├── lib/
│   ├── supabase.ts              # Cliente Supabase
│   ├── db.ts                    # Dexie.js (IndexedDB para offline)
│   ├── sync.ts                  # Lógica de sincronização offline→Supabase
│   └── excel.ts                 # Geração de arquivo .xlsx com SheetJS
├── hooks/
│   ├── useItems.ts              # Busca itens ativos do Supabase
│   ├── useOrder.ts              # Estado do pedido em construção
│   └── useSync.ts               # Gerencia fila de sincronização
├── store/
│   └── orderStore.ts            # Zustand: estado global do pedido atual
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service Worker (gerado pelo next-pwa)
│   └── icons/                   # Ícones do PWA (192px, 512px)
├── .env.local                   # Variáveis de ambiente (não commitar)
└── next.config.js               # Configuração Next.js + PWA
```

---

## Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
ADMIN_PIN=1234
```

> O `ADMIN_PIN` deve ser validado no servidor (Route Handler do Next.js), nunca exposto ao cliente.

---

## Fluxo de Uso (UX)

### Tela Principal (Registro de Pedido)
1. Grade de cards grandes com todos os itens ativos.
2. Abaixo da grade: resumo do pedido atual (itens selecionados, total).
3. Botão "CONFIRMAR PEDIDO" (verde, muito grande) fixo na parte inferior.
4. Se o pedido estiver vazio, o botão fica desativado (cinza).

### Tela de Confirmação
1. Lista dos itens do pedido com quantidade e subtotal.
2. Total em destaque (fonte grande).
3. Dois botões grandes: "✓ SALVAR PEDIDO" (verde) e "← VOLTAR" (cinza).
4. Ao salvar: animação de sucesso ("✓ Pedido salvo!"), retorno automático para tela principal com pedido zerado.

### Navegação
- Barra de navegação inferior com 4 ícones grandes:
  - 🏠 Pedido (tela principal)
  - 📋 Histórico
  - 📥 Exportar
  - ⚙️ Admin (solicita PIN)

---

## Exportação Excel — Estrutura da Planilha

Nome do arquivo: `saidas_AAAA-MM-DD_a_AAAA-MM-DD.xlsx`

| Data | Hora | Pedido # | Item | Qtd | Preço Unit. | Subtotal | Total do Pedido |
|---|---|---|---|---|---|---|---|
| 10/05/2025 | 09:32 | 1 | X-Burguer | 2 | R$ 15,00 | R$ 30,00 | |
| 10/05/2025 | 09:32 | 1 | Suco de Laranja | 1 | R$ 8,00 | R$ 8,00 | R$ 38,00 |
| 10/05/2025 | 10:15 | 2 | Coxinha | 3 | R$ 5,00 | R$ 15,00 | R$ 15,00 |

- A coluna "Total do Pedido" é preenchida apenas na **última linha** de cada pedido.
- Linhas do mesmo pedido têm fundo levemente colorido alternado para facilitar leitura.
- Cabeçalho fixo com negrito.
- Colunas de valores formatadas como moeda brasileira (R$).

---

## Design Visual

### Filosofia
O design deve ser **utilitário e acessível em primeiro lugar**. Sem frivolidades decorativas. O objetivo é que um usuário de 65 anos, com visão cansada, use o sistema sem ajuda após 5 minutos de explicação.

### Paleta de Cores
```
Fundo principal:     #FFFFFF (branco)
Texto principal:     #1A1A1A (quase preto)
Cor de destaque:     #C4420A (laranja queimado — referência à identidade da lanchonete)
Botão confirmar:     #1A7A3A (verde escuro)
Botão cancelar:      #6B7280 (cinza neutro)
Fundo de card:       #FFF7F0 (laranja muito claro)
Borda de card ativo: #C4420A
Erro:                #DC2626 (vermelho)
```

### Tipografia
- Fonte principal: **Nunito** (Google Fonts) — arredondada, legível em tamanhos grandes
- Nunca usar fonte menor que 20px em textos de conteúdo
- Nome dos itens: 24px, negrito
- Preços: 28px, negrito
- Total do pedido: 40px, negrito, cor de destaque

### Componente ItemCard
```
- Mínimo 160px × 160px no celular
- Borda arredondada (border-radius: 16px)
- Sombra suave (box-shadow)
- Nome centralizado, preço abaixo do nome
- Quando selecionado: borda laranja 3px + badge com quantidade no canto superior direito (badge grande, fundo laranja, número branco)
- Feedback de toque: scale(0.96) por 100ms
```

---

## Configuração Inicial de Dados

Ao configurar o sistema pela primeira vez, popular a tabela `items` com os itens reais vendidos na lanchonete. O administrador pode fazer isso pela tela Admin ou diretamente via Supabase Dashboard.

---

## Dados Iniciais — Seed do Cardápio

Ao criar o banco de dados no Supabase, executar o seguinte SQL para popular a tabela `items` com o cardápio inicial da lanchonete. Todos os itens iniciam como `active = true`.

```sql
INSERT INTO items (name, price) VALUES
  -- Lanches
  ('Misto', 5.00),
  ('Americano', 6.00),
  ('Hambúrguer', 6.00),
  ('X-Burguer', 7.50),
  ('Egga Burguer', 8.50),
  ('Super Burguer', 11.00),
  ('Frango', 8.50),
  ('X-Frango', 10.00),
  ('Egga Frango', 11.00),
  ('Frango Burguer', 12.00),
  ('X-Bacon', 11.00),
  ('X-Bacon Acebolado', 11.50),
  ('Egga Bacon', 12.50),
  ('Egga Bacon Acebolado', 13.00),
  ('Bacon Burguer', 14.00),
  ('Bacon Burguer Acebolado', 14.50),
  ('X-Calabresa', 11.50),
  ('X-Calabresa Acebolado', 12.00),
  ('Eggs Calabresa', 13.00),
  ('Eggs Calabresa Acebolado', 13.50),
  ('X Coração', 13.50),
  ('X Coração Acebolado', 14.00),
  ('Eggs Coração', 14.50),
  ('Eggs Coração Acebolado', 15.00),
  ('Coração Burguer', 15.50),
  ('Coração Burguer Acebolado', 16.00),
  ('X Filé', 14.00),
  ('X Filé Acebolado', 14.50),
  ('Eggs Filé', 15.50),
  ('Eggs Filé Acebolado', 16.00),
  -- Salgados e doces
  ('Salgado', 4.00),
  ('Torta Salgada', 5.50),
  ('Bolo Chocolate', 7.00),
  ('Torta Gelada', 6.00),
  ('Empada', 3.50),
  ('Mousse', 4.00),
  ('Doce de Leite', 4.00),
  ('Pudim', 6.00),
  ('Pavê', 6.00),
  ('Brigadeiro', 1.50),
  ('Trufa', 2.00),
  -- Bebidas (latas e garrafinhas)
  ('Goob', 2.00),
  ('Mini Lata', 2.50),
  ('Antarctica Mini', 4.50),
  ('Refrigerante Lata', 5.50),
  ('Latão', 6.50),
  ('Jesus', 6.00),
  ('Shweppes', 6.00),
  ('Refrigerante 500 ml', 6.50),
  -- Bebidas (litros e 2 litros)
  ('Coca Litro', 9.00),
  ('Coca Zero Litro', 9.00),
  ('Coca LS', 9.00),
  ('Guaraná Litro', 8.00),
  ('Fanta Litro', 8.00),
  ('Pepsi Litro', 7.00),
  ('Kuat Litro', 6.50),
  ('Coca 2 Litros', 15.00),
  ('Guaraná 2 Litros', 14.00),
  ('Twister 2 Litros', 14.00),
  ('Kuat 2 Litros', 10.00),
  -- Sucos e bebidas especiais
  ('Guaramix Copo', 3.00),
  ('Guaramix Garrafa', 5.50),
  ('Skinka', 5.50),
  ('Kapo', 3.50),
  ('Maratá', 2.50),
  ('Achocolatado', 2.50),
  ('Nescau', 3.50),
  ('Água de Coco', 5.00),
  ('Água S/Gás', 2.00),
  ('Água C/Gás', 3.00),
  ('Água 1/5', 4.00),
  ('H2O', 6.00),
  ('Red Bull', 12.00),
  ('Monster', 12.00),
  ('TNT', 12.00),
  ('Suco Polpa', 6.00);
```

> **Nota para Claude Code:** este SQL deve ser incluído em um arquivo `supabase/seed.sql` na raiz do projeto, e também documentado no `README.md` como passo obrigatório da configuração inicial.

---

## Deploy

### Passo a passo resumido para Claude Code seguir:
1. Criar projeto Next.js: `npx create-next-app@latest sao-joao-batista --typescript --tailwind --app`
2. Instalar dependências: `npm install @supabase/supabase-js xlsx dexie zustand next-pwa lucide-react`
3. Configurar `next.config.js` com `next-pwa`
4. Criar as tabelas no Supabase (SQL acima)
5. Configurar `.env.local` com as credenciais
6. Implementar as telas na ordem: ItemCard → Tela Principal → Confirmação → Histórico → Exportar → Admin
7. Testar fluxo offline: desligar internet, registrar pedido, religar, verificar sincronização
8. Deploy na Vercel: `vercel deploy` ou push para repositório GitHub conectado

---

## Fora do Escopo (não implementar agora)

- Login com usuário e senha (o PIN do admin é suficiente)
- Controle de caixa / troco
- Relatórios gráficos / dashboards
- Impressão de cupom
- Múltiplos usuários simultâneos
- Gestão de estoque
- Integração com sistema fiscal (nota fiscal)

Esses itens podem ser adicionados em versões futuras sem quebrar a arquitetura atual.
