"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import type { Category } from "@/features/categories/domain/category";
import { HttpCategoryRepository } from "@/features/categories/infrastructure/HttpCategoryRepository";
import type { Tip, TipInput } from "@/features/tips/domain/tip";
import { HttpTipRepository } from "@/features/tips/infrastructure/HttpTipRepository";
import { TipFormDialog } from "@/features/tips/presentation/TipFormDialog";
import { enumTipoUsuario, type TipoUsuarioPublico } from "@/shared/enum";

function formatDate(value: string | null) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR") : "—";
}

async function loadTipsData(
  tipRepository: HttpTipRepository,
  categoryRepository: HttpCategoryRepository,
) {
  const [loadedTips, loadedCategories] = await Promise.all([
    tipRepository.list(),
    categoryRepository.list(),
  ]);
  return { loadedCategories, loadedTips };
}

const audienceOptions: Array<TipoUsuarioPublico> = [
  enumTipoUsuario.Adolescente,
  enumTipoUsuario.Gestante,
  enumTipoUsuario.Tentante,
  enumTipoUsuario.Menopausa,
];

export function TipsScreen() {
  const [tipRepository] = useState(() => new HttpTipRepository());
  const [categoryRepository] = useState(() => new HttpCategoryRepository());
  const [tips, setTips] = useState<Tip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<{ key: number; tip: Tip | null } | null>(null);
  const [tipToDeactivate, setTipToDeactivate] = useState<Tip | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [audienceFilter, setAudienceFilter] = useState<"ALL" | TipoUsuarioPublico>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | string>("ALL");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await loadTipsData(tipRepository, categoryRepository);
      setTips(data.loadedTips);
      setCategories(data.loadedCategories);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as dicas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void loadTipsData(tipRepository, categoryRepository)
      .then((data) => {
        if (!active) return;
        setTips(data.loadedTips);
        setCategories(data.loadedCategories);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as dicas.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [categoryRepository, tipRepository]);

  async function save(input: TipInput) {
    if (formState?.tip) {
      const updated = await tipRepository.update(formState.tip.id, input);
      setTips((current) => current.map((item) => item.id === updated.id ? updated : item));
      return;
    }
    const created = await tipRepository.create(input);
    setTips((current) => [created, ...current]);
  }

  async function deactivate() {
    if (!tipToDeactivate) return;
    try {
      await tipRepository.deactivate(tipToDeactivate.id);
      setTips((current) => current.map((tip) => tip.id === tipToDeactivate.id ? { ...tip, isActive: false } : tip));
      setTipToDeactivate(null);
    } catch (deactivateError) {
      setError(deactivateError instanceof Error ? deactivateError.message : "Não foi possível desativar a dica.");
    }
  }

  const hasActiveCategory = categories.some((category) => category.isActive);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredTips = tips.filter((tip) => {
    const matchesSearch = !normalizedSearch
      || tip.text.toLocaleLowerCase().includes(normalizedSearch)
      || tip.categoryName.toLocaleLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "ALL"
      || (statusFilter === "ACTIVE" ? tip.isActive : !tip.isActive);
    const matchesAudience = audienceFilter === "ALL" || tip.audience === audienceFilter;
    const matchesCategory = categoryFilter === "ALL" || tip.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesAudience && matchesCategory;
  });

  const columns: Array<GridColDef<Tip>> = [
    {
      field: "text",
      flex: 1.5,
      headerName: "DICA",
      minWidth: 280,
    },
    {
      field: "categoryName",
      flex: 1,
      headerName: "CATEGORIA",
      minWidth: 170,
    },
    {
      field: "audience",
      flex: 0.9,
      headerName: "PÚBLICO",
      minWidth: 140,
    },
    {
      field: "suggestedDisplayDate",
      flex: 0.9,
      headerName: "DATA SUGERIDA",
      minWidth: 150,
      renderCell: ({ row }) => formatDate(row.suggestedDisplayDate),
    },
    {
      field: "isActive",
      flex: 0.8,
      headerName: "STATUS",
      minWidth: 130,
      renderCell: ({ row }) => (
        <Chip color={row.isActive ? "success" : "default"} label={row.isActive ? "Ativa" : "Inativa"} size="small" />
      ),
    },
    {
      field: "actions",
      headerName: "AÇÕES",
      minWidth: 120,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar">
            <IconButton onClick={() => setFormState({ key: Date.now(), tip: row })}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.isActive && (
            <Tooltip title="Desativar">
              <IconButton color="error" onClick={() => setTipToDeactivate(row)}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}>
        <Box>
          <Typography component="h1" variant="h4">Dicas</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Gerencie orientações rápidas exibidas no aplicativo.</Typography>
        </Box>
        <Button disabled={!hasActiveCategory} onClick={() => setFormState({ key: Date.now(), tip: null })} startIcon={<AddOutlinedIcon />} variant="contained">Nova dica</Button>
      </Stack>
      {!loading && !hasActiveCategory && <Alert severity="warning">Cadastre ou reative uma categoria antes de criar uma dica.</Alert>}
      {error && <Alert action={<Button onClick={() => void load()}>Tentar novamente</Button>} severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : tips.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }} variant="outlined"><Typography>Nenhuma dica cadastrada.</Typography></Paper>
      ) : (
        <>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Buscar dicas"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Texto da dica ou categoria"
              value={search}
            />
            <FormControl sx={{ minWidth: { xs: "100%", md: 170 } }}>
              <InputLabel id="tips-status-filter-label">Status</InputLabel>
              <Select
                label="Status"
                labelId="tips-status-filter-label"
                onChange={(event) => setStatusFilter(event.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
                value={statusFilter}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="ACTIVE">Ativas</MenuItem>
                <MenuItem value="INACTIVE">Inativas</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: "100%", md: 170 } }}>
              <InputLabel id="tips-audience-filter-label">Público</InputLabel>
              <Select
                label="Público"
                labelId="tips-audience-filter-label"
                onChange={(event) => setAudienceFilter(event.target.value as "ALL" | TipoUsuarioPublico)}
                value={audienceFilter}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                {audienceOptions.map((audience) => (
                  <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: "100%", md: 220 } }}>
              <InputLabel id="tips-category-filter-label">Categoria</InputLabel>
              <Select
                label="Categoria"
                labelId="tips-category-filter-label"
                onChange={(event) => setCategoryFilter(event.target.value as "ALL" | string)}
                value={categoryFilter}
              >
                <MenuItem value="ALL">Todas</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Paper sx={{ overflow: "hidden" }} variant="outlined">
            <DataGrid
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              rows={filteredTips}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: "suggestedDisplayDate", sort: "desc" }] },
              }}
              sx={{
                border: 0,
                minHeight: 520,
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
              }}
            />
          </Paper>
        </>
      )}

      {formState && <TipFormDialog categories={categories} key={formState.key} onClose={() => setFormState(null)} onSubmit={save} tip={formState.tip} />}
      <Dialog onClose={() => setTipToDeactivate(null)} open={Boolean(tipToDeactivate)}>
        <DialogTitle>Desativar dica?</DialogTitle>
        <DialogContent><DialogContentText>A dica deixará de ser exibida no aplicativo e poderá ser reativada pela edição.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setTipToDeactivate(null)}>Cancelar</Button><Button color="error" onClick={() => void deactivate()} variant="contained">Desativar</Button></DialogActions>
      </Dialog>
    </Stack>
  );
}
