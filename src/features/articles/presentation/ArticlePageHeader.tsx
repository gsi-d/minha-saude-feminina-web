import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ArticlePageHeaderProps {
  title: string;
  description: string;
  action?: "create" | "back";
}

export function ArticlePageHeader({
  title,
  description,
  action,
}: ArticlePageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
    >
      <Box>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      </Box>

      {action === "create" && (
        <Button href="/artigos/novo" startIcon={<AddOutlinedIcon sx={{ color: 'white'}} />} variant="contained" sx={{ color: 'white'}}>
          <Typography sx={{color: 'white'}}>Novo Artigo</Typography>
        </Button>
      )}

      {action === "back" && (
        <Button href="/artigos" startIcon={<ArrowBackOutlinedIcon />} variant="outlined">
          Voltar
        </Button>
      )}
    </Stack>
  );
}
