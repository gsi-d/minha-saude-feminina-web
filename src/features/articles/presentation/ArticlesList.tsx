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
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import { useState } from "react";

import type { Article } from "@/features/articles/domain/article";
import { EmptyArticlesState } from "@/features/articles/presentation/EmptyArticlesState";
import { useArticles } from "@/features/articles/presentation/ArticlesProvider";

const statusLabels = { ARQUIVADO: "Arquivado", PUBLICADO: "Publicado", RASCUNHO: "Rascunho" } as const;

export function ArticlesList() {
  const { articles, error, loading, reload, removeArticle } = useArticles();
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  async function confirmDelete() {
    if (!articleToDelete) return;
    await removeArticle(articleToDelete.id);
    setArticleToDelete(null);
  }

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress aria-label="Carregando artigos" /></Box>;
  }

  if (error) {
    return <Alert action={<Button onClick={() => void reload()}>Tentar novamente</Button>} severity="error" sx={{ mt: 3 }}>{error}</Alert>;
  }

  if (articles.length === 0) return <EmptyArticlesState />;

  return (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
        <Table aria-label="Artigos cadastrados">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>TÍTULO</TableCell>
              <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>CATEGORIA</TableCell>
              <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>PÚBLICO</TableCell>
              <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>CRIADO EM</TableCell>
              <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>ATUALIZADO EM</TableCell>
              <TableCell align="right" sx={{ color: 'primary.main'}}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow hover key={article.id}>
                <TableCell><Box sx={{ minWidth: 220 }}>{article.title}</Box></TableCell>
                <TableCell>{article.tag || "—"}</TableCell>
                <TableCell>{article.audience ?? "Não definido"}</TableCell>
                <TableCell>
                  <Chip
                    color={article.status === "PUBLICADO" ? "success" : article.status === "RASCUNHO" ? "warning" : "default"}
                    label={statusLabels[article.status]}
                    size="small"
                    variant={article.status === "ARQUIVADO" ? "outlined" : "filled"}
                  />
                </TableCell>
                <TableCell>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(article.createdAt)}</TableCell>
                <TableCell>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(article.updatedAt)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar artigo"><IconButton component={Link} href={`/artigos/${article.id}/editar`} size="small"><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Excluir artigo"><IconButton color="error" onClick={() => setArticleToDelete(article)} size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog onClose={() => setArticleToDelete(null)} open={Boolean(articleToDelete)}>
        <DialogTitle>Excluir artigo?</DialogTitle>
        <DialogContent><DialogContentText>O artigo “{articleToDelete?.title}” será removido do banco de dados.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setArticleToDelete(null)}>Cancelar</Button><Button color="error" onClick={confirmDelete} variant="contained">Excluir</Button></DialogActions>
      </Dialog>
    </>
  );
}
