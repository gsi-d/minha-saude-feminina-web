"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import type { Category } from "@/features/categories/domain/category";
import type { Tip, TipInput } from "@/features/tips/domain/tip";
import { isTipoUsuarioPublico, tiposUsuarioPublico, type TipoUsuarioPublico } from "@/shared/enum";

interface TipFormDialogProps {
  categories: Category[];
  onClose: () => void;
  onSubmit: (input: TipInput) => Promise<void>;
  tip: Tip | null;
}

export function TipFormDialog({ categories, onClose, onSubmit, tip }: TipFormDialogProps) {
  const availableCategories = categories.filter((category) => category.isActive || category.id === tip?.categoryId);
  const [text, setText] = useState(tip?.text ?? "");
  const [categoryId, setCategoryId] = useState(tip?.categoryId ?? availableCategories[0]?.id ?? "");
  const [audience, setAudience] = useState<TipoUsuarioPublico | "">(tip?.audience ?? "");
  const [suggestedDisplayDate, setSuggestedDisplayDate] = useState(tip?.suggestedDisplayDate ?? "");
  const [isActive, setIsActive] = useState(tip?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!text.trim()) return setError("Informe o texto da dica.");
    if (text.trim().length > 500) return setError("A dica deve ter no máximo 500 caracteres.");
    if (!categoryId) return setError("Cadastre uma categoria ativa antes de criar a dica.");
    if (!isTipoUsuarioPublico(audience)) return setError("Informe o público da dica.");

    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        audience,
        categoryId,
        isActive,
        suggestedDisplayDate: suggestedDisplayDate || null,
        text,
      });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível salvar a dica.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onClose} open>
      <DialogTitle>{tip ? "Editar dica" : "Nova dica"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            fullWidth
            helperText={`${text.length}/500 caracteres`}
            label="Texto da dica"
            minRows={4}
            multiline
            onChange={(event) => setText(event.target.value)}
            required
            slotProps={{ htmlInput: { maxLength: 500 } }}
            value={text}
          />
          <FormControl fullWidth required>
            <InputLabel id="tip-category-label">Categoria</InputLabel>
            <Select label="Categoria" labelId="tip-category-label" onChange={(event) => setCategoryId(event.target.value)} value={categoryId}>
              {availableCategories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id="tip-audience-label">Público</InputLabel>
            <Select label="Público" labelId="tip-audience-label" onChange={(event) => setAudience(event.target.value as TipoUsuarioPublico)} value={audience}>
              {tiposUsuarioPublico.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Data sugerida de exibição"
            onChange={(event) => setSuggestedDisplayDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={suggestedDisplayDate}
          />
          <FormControlLabel control={<Switch checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />} label="Dica ativa" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>Cancelar</Button>
        <Button disabled={saving} onClick={() => void submit()} variant="contained">{saving ? "Salvando..." : "Salvar"}</Button>
      </DialogActions>
    </Dialog>
  );
}
