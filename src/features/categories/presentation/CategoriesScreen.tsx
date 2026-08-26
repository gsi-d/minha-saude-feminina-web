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

import type { Category, CategoryInput } from "@/features/categories/domain/category";
import { HttpCategoryRepository } from "@/features/categories/infrastructure/HttpCategoryRepository";
import { CategoryFormDialog } from "@/features/categories/presentation/CategoryFormDialog";

export function CategoriesScreen() {
  const [repository] = useState(() => new HttpCategoryRepository());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<{ key: number; category: Category | null } | null>(null);
  const [categoryToDeactivate, setCategoryToDeactivate] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setCategories(await repository.list());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as categorias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void repository.list()
      .then((data) => { if (active) setCategories(data); })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as categorias.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [repository]);

  async function save(input: CategoryInput) {
    if (formState?.category) {
      const updated = await repository.update(formState.category.id, input);
      setCategories((current) => current.map((item) => item.id === updated.id ? updated : item));
      return;
    }
    const created = await repository.create(input);
    setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
  }

  async function deactivate() {
    if (!categoryToDeactivate) return;
    try {
      await repository.deactivate(categoryToDeactivate.id);
      setCategories((current) => current.map((category) =>
        category.id === categoryToDeactivate.id ? { ...category, isActive: false } : category));
      setCategoryToDeactivate(null);
    } catch (deactivateError) {
      setError(deactivateError instanceof Error ? deactivateError.message : "Não foi possível desativar a categoria.");
    }
  }

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = !normalizedSearch
      || category.name.toLocaleLowerCase().includes(normalizedSearch)
      || category.description.toLocaleLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "ALL"
      || (statusFilter === "ACTIVE" ? category.isActive : !category.isActive);

    return matchesSearch && matchesStatus;
  });

  const columns: Array<GridColDef<Category>> = [
    {
      field: "name",
      flex: 1,
      headerName: "NOME",
      minWidth: 220,
    },
    {
      field: "description",
      flex: 1.5,
      headerName: "DESCRIÇÃO",
      minWidth: 300,
      renderCell: ({ row }) => row.description || "—",
    },
    {
      field: "isActive",
      flex: 0.7,
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
            <IconButton onClick={() => setFormState({ category: row, key: Date.now() })}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.isActive && (
            <Tooltip title="Desativar">
              <IconButton color="error" onClick={() => setCategoryToDeactivate(row)}>
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
          <Typography component="h1" variant="h4">Categorias</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Organize os artigos e dicas exibidos no aplicativo.</Typography>
        </Box>
        <Button onClick={() => setFormState({ category: null, key: Date.now() })} startIcon={<AddOutlinedIcon />} variant="contained">Nova categoria</Button>
      </Stack>

      {error && <Alert action={<Button onClick={() => void load()}>Tentar novamente</Button>} severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : categories.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }} variant="outlined"><Typography>Nenhuma categoria cadastrada.</Typography></Paper>
      ) : (
        <>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Buscar categorias"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome ou descrição"
              value={search}
            />
            <FormControl sx={{ minWidth: { xs: "100%", md: 180 } }}>
              <InputLabel id="categories-status-filter-label">Status</InputLabel>
              <Select
                label="Status"
                labelId="categories-status-filter-label"
                onChange={(event) => setStatusFilter(event.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
                value={statusFilter}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="ACTIVE">Ativas</MenuItem>
                <MenuItem value="INACTIVE">Inativas</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Paper sx={{ overflow: "hidden" }} variant="outlined">
            <DataGrid
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              rows={filteredCategories}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: "name", sort: "asc" }] },
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

      {formState && (
        <CategoryFormDialog
          category={formState.category}
          key={formState.key}
          onClose={() => setFormState(null)}
          onSubmit={save}
        />
      )}
      <Dialog onClose={() => setCategoryToDeactivate(null)} open={Boolean(categoryToDeactivate)}>
        <DialogTitle>Desativar categoria?</DialogTitle>
        <DialogContent><DialogContentText>A categoria “{categoryToDeactivate?.name}” deixará de aparecer em novos cadastros. Os vínculos existentes serão preservados.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setCategoryToDeactivate(null)}>Cancelar</Button><Button color="error" onClick={() => void deactivate()} variant="contained">Desativar</Button></DialogActions>
      </Dialog>
    </Stack>
  );
}
