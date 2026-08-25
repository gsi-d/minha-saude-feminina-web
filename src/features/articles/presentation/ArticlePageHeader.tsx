"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  function handleClickNovo() {
    router.push("/artigos/novo");
  }

  function handleClickVoltar() {
    router.push("/artigos");
  }

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
        <Button
          onClick={handleClickNovo}
          startIcon={<AddOutlinedIcon sx={{ color: "common.white" }} />}
          color="primary"
          variant="contained"
        >
          NOVO
        </Button>
      )}
      {action === "back" && (
        <Button
          onClick={handleClickVoltar}
          startIcon={<ArrowBackOutlinedIcon sx={{ color: "primary.main" }} />}
          variant="outlined"
        >
          VOLTAR
        </Button>
      )}
    </Stack>
  );
}
