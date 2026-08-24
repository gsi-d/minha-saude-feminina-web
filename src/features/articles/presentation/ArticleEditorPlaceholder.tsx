import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function ArticleEditorPlaceholder() {
  return (
    <Box
      sx={{
        alignItems: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        justifyContent: "center",
        minHeight: 240,
        p: 3,
      }}
    >
      <Typography sx={{ color: "text.secondary", textAlign: "center" }}>
        Área reservada para o editor de texto rico.
      </Typography>
    </Box>
  );
}
