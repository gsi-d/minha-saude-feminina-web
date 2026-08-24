import Stack from "@mui/material/Stack";

import { ArticlePageHeader } from "@/features/articles/presentation/ArticlePageHeader";
import { EditArticleScreen } from "@/features/articles/presentation/EditArticleScreen";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  return (
    <Stack spacing={3}>
      <ArticlePageHeader
        action="back"
        description="Edite o conteúdo hipermídia e confira como ele aparecerá no aplicativo."
        title="Editar artigo"
      />

      <EditArticleScreen articleId={id} />
    </Stack>
  );
}
