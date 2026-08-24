# Minha Saúde Feminina — Gestão Web

Esqueleto inicial do painel administrativo de artigos do projeto Minha Saúde Feminina. Este projeto é independente do aplicativo Expo localizado no diretório irmão `minha-saude-feminina-app`.

## Tecnologias

- Next.js com App Router
- React e TypeScript
- Material UI e Emotion
- ESLint

## Como executar

Requisito: Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. A raiz redireciona para `/artigos`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## Estrutura

```text
src/
├── app/                         # Rotas e layouts do Next.js
├── features/
│   └── articles/
│       ├── domain/              # Entidades e tipos do negócio
│       ├── application/         # Portas e contratos dos casos de uso
│       ├── infrastructure/      # Adaptadores de persistência
│       └── presentation/        # Componentes específicos de artigos
└── shared/
    ├── components/              # Componentes compartilhados
    ├── config/                  # Tema e configurações
    └── providers/               # Providers React
```

## Rotas disponíveis

- `/artigos`: estrutura da listagem.
- `/artigos/novo`: estrutura da criação.
- `/artigos/[id]/editar`: estrutura da edição.

## Escopo atual

Esta entrega contém somente a estrutura inicial. O repositório em memória, o CRUD, a validação, o Rich Text Editor, a autenticação e a integração com Supabase ainda não estão implementados.

O contrato `ArticleRepository` permite introduzir primeiro um adaptador em memória e depois substituí-lo por um adaptador Supabase sem acoplar as páginas à persistência.

## Próximas etapas sugeridas

1. Implementar e testar o repositório em memória.
2. Implementar os casos de uso de criação, leitura, atualização e exclusão.
3. Criar formulários e tabela de artigos.
4. Integrar um Rich Text Editor, como TipTap.
5. Definir o formato hipermídia compartilhado com o aplicativo mobile.
6. Implementar autenticação e integração com Supabase.

## Git

O Git não foi inicializado e nenhum commit foi criado. A criação do repositório e os commits ficam sob responsabilidade do mantenedor.
