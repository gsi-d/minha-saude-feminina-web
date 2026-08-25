"use client";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useId, useState, type ChangeEvent, type ReactNode } from "react";

import type {
  Article,
  ArticleAudience,
  ArticleCategory,
  ArticleDocument,
  ArticleStatus,
  CreateArticleInput,
} from "@/features/articles/domain/article";
import { ArticleMobilePreview } from "@/features/articles/presentation/ArticleMobilePreview";
import { ArticleRichTextEditor } from "@/features/articles/presentation/ArticleRichTextEditor";
import { isTipoUsuarioPublico, tiposUsuarioPublico } from "@/shared/enum";

interface ArticleEditorFormProps {
  categories: ArticleCategory[];
  initialArticle?: Article;
  onSave: (input: CreateArticleInput) => Promise<void>;
  secondaryActions?: ReactNode;
}

const emptyDocument: ArticleDocument = {
  schemaVersion: 1,
  document: { type: "doc", content: [{ type: "paragraph" }] },
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Nao foi possivel ler a imagem selecionada."));
    };
    reader.onerror = () => reject(new Error("Nao foi possivel ler a imagem selecionada."));
    reader.readAsDataURL(file);
  });
}

export function ArticleEditorForm({ categories, initialArticle, onSave, secondaryActions }: ArticleEditorFormProps) {
  const coverImageInputId = useId();
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [summary, setSummary] = useState(initialArticle?.summary ?? "");
  const [categoryId, setCategoryId] = useState(initialArticle?.categoryId ?? "");
  const [audience, setAudience] = useState<ArticleAudience | "">(
    isTipoUsuarioPublico(initialArticle?.audience)
      ? initialArticle.audience
      : "",
  );
  const [coverImage, setCoverImage] = useState(initialArticle?.coverImage ?? "");
  const [content, setContent] = useState<ArticleDocument>(initialArticle?.content ?? emptyDocument);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedCategoryId = categoryId || (!initialArticle ? categories[0]?.id ?? "" : "");

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty]);

  function change<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setDirty(true);
    setMessage(null);
  }

  async function handleCoverImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem valido para a capa.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      change(setCoverImage, dataUrl);
      setError(null);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Nao foi possivel carregar a imagem de capa.");
    }
  }

  async function save(status: ArticleStatus) {
    if (!title.trim()) {
      setError("Informe o titulo do artigo.");
      return;
    }

    if (!selectedCategoryId) {
      setError("Nenhuma categoria está disponível para o artigo.");
      return;
    }

    if (!isTipoUsuarioPublico(audience)) {
      setError("Informe o público do artigo.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await onSave({
        title: title.trim(),
        summary: summary.trim(),
        categoryId: selectedCategoryId,
        audience,
        coverImage: coverImage.trim() || null,
        content,
        status,
      });
      setDirty(false);
      setMessage(status === "PUBLICADO" ? "Artigo publicado com sucesso." : "Rascunho salvo com sucesso.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar o artigo.");
    } finally {
      setSaving(false);
    }
  }

  const categoryName = categories.find((category) => category.id === selectedCategoryId)?.name ?? "";

  return (
    <Stack spacing={2.5}>
      {(error || message) && (
        <Alert severity={error ? "error" : "success"}>{error ?? message}</Alert>
      )}

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "flex-start" }}
      >
        {secondaryActions}
        <Button
          disabled={saving}
          onClick={() => save("RASCUNHO")}
          startIcon={<SaveOutlinedIcon />}
          variant="outlined"
        >
          Salvar rascunho
        </Button>
        <Button
          disabled={saving}
          onClick={() => save("PUBLICADO")}
          startIcon={<SendOutlinedIcon />}
          variant="contained"
        >
          Publicar
        </Button>
      </Stack>

      <Box
        sx={{
          alignItems: "start",
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 410px" },
        }}
      >
        <Stack spacing={3} sx={{ alignItems: "stretch", minWidth: 0, width: "100%" }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }} variant="outlined">
            <Stack spacing={2.5} sx={{ alignItems: "stretch", width: "100%" }}>
              <Typography component="h2" variant="h6">Informacoes do artigo</Typography>
              <TextField
                fullWidth
                label="Titulo"
                onChange={(event) => change(setTitle, event.target.value)}
                required
                value={title}
              />
              <TextField
                fullWidth
                helperText={`${summary.length}/300 caracteres`}
                label="Resumo"
                minRows={3}
                multiline
                onChange={(event) => change(setSummary, event.target.value)}
                slotProps={{ htmlInput: { maxLength: 300 } }}
                value={summary}
              />
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="article-category-label">Categoria</InputLabel>
                  <Select
                    label="Categoria"
                    labelId="article-category-label"
                    onChange={(event) => change(setCategoryId, event.target.value)}
                    value={selectedCategoryId}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="article-audience-label">Publico</InputLabel>
                  <Select
                    label="Publico"
                    labelId="article-audience-label"
                    onChange={(event) => change(setAudience, event.target.value as ArticleAudience)}
                    value={audience}
                  >
                    {tiposUsuarioPublico.map((tipoUsuario) => (
                      <MenuItem key={tipoUsuario} value={tipoUsuario}>
                        {tipoUsuario}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                helperText="Cole uma URL publica ou selecione uma imagem do seu dispositivo."
                label="URL da imagem de capa"
                onChange={(event) => change(setCoverImage, event.target.value)}
                value={coverImage}
              />
              <Box sx={{ alignSelf: "flex-start" }}>
                <input
                  accept="image/*"
                  hidden
                  id={coverImageInputId}
                  onChange={handleCoverImageFileChange}
                  type="file"
                />
                <Button
                  component="label"
                  htmlFor={coverImageInputId}
                  startIcon={<ImageOutlinedIcon />}
                  variant="outlined"
                >
                  Selecionar imagem do dispositivo
                </Button>
              </Box>
            </Stack>
          </Paper>

          <Box sx={{ width: "100%" }}>
            <Typography component="h2" sx={{ mb: 1.5 }} variant="h6">Conteudo hipermidia</Typography>
            <ArticleRichTextEditor
              onChange={(document) => change(setContent, document)}
              value={content}
            />
          </Box>
        </Stack>

        <Box sx={{ position: { lg: "sticky" }, top: { lg: 88 } }}>
          <ArticleMobilePreview
            content={content}
            coverImage={coverImage || null}
            summary={summary}
            tag={categoryName}
            title={title}
          />
        </Box>
      </Box>
    </Stack>
  );
}
