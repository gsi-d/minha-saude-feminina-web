# Arquivamento de artigos

## Objetivo

Permitir que uma pessoa administradora arquive um artigo diretamente no formulário de edição, usando o status `ARQUIVADO` que já existe no domínio, na API e no banco.

## Experiência

- A ação **Arquivar** aparece somente ao editar um artigo que ainda não esteja arquivado.
- Ao selecionar a ação, o sistema abre um diálogo de confirmação do Material UI.
- Cancelar o diálogo não salva nem altera o artigo.
- Confirmar salva os valores atuais do formulário com o status `ARQUIVADO`.
- Após o salvamento, o formulário mostra a mensagem `Artigo arquivado com sucesso.`.
- Um artigo arquivado não exibe novamente a ação **Arquivar**. Ele pode ser restaurado por meio das ações existentes **Salvar rascunho** ou **Publicar**.

## Arquitetura e fluxo de dados

A alteração fica concentrada em `ArticleEditorForm`. O componente já recebe o artigo inicial e já centraliza a montagem e o envio de `CreateArticleInput` pela função `save(status)`. A nova ação reutilizará esse fluxo passando `ARQUIVADO`, sem criar endpoint ou contrato adicional.

O diálogo terá estado local de aberto/fechado. A confirmação fechará o diálogo e chamará o mesmo fluxo de validação e persistência usado por rascunho e publicação. Enquanto houver um salvamento em andamento, suas ações ficarão desabilitadas.

## Tratamento de erros

As validações existentes de título, categoria e público continuam válidas. Falhas recebidas por `onSave` continuam sendo exibidas no alerta do formulário. O diálogo não introduz tratamento de erro independente.

## Testes

Serão cobertos os comportamentos observáveis do formulário:

- ausência da ação na criação e em artigo já arquivado;
- presença da ação ao editar artigo não arquivado;
- cancelamento sem chamar `onSave`;
- confirmação enviando `status: "ARQUIVADO"`;
- mensagem de sucesso específica após arquivar.

