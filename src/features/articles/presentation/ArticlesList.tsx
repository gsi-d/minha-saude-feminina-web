"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useState } from "react";

import type { Article, ArticleAudience, ArticleStatus } from "@/features/articles/domain/article";
import { EmptyArticlesState } from "@/features/articles/presentation/EmptyArticlesState";
import { useArticles } from "@/features/articles/presentation/ArticlesProvider";
import { enumTipoUsuario } from "@/shared/enum";

const statusLabels = { ARQUIVADO: "Arquivado", PUBLICADO: "Publicado", RASCUNHO: "Rascunho" } as const;
const audienceOptions: Array<ArticleAudience> = [
  enumTipoUsuario.Adolescente,
  enumTipoUsuario.Gestante,
  enumTipoUsuario.Tentante,
  enumTipoUsuario.Menopausa,
];

export function ArticlesList() {
  const { articles, error, loading, reload, removeArticle } = useArticles();
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ArticleStatus>("ALL");
  const [audienceFilter, setAudienceFilter] = useState<"ALL" | ArticleAudience>("ALL");

  async function confirmDelete() {
    if (!articleToDelete) return;
    await removeArticle(articleToDelete.id);
    setArticleToDelete(null);
  }

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = !normalizedSearch
      || article.title.toLocaleLowerCase().includes(normalizedSearch)
      || article.tag.toLocaleLowerCase().includes(normalizedSearch)
      || article.summary.toLocaleLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "ALL" || article.status === statusFilter;
    const matchesAudience = audienceFilter === "ALL" || article.audience === audienceFilter;

    return matchesSearch && matchesStatus && matchesAudience;
  });

  const columns: Array<GridColDef<Article>> = [
    {
      field: "title",
      flex: 1.4,
      headerName: "TÍTULO",
      minWidth: 240,
    },
    {
      field: "tag",
      flex: 1,
      headerName: "CATEGORIA",
      minWidth: 180,
      renderCell: ({ row }) => row.tag || "—",
    },
    {
      field: "audience",
      flex: 0.9,
      headerName: "PÚBLICO",
      minWidth: 150,
      renderCell: ({ row }) => row.audience ?? "Não definido",
    },
    {
      field: "status",
      flex: 0.8,
      headerName: "STATUS",
      minWidth: 140,
      renderCell: ({ row }) => (
        <Chip
          color={row.status === "PUBLICADO" ? "success" : row.status === "RASCUNHO" ? "warning" : "default"}
          label={statusLabels[row.status]}
          size="small"
          variant={row.status === "ARQUIVADO" ? "outlined" : "filled"}
        />
      ),
    },
    {
      field: "createdAt",
      flex: 0.9,
      headerName: "CRIADO EM",
      minWidth: 170,
      renderCell: ({ row }) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(row.createdAt),
      sortComparator: (left, right) => left.getTime() - right.getTime(),
    },
    {
      field: "updatedAt",
      flex: 0.9,
      headerName: "ATUALIZADO EM",
      minWidth: 170,
      renderCell: ({ row }) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(row.updatedAt),
      sortComparator: (left, right) => left.getTime() - right.getTime(),
    },
    {
      field: "actions",
      headerName: "",
      minWidth: 120,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5} sx={{ mt: 1.5}}>
          <Tooltip title="Editar artigo">
            <IconButton component={Link} href={`/artigos/${row.id}/editar`} size="small">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir artigo">
            <IconButton color="error" onClick={() => setArticleToDelete(row)} size="small">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress aria-label="Carregando artigos" /></Box>;
  }

  if (error) {
    return <Alert action={<Button onClick={() => void reload()}>Tentar novamente</Button>} severity="error" sx={{ mt: 3 }}>{error}</Alert>;
  }

  if (articles.length === 0) return <EmptyArticlesState />;

  return (
    <>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Buscar artigos"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Título, categoria ou resumo"
          value={search}
        />
        <FormControl sx={{ minWidth: { xs: "100%", md: 180 } }}>
          <InputLabel id="articles-status-filter-label">Status</InputLabel>
          <Select
            label="Status"
            labelId="articles-status-filter-label"
            onChange={(event) => setStatusFilter(event.target.value as "ALL" | ArticleStatus)}
            value={statusFilter}
          >
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="PUBLICADO">Publicado</MenuItem>
            <MenuItem value="RASCUNHO">Rascunho</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: { xs: "100%", md: 180 } }}>
          <InputLabel id="articles-audience-filter-label">Público</InputLabel>
          <Select
            label="Público"
            labelId="articles-audience-filter-label"
            onChange={(event) => setAudienceFilter(event.target.value as "ALL" | ArticleAudience)}
            value={audienceFilter}
          >
            <MenuItem value="ALL">Todos</MenuItem>
            {audienceOptions.map((audience) => (
              <MenuItem key={audience} value={audience}>{audience}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Paper sx={{ mt: 3, overflow: "hidden" }} variant="outlined">
        <DataGrid
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          rows={filteredArticles}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
            sorting: { sortModel: [{ field: "updatedAt", sort: "desc" }] },
          }}
          sx={{
            border: 0,
            minHeight: 520,
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          }}
        />
      </Paper>

      <Dialog onClose={() => setArticleToDelete(null)} open={Boolean(articleToDelete)}>
        <DialogTitle>Excluir artigo?</DialogTitle>
        <DialogContent><DialogContentText>O artigo “{articleToDelete?.title}” será removido do banco de dados.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setArticleToDelete(null)}>Cancelar</Button><Button color="error" onClick={() => void confirmDelete()} variant="contained">Excluir</Button></DialogActions>
      </Dialog>
    </>
  );
}
