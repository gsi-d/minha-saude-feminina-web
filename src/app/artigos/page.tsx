import { ArticlePageHeader } from "@/features/articles/presentation/ArticlePageHeader";
import { ArticlesList } from "@/features/articles/presentation/ArticlesList";

export default function ArticlesPage() {
  return (
    <>
      <ArticlePageHeader
        action="create"
        description="Crie, edite e organize os conteúdos exibidos no aplicativo."
        title="Artigos"
      />
      <ArticlesList />
    </>
  );
}
