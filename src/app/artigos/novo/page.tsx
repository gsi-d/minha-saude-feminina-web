import Stack from "@mui/material/Stack";

import { ArticlePageHeader } from "@/features/articles/presentation/ArticlePageHeader";
import { NewArticleScreen } from "@/features/articles/presentation/NewArticleScreen";

export default function NewArticlePage() {
  return (
    <Stack spacing={3}>
      <ArticlePageHeader
        action="back"
        description="Crie o conteúdo, adicione mídias e acompanhe a prévia no aplicativo."
        title="Novo artigo"
      />

      <NewArticleScreen />
    </Stack>
  );
}
