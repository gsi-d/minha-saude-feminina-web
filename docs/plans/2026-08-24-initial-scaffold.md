# Initial Web Scaffold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar a estrutura inicial independente do painel Web de gestão de artigos.

**Architecture:** Aplicação Next.js organizada por funcionalidade. A feature de artigos separa domínio, aplicação, infraestrutura e apresentação para permitir a troca futura do armazenamento em memória pelo Supabase.

**Tech Stack:** Next.js, React, TypeScript, Material UI, Emotion e ESLint.

---

### Task 1: Configuração do projeto

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `.gitignore`

1. Declarar dependências e scripts do Next.js, MUI e TypeScript.
2. Configurar aliases e opções estritas do TypeScript.
3. Configurar Next.js e ESLint.
4. Não inicializar Git nem criar commit; o usuário fará isso manualmente.

### Task 2: Shell administrativo e tema

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/shared/config/theme.ts`
- Create: `src/shared/providers/AppThemeProvider.tsx`
- Create: `src/shared/components/AdminShell.tsx`

1. Definir o tema MUI.
2. Configurar o provider para renderização com App Router.
3. Criar navegação administrativa mínima.
4. Redirecionar a raiz para `/artigos`.

### Task 3: Estrutura arquitetural de artigos

**Files:**
- Create: `src/features/articles/domain/article.ts`
- Create: `src/features/articles/application/ArticleRepository.ts`
- Create: `src/features/articles/application/article-use-cases.ts`
- Create: `src/features/articles/infrastructure/InMemoryArticleRepository.ts`
- Create: `src/features/articles/presentation/ArticleEditorPlaceholder.tsx`
- Create: `src/features/articles/index.ts`

1. Definir entidade e dados de entrada do artigo.
2. Definir contrato de persistência.
3. Declarar contratos dos casos de uso.
4. Criar adaptador em memória vazio e substituível.
5. Criar placeholder para o futuro Rich Text Editor.

### Task 4: Páginas-base

**Files:**
- Create: `src/app/artigos/page.tsx`
- Create: `src/app/artigos/novo/page.tsx`
- Create: `src/app/artigos/[id]/editar/page.tsx`
- Create: `src/features/articles/presentation/ArticlePageHeader.tsx`
- Create: `src/features/articles/presentation/EmptyArticlesState.tsx`

1. Criar página estrutural de listagem.
2. Criar páginas estruturais de criação e edição.
3. Reutilizar componentes de apresentação da feature.

### Task 5: Documentação e verificação

**Files:**
- Create: `README.md`
- Create: `.env.example`

1. Documentar comandos, arquitetura e próximos passos.
2. Instalar dependências.
3. Executar `npm run lint`.
4. Executar `npm run typecheck`.
5. Executar `npm run build`.
6. Entregar os arquivos sem criar commits.
