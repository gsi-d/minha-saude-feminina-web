import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function EmptyArticlesState() {
  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 6 }}>
      <Box sx={{ color: "text.secondary", textAlign: "center" }}>
        <ArticleOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
        <Typography color="text.primary" variant="h6">
          Estrutura da listagem
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          A tabela e as ações do CRUD serão implementadas na próxima etapa.
        </Typography>
      </Box>
    </Paper>
  );
}
