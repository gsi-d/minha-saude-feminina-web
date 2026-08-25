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
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
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
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead><TableRow><TableCell>Nome</TableCell><TableCell>Descrição</TableCell><TableCell>Status</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow hover key={category.id}>
                  <TableCell sx={{ fontWeight: 650 }}>{category.name}</TableCell>
                  <TableCell>{category.description || "—"}</TableCell>
                  <TableCell><Chip color={category.isActive ? "success" : "default"} label={category.isActive ? "Ativa" : "Inativa"} size="small" /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar"><IconButton onClick={() => setFormState({ category, key: Date.now() })}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                    {category.isActive && <Tooltip title="Desativar"><IconButton color="error" onClick={() => setCategoryToDeactivate(category)}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton></Tooltip>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
