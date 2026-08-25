"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import type { Category, CategoryInput } from "@/features/categories/domain/category";

interface CategoryFormDialogProps {
  category: Category | null;
  onClose: () => void;
  onSubmit: (input: CategoryInput) => Promise<void>;
}

export function CategoryFormDialog({ category, onClose, onSubmit }: CategoryFormDialogProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) {
      setError("Informe o nome da categoria.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSubmit({ description, isActive, name });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível salvar a categoria.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onClose} open>
      <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Nome"
            onChange={(event) => setName(event.target.value)}
            required
            slotProps={{ htmlInput: { maxLength: 100 } }}
            value={name}
          />
          <TextField
            fullWidth
            label="Descrição"
            minRows={3}
            multiline
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
          <FormControlLabel
            control={<Switch checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />}
            label="Categoria ativa"
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>Cancelar</Button>
        <Button disabled={saving} onClick={() => void submit()} variant="contained">
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
