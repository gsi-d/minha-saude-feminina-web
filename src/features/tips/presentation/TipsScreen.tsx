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

import type { Category } from "@/features/categories/domain/category";
import { HttpCategoryRepository } from "@/features/categories/infrastructure/HttpCategoryRepository";
import type { Tip, TipInput } from "@/features/tips/domain/tip";
import { HttpTipRepository } from "@/features/tips/infrastructure/HttpTipRepository";
import { TipFormDialog } from "@/features/tips/presentation/TipFormDialog";

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

export function TipsScreen() {
  const [tipRepository] = useState(() => new HttpTipRepository());
  const [categoryRepository] = useState(() => new HttpCategoryRepository());
  const [tips, setTips] = useState<Tip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<{ key: number; tip: Tip | null } | null>(null);
  const [tipToDeactivate, setTipToDeactivate] = useState<Tip | null>(null);

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
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead><TableRow><TableCell>Dica</TableCell><TableCell>Categoria</TableCell><TableCell>Público</TableCell><TableCell>Data sugerida</TableCell><TableCell>Status</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
            <TableBody>
              {tips.map((tip) => (
                <TableRow hover key={tip.id}>
                  <TableCell sx={{ maxWidth: 420 }}>{tip.text}</TableCell>
                  <TableCell>{tip.categoryName}</TableCell>
                  <TableCell>{tip.audience}</TableCell>
                  <TableCell>{formatDate(tip.suggestedDisplayDate)}</TableCell>
                  <TableCell><Chip color={tip.isActive ? "success" : "default"} label={tip.isActive ? "Ativa" : "Inativa"} size="small" /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar"><IconButton onClick={() => setFormState({ key: Date.now(), tip })}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                    {tip.isActive && <Tooltip title="Desativar"><IconButton color="error" onClick={() => setTipToDeactivate(tip)}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton></Tooltip>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
