"use client";

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
import { useEffect, useState } from "react";

import type {
  Article,
  ArticleAudience,
  ArticleDocument,
  ArticleStatus,
  CreateArticleInput,
} from "@/features/articles/domain/article";
import { ArticleMobilePreview } from "@/features/articles/presentation/ArticleMobilePreview";
import { ArticleRichTextEditor } from "@/features/articles/presentation/ArticleRichTextEditor";

interface ArticleEditorFormProps {
  initialArticle?: Article;
  onSave: (input: CreateArticleInput) => Promise<void>;
}

const emptyDocument: ArticleDocument = {
  schemaVersion: 1,
  document: { type: "doc", content: [{ type: "paragraph" }] },
};

export function ArticleEditorForm({ initialArticle, onSave }: ArticleEditorFormProps) {
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [summary, setSummary] = useState(initialArticle?.summary ?? "");
  const [tag, setTag] = useState(initialArticle?.tag ?? "");
  const [audience, setAudience] = useState<ArticleAudience>(initialArticle?.audience ?? "GERAL");
  const [coverImage, setCoverImage] = useState(initialArticle?.coverImage ?? "");
  const [content, setContent] = useState<ArticleDocument>(initialArticle?.content ?? emptyDocument);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function save(status: ArticleStatus) {
    if (!title.trim()) {
      setError("Informe o título do artigo.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await onSave({
        title: title.trim(),
        summary: summary.trim(),
        tag: tag.trim(),
        audience,
        coverImage: coverImage.trim() || null,
        content,
        status,
      });
      setDirty(false);
      setMessage(status === "PUBLICADO" ? "Artigo publicado com sucesso." : "Rascunho salvo com sucesso.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o artigo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={2.5}>
      {(error || message) && (
        <Alert severity={error ? "error" : "success"}>{error ?? message}</Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}>
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
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2.5}>
              <Typography component="h2" variant="h6">Informações do artigo</Typography>
              <TextField
                fullWidth
                label="Título"
                onChange={(event) => change(setTitle, event.target.value)}
                required
                value={title}
              />
              <TextField
                fullWidth
                helperText={`${summary.length}/300 caracteres`}
                slotProps={{ htmlInput: { maxLength: 300 } }}
                label="Resumo"
                minRows={3}
                multiline
                onChange={(event) => change(setSummary, event.target.value)}
                value={summary}
              />
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField label="Tag" onChange={(event) => change(setTag, event.target.value)} value={tag} />
                <FormControl>
                  <InputLabel id="article-audience-label">Público</InputLabel>
                  <Select
                    label="Público"
                    labelId="article-audience-label"
                    onChange={(event) => change(setAudience, event.target.value as ArticleAudience)}
                    value={audience}
                  >
                    <MenuItem value="GERAL">Geral</MenuItem>
                    <MenuItem value="GESTANTE">Gestantes</MenuItem>
                    <MenuItem value="NAO_GESTANTE">Não gestantes</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                helperText="Posteriormente esta URL será preenchida pelo upload no Supabase Storage."
                label="URL da imagem de capa"
                onChange={(event) => change(setCoverImage, event.target.value)}
                value={coverImage}
              />
            </Stack>
          </Paper>

          <Box>
            <Typography component="h2" sx={{ mb: 1.5 }} variant="h6">Conteúdo hipermídia</Typography>
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
            tag={tag}
            title={title}
          />
        </Box>
      </Box>
    </Stack>
  );
}
