import { ArticlePageHeader } from "@/features/articles/presentation/ArticlePageHeader";
import { EmptyArticlesState } from "@/features/articles/presentation/EmptyArticlesState";

export default function ArticlesPage() {
  return (
    <>
      <ArticlePageHeader
        action="create"
        description="Crie, edite e organize os conteúdos exibidos no aplicativo."
        title="Artigos"
      />
      <EmptyArticlesState />
    </>
  );
}
