"use client";

import { useRouter } from "next/navigation";

import type { CreateArticleInput } from "@/features/articles/domain/article";
import { ArticleEditorForm } from "@/features/articles/presentation/ArticleEditorForm";
import { useArticles } from "@/features/articles/presentation/ArticlesProvider";

export function NewArticleScreen() {
  const router = useRouter();
  const { categories, createArticle } = useArticles();

  async function save(input: CreateArticleInput) {
    const article = await createArticle(input);
    router.replace(`/artigos/${article.id}/editar`);
  }

  return <ArticleEditorForm categories={categories} onSave={save} />;
}
