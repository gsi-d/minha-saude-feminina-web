import type { ArticleContentNode, ArticleDocument } from "@/features/articles/domain/article";

import type { SupabaseConteudoRow } from "./SupabaseConteudoRow";

function document(...content: ArticleContentNode[]): ArticleDocument {
  return { schemaVersion: 1, document: { type: "doc", content } };
}

function textParagraph(text: string): ArticleContentNode {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

export const fakeSupabaseConteudoRows: SupabaseConteudoRow[] = [
  {
    ID: "8d1c2e6b-2b7d-4d44-9d62-0b2d96da6f31",
    TITULO: "Autocuidado e prevenção na saúde da mulher",
    RESUMO: "Hábitos simples ajudam a acompanhar o corpo e buscar atendimento no momento certo.",
    CONTEUDO_COMPLETO: document(
      {
        type: "heading",
        attrs: { level: 2, textAlign: "left" },
        content: [{ type: "text", text: "Cuidar de si também é prevenção" }],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "O autocuidado começa com " },
          { type: "text", text: "informação de qualidade", marks: [{ type: "bold" }] },
          { type: "text", text: " e atenção aos sinais do próprio corpo." },
        ],
      },
      {
        type: "image",
        attrs: {
          src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
          alt: "Profissional de saúde conversando com uma paciente",
          title: "Acompanhamento preventivo",
        },
      },
      {
        type: "bulletList",
        content: [
          { type: "listItem", content: [textParagraph("Mantenha seus exames de rotina atualizados.")] },
          { type: "listItem", content: [textParagraph("Observe mudanças persistentes no corpo.")] },
          { type: "listItem", content: [textParagraph("Procure atendimento diante de sintomas incomuns.")] },
        ],
      },
    ),
    TAG: "Prevenção",
    TP_USUARIO: "GERAL",
    STATUS: "PUBLICADO",
    IMAGEM_CAPA: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
    CREATED_AT: "2026-08-18T13:30:00.000Z",
    UPDATED_AT: "2026-08-20T16:10:00.000Z",
  },
  {
    ID: "2ac50940-c399-4b59-b667-4afe82c450cb",
    TITULO: "Alimentação equilibrada durante a gestação",
    RESUMO: "Escolhas alimentares variadas contribuem para a saúde da gestante e do bebê.",
    CONTEUDO_COMPLETO: document(
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Nutrição com acolhimento" }] },
      textParagraph("Cada gestação é única. As orientações devem ser individualizadas durante o pré-natal."),
      {
        type: "blockquote",
        content: [textParagraph("Nenhum alimento isolado substitui uma rotina variada e acompanhamento profissional.")],
      },
      {
        type: "youtube",
        attrs: { src: "https://www.youtube.com/watch?v=ysz5S6PUM-U", width: 640, height: 360 },
      },
    ),
    TAG: "Gestação",
    TP_USUARIO: "GESTANTE",
    STATUS: "PUBLICADO",
    IMAGEM_CAPA: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80",
    CREATED_AT: "2026-08-12T10:00:00.000Z",
    UPDATED_AT: "2026-08-15T09:20:00.000Z",
  },
  {
    ID: "a5b79017-2386-48d4-a4d3-31d463b86ce9",
    TITULO: "Saúde mental: quando buscar apoio",
    RESUMO: "Reconhecer sinais de sofrimento emocional é um passo importante para procurar apoio.",
    CONTEUDO_COMPLETO: document(
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Você não precisa enfrentar tudo sozinha" }] },
      textParagraph("Mudanças prolongadas no sono, no apetite, no humor ou na disposição merecem atenção."),
      {
        type: "image",
        attrs: {
          src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
          alt: "Duas pessoas conversando em um ambiente acolhedor",
          title: "Conversa e acolhimento",
        },
      },
      {
        type: "paragraph",
        content: [{
          type: "text",
          text: "Em situações de risco imediato, procure um serviço de urgência.",
          marks: [{ type: "textStyle", attrs: { color: "#C43A4A" } }, { type: "bold" }],
        }],
      },
    ),
    TAG: "Saúde mental",
    TP_USUARIO: "GERAL",
    STATUS: "RASCUNHO",
    IMAGEM_CAPA: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
    CREATED_AT: "2026-08-22T14:45:00.000Z",
    UPDATED_AT: "2026-08-23T11:05:00.000Z",
  },
];
