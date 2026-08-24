# Design do esqueleto inicial do painel Web

## Objetivo

Criar um projeto Next.js independente para a futura gestão de artigos consumidos pelo aplicativo `minha-saude-feminina-app`. Nesta etapa, o projeto conterá apenas a estrutura arquitetural, o layout administrativo e páginas-base, sem CRUD funcional, autenticação ou Supabase.

## Decisões

- Projeto separado em `Curricularização/minha-saude-feminina-web`.
- Next.js com App Router e TypeScript.
- Material UI para tema, layout e componentes visuais.
- Organização por funcionalidade, com camadas internas para artigos.
- Modelo de artigo alinhado aos dados que o aplicativo já consome.
- Repositório em memória como ponto de extensão para a próxima etapa.
- Editor rico representado por um contrato e um placeholder; a integração com TipTap fica para a implementação do CRUD.
- Nenhuma alteração no repositório mobile, nenhum `git init` e nenhum commit automático.

## Arquitetura

`src/app` concentra rotas, layouts e composição de providers do Next.js. `src/features/articles` contém a funcionalidade de artigos e separa domínio, aplicação, infraestrutura e apresentação. `src/shared` reúne componentes e configurações que não pertencem exclusivamente a artigos.

O domínio define o formato canônico de um artigo. A aplicação expõe os contratos dos casos de uso. A infraestrutura reserva a implementação em memória, substituível futuramente por um adaptador Supabase. A apresentação contém os componentes-base usados pelas páginas administrativas.

## Rotas iniciais

- `/`: redireciona para `/artigos`.
- `/artigos`: página-base da listagem.
- `/artigos/novo`: página-base para criação.
- `/artigos/[id]/editar`: página-base para edição.

## Fluxo futuro de dados

A interface chamará casos de uso da camada de aplicação. Esses casos de uso dependerão apenas do contrato de repositório. Durante os testes do CRUD, o contrato será atendido por armazenamento em memória; depois, um adaptador Supabase poderá substituí-lo sem alterar as páginas ou regras de domínio.

## Erros e validação

Nesta etapa não haverá operações sujeitas a erros de persistência. Os contratos deixam espaço para resultados assíncronos e erros tipados na implementação futura. A validação do scaffold será feita por lint, checagem de tipos e build de produção.

## Testes

O scaffold incluirá scripts de lint e typecheck. Testes de comportamento serão introduzidos junto com o CRUD, quando houver regras executáveis para validar.
