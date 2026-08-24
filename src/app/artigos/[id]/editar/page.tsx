import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ArticleEditorPlaceholder } from "@/features/articles/presentation/ArticleEditorPlaceholder";
import { ArticlePageHeader } from "@/features/articles/presentation/ArticlePageHeader";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  return (
    <Stack spacing={3}>
      <ArticlePageHeader
        action="back"
        description="Estrutura reservada para o formulário de edição."
        title="Editar artigo"
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography component="h2" variant="h6">
              Conteúdo
            </Typography>
            <Chip label={`ID: ${id}`} size="small" variant="outlined" />
          </Stack>
          <ArticleEditorPlaceholder />
        </Stack>
      </Paper>
    </Stack>
  );
}
