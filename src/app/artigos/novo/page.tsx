import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ArticleEditorPlaceholder } from "@/features/articles/presentation/ArticleEditorPlaceholder";
import { ArticlePageHeader } from "@/features/articles/presentation/ArticlePageHeader";

export default function NewArticlePage() {
  return (
    <Stack spacing={3}>
      <ArticlePageHeader
        action="back"
        description="Estrutura reservada para o formulário de criação."
        title="Novo artigo"
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            Conteúdo
          </Typography>
          <ArticleEditorPlaceholder />
        </Stack>
      </Paper>
    </Stack>
  );
}
