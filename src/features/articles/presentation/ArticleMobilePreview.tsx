import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import type {
  ArticleContentMark,
  ArticleContentNode,
  ArticleDocument,
} from "@/features/articles/domain/article";
import { getYoutubeEmbedUrl } from "@/features/articles/presentation/article-content";

interface ArticleMobilePreviewProps {
  content: ArticleDocument;
  coverImage: string | null;
  summary: string;
  tag: string;
  title: string;
}

function markedText(text: string, marks: ArticleContentMark[] = []): ReactNode {
  return marks.reduce<ReactNode>((content, mark, index) => {
    const key = `${mark.type}-${index}`;

    switch (mark.type) {
      case "bold":
        return <Box component="strong" key={key}>{content}</Box>;
      case "italic":
        return <Box component="em" key={key}>{content}</Box>;
      case "underline":
        return <Box component="span" key={key} sx={{ textDecoration: "underline" }}>{content}</Box>;
      case "strike":
        return <Box component="span" key={key} sx={{ textDecoration: "line-through" }}>{content}</Box>;
      case "link":
        return <Link href={String(mark.attrs?.href ?? "#")} key={key} rel="noreferrer" target="_blank">{content}</Link>;
      case "highlight":
        return <Box component="span" key={key} sx={{ bgcolor: String(mark.attrs?.color ?? "#fff1a8") }}>{content}</Box>;
      case "textStyle":
        return <Box component="span" key={key} sx={{ color: typeof mark.attrs?.color === "string" ? mark.attrs.color : undefined }}>{content}</Box>;
      default:
        return content;
    }
  }, text);
}

function renderChildren(node: ArticleContentNode, keyPrefix: string) {
  return node.content?.map((child, index) => renderNode(child, `${keyPrefix}-${index}`));
}

function renderNode(node: ArticleContentNode, key: string): ReactNode {
  if (node.type === "text") {
    return <span key={key}>{markedText(node.text ?? "", node.marks)}</span>;
  }

  const textAlign = node.attrs?.textAlign;
  const alignment = textAlign === "center" || textAlign === "right" || textAlign === "justify"
    ? textAlign
    : "left";

  switch (node.type) {
    case "paragraph":
      return <Typography component="p" key={key} sx={{ lineHeight: 1.75, my: 1.5, textAlign: alignment }}>{renderChildren(node, key)}</Typography>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      return (
        <Typography
          component={level === 1 ? "h1" : level === 2 ? "h2" : "h3"}
          key={key}
          sx={{ fontSize: level === 1 ? 28 : level === 2 ? 23 : 19, fontWeight: 750, lineHeight: 1.25, mb: 1.5, mt: 3, textAlign: alignment }}
        >
          {renderChildren(node, key)}
        </Typography>
      );
    }
    case "bulletList":
      return <Box component="ul" key={key} sx={{ my: 1.5, pl: 3 }}>{renderChildren(node, key)}</Box>;
    case "orderedList":
      return <Box component="ol" key={key} sx={{ my: 1.5, pl: 3 }}>{renderChildren(node, key)}</Box>;
    case "listItem":
      return <Box component="li" key={key} sx={{ mb: 0.5 }}>{renderChildren(node, key)}</Box>;
    case "blockquote":
      return <Box component="blockquote" key={key} sx={{ borderLeft: "4px solid", borderColor: "primary.main", color: "text.secondary", m: 0, my: 2, pl: 2 }}>{renderChildren(node, key)}</Box>;
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      if (!src) return null;
      return (
        <Box component="figure" key={key} sx={{ m: 0, my: 2.5 }}>
          <Box alt={String(node.attrs?.alt ?? "")} component="img" src={src} sx={{ borderRadius: 2, display: "block", height: "auto", width: "100%" }} />
          {typeof node.attrs?.title === "string" && node.attrs.title !== "" && (
            <Typography component="figcaption" sx={{ color: "text.secondary", fontSize: 12, mt: 0.75, textAlign: "center" }}>
              {node.attrs.title}
            </Typography>
          )}
        </Box>
      );
    }
    case "youtube": {
      const src = getYoutubeEmbedUrl(node.attrs?.src);
      if (!src) return null;
      return (
        <Box key={key} sx={{ aspectRatio: "16 / 9", my: 2.5 }}>
          <Box allowFullScreen component="iframe" src={src} sx={{ border: 0, borderRadius: 2, height: "100%", width: "100%" }} title="Vídeo do artigo" />
        </Box>
      );
    }
    case "horizontalRule":
      return <Divider key={key} sx={{ my: 3 }} />;
    case "hardBreak":
      return <br key={key} />;
    default:
      return <span key={key}>{renderChildren(node, key)}</span>;
  }
}

export function ArticleMobilePreview({ content, coverImage, summary, tag, title }: ArticleMobilePreviewProps) {
  return (
    <Box sx={{ mx: "auto", width: "100%" }}>
      <Typography sx={{ color: "text.secondary", fontSize: 12, mb: 1, textAlign: "center" }}>
        Prévia no aplicativo
      </Typography>
      <Paper
        elevation={8}
        sx={{
          border: "8px solid",
          borderColor: "grey.900",
          borderRadius: 5,
          height: 720,
          mx: "auto",
          maxWidth: 390,
          overflow: "auto",
        }}
      >
        <Box sx={{ bgcolor: "primary.main", height: 26, position: "sticky", top: 0, zIndex: 1 }} />
        {coverImage && <Box alt="" component="img" src={coverImage} sx={{ aspectRatio: "16 / 9", display: "block", objectFit: "cover", width: "100%" }} />}
        <Stack spacing={1.5} sx={{ p: 2.5 }}>
          {tag && <Chip color="primary" label={tag} size="small" sx={{ alignSelf: "flex-start" }} />}
          <Typography component="h1" variant="h5">{title || "Título do artigo"}</Typography>
          {summary && <Typography color="text.secondary">{summary}</Typography>}
          <Divider />
          <Box>{content.document.content.map((node, index) => renderNode(node, `root-${index}`))}</Box>
        </Stack>
      </Paper>
    </Box>
  );
}
