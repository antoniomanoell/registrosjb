# SJB Lanches — Registro de Saídas

Sistema PWA para registro de pedidos da Lanchonete São João Batista.

## Configuração e Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. No painel do Supabase, vá em **SQL Editor**.
3. Execute o conteúdo do arquivo `supabase/schema.sql` para criar as tabelas.
4. Em seguida, execute o conteúdo de `supabase/seed.sql` para inserir os itens do cardápio.

### 3. Criar o arquivo de variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com os dados do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
ADMIN_PIN=1234
```

- **NEXT_PUBLIC_SUPABASE_URL**: URL do projeto (encontrada em Project Settings → API)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Chave anon/public (encontrada em Project Settings → API)
- **ADMIN_PIN**: PIN de 4 dígitos para acessar a área administrativa

### 4. Rodar em modo desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### 5. Build para produção

```bash
npm run build
npm start
```

### 6. Deploy no Vercel

1. Faça o push do projeto para um repositório GitHub/GitLab.
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`.
4. Clique em **Deploy**.

O PWA será instalável automaticamente nos dispositivos móveis após o deploy.

## Funcionalidades

- **Pedido**: Seleção de itens com contagem de quantidade e resumo do pedido
- **Confirmar**: Revisão e salvamento do pedido (online ou offline)
- **Histórico**: Consulta de pedidos por data
- **Exportar**: Geração de planilha Excel com filtro por período
- **Admin**: Gerenciamento de itens do cardápio (protegido por PIN)
- **Offline**: Pedidos salvos localmente e sincronizados ao retomar conexão

## Ícones PWA

Adicione os arquivos de ícone em `public/icons/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Use o logo da lanchonete ou gere ícones em [realfavicongenerator.net](https://realfavicongenerator.net).
