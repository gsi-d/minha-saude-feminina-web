"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CreateArticleInput } from "@/features/articles/domain/article";
import { ArticleEditorForm } from "@/features/articles/presentation/ArticleEditorForm";
import { useArticles } from "@/features/articles/presentation/ArticlesProvider";

export function EditArticleScreen({ articleId }: { articleId: string }) {
  const router = useRouter();
  const { findArticle, removeArticle, updateArticle } = useArticles();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const article = findArticle(articleId);

  if (!article) return <Alert severity="warning">Artigo não encontrado. Ele pode ter sido excluído nesta sessão.</Alert>;

  async function remove() {
    await removeArticle(articleId);
    router.replace("/artigos");
  }

  return (
    <Stack spacing={2.5}>
      <Button color="error" onClick={() => setDeleteDialogOpen(true)} startIcon={<DeleteOutlineIcon />} sx={{ alignSelf: "flex-end" }} variant="outlined">Excluir artigo</Button>
      <ArticleEditorForm initialArticle={article} onSave={(input: CreateArticleInput) => updateArticle(articleId, input).then(() => undefined)} />
      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <DialogTitle>Excluir artigo?</DialogTitle>
        <DialogContent><DialogContentText>Esta ação removerá “{article.title}” dos dados fake da sessão.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button><Button color="error" onClick={remove} variant="contained">Excluir</Button></DialogActions>
      </Dialog>
    </Stack>
  );
}
