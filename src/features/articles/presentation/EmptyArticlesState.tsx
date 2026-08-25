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
          Nenhum artigo cadastrado
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Crie o primeiro artigo para começar a publicar conteúdos.
        </Typography>
      </Box>
    </Paper>
  );
}
