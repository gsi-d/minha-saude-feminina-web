# Tema global MUI com modo escuro

## Objetivo

Centralizar as cores do sistema no tema da MUI e oferecer modos claro e escuro. A preferência inicial acompanha o sistema operacional e a escolha manual do usuário fica persistida no navegador.

## Arquitetura

O tema usará o suporte nativo de `colorSchemes` da MUI. As cores serão escritas diretamente na configuração do tema, sem constantes intermediárias. O `AppThemeProvider` continuará responsável pela integração com o App Router, pelo `ThemeProvider` e pelo `CssBaseline`.

A paleta ganhará a chave customizada `tertiary`, declarada por module augmentation em TypeScript. Isso permite acessar a cor como `theme.palette.tertiary.main` e por atalhos do `sx`, sem confundi-la com `secondary`.

## Paleta

No esquema claro:

- `primary.main`: `#C56682`
- `secondary.main`: `#fff6f8`
- `tertiary.main`: `#C43A4A`
- `background.default`: `#fff6f8`
- `background.paper`: `#FBF4EB`
- `error.main`: `#b00020`

No esquema escuro, as cores principais da marca permanecem reconhecíveis. Os fundos recebem tons escuros próprios e as cores de texto são escolhidas pela MUI para manter contraste adequado.

## Alternância e persistência

Na primeira visita, o tema acompanha `prefers-color-scheme`. Um botão com ícones de sol e lua, localizado à direita da barra superior, alterna entre claro e escuro. A preferência manual é persistida pelo mecanismo de esquemas de cor da MUI.

O controle terá tooltip e nome acessível. Durante a hidratação, ele evitará assumir um modo antes que a preferência armazenada esteja disponível.

## Estilos globais

O `CssBaseline` controlará fundo, texto e `color-scheme`. As cores fixas de `globals.css` serão removidas, deixando apenas regras estruturais que não pertencem ao tema.

## Tratamento de falhas

Se o navegador não disponibilizar preferência persistida, o sistema continuará seguindo o esquema do sistema operacional. Se JavaScript ainda não tiver hidratado, a página terá uma aparência válida e o seletor será renderizado de modo seguro.

## Testes e verificação

Testes unitários validarão a existência e os valores semânticos das paletas clara e escura, incluindo `tertiary`. O seletor terá seu comportamento verificável por uma função pequena e pura para determinar o próximo modo. A entrega também será verificada com lint, checagem de tipos e build do Next.js.
