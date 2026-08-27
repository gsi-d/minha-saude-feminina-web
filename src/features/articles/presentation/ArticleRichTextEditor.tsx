"use client";

import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Image } from "@tiptap/extension-image";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Youtube } from "@tiptap/extension-youtube";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useId, type ChangeEvent, type ReactNode } from "react";

import type { ArticleDocument } from "@/features/articles/domain/article";

interface ArticleRichTextEditorProps {
  onChange: (document: ArticleDocument) => void;
  value: ArticleDocument;
}

interface ToolbarButtonProps {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}

function ToolbarButton({ active, children, disabled, label, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          aria-label={label}
          color={active ? "primary" : "default"}
          disabled={disabled}
          onClick={onClick}
          size="small"
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function requestLink(editor: Editor) {
  const currentUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Endereço do link", currentUrl ?? "https://");

  if (url === null) return;
  if (url.trim() === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function requestImageByUrl(editor: Editor) {
  const src = window.prompt("URL pública da imagem");
  if (!src) return;
  const alt = window.prompt("Texto alternativo da imagem") ?? "";
  const title = window.prompt("Legenda da imagem") ?? "";
  editor.chain().focus().setImage({ src, alt, title }).run();
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Não foi possível ler a imagem selecionada."));
    };
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
    reader.readAsDataURL(file);
  });
}

export function ArticleRichTextEditor({ onChange, value }: ArticleRichTextEditorProps) {
  const localImageInputId = useId();
  const editor = useEditor({
    immediatelyRender: false,
    content: value.document,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image.configure({ allowBase64: true }),
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Youtube.configure({ nocookie: true, modestBranding: true }),
    ],
    onUpdate: ({ editor: currentEditor }) => {
      onChange({
        schemaVersion: 1,
        document: currentEditor.getJSON() as ArticleDocument["document"],
      });
    },
  });

  if (!editor) return null;
  const activeEditor = editor;

  async function handleLocalImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const src = await readFileAsDataUrl(file);
      const alt = window.prompt("Texto alternativo da imagem") ?? "";
      const title = window.prompt("Legenda da imagem") ?? "";
      activeEditor.chain().focus().setImage({ src, alt, title }).run();
    } catch {
      window.alert("Não foi possível carregar a imagem selecionada.");
    }
  }

  return (
    <Paper variant="outlined">
      <input
        accept="image/*"
        hidden
        id={localImageInputId}
        onChange={handleLocalImageChange}
        type="file"
      />
      <Stack
        direction="row"
        sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.5, p: 1 }}
      >
        <ToolbarButton disabled={!editor.can().undo()} label="Desfazer" onClick={() => editor.chain().focus().undo().run()}>
          <UndoIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton disabled={!editor.can().redo()} label="Refazer" onClick={() => editor.chain().focus().redo().run()}>
          <RedoIcon fontSize="small" />
        </ToolbarButton>
        <Divider flexItem orientation="vertical" />

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            aria-label="Estilo do texto"
            displayEmpty
            onChange={(event) => {
              const level = Number(event.target.value);
              if (level === 0) editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
            }}
            value={editor.isActive("heading", { level: 1 }) ? 1 : editor.isActive("heading", { level: 2 }) ? 2 : editor.isActive("heading", { level: 3 }) ? 3 : 0}
          >
            <MenuItem value={0}>Parágrafo</MenuItem>
            <MenuItem value={1}>Título 1</MenuItem>
            <MenuItem value={2}>Título 2</MenuItem>
            <MenuItem value={3}>Título 3</MenuItem>
          </Select>
        </FormControl>

        <ToolbarButton active={editor.isActive("bold")} label="Negrito" onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} label="Itálico" onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("underline")} label="Sublinhado" onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlinedIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("strike")} label="Tachado" onClick={() => editor.chain().focus().toggleStrike().run()}><FormatStrikethroughIcon fontSize="small" /></ToolbarButton>

        <Tooltip title="Cor do texto">
          <Box
            component="label"
            sx={{ alignItems: "center", cursor: "pointer", display: "flex", p: 0.5 }}
          >
            <Box
              component="input"
              onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
              sx={{ border: 0, cursor: "pointer", height: 26, p: 0, width: 30 }}
              type="color"
              value={(editor.getAttributes("textStyle").color as string | undefined) ?? "#C56682"}
            />
          </Box>
        </Tooltip>
        <ToolbarButton active={editor.isActive("highlight")} label="Destacar texto" onClick={() => editor.chain().focus().toggleHighlight({ color: "#fff1a8" }).run()}>
          <Box component="span" sx={{ bgcolor: "#fff1a8", fontSize: 13, fontWeight: 700, px: 0.5 }}>A</Box>
        </ToolbarButton>

        <Divider flexItem orientation="vertical" />
        <ToolbarButton active={editor.isActive("bulletList")} label="Lista com marcadores" onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} label="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} label="Citação" onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuoteIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Alinhar à esquerda" onClick={() => editor.chain().focus().setTextAlign("left").run()}><FormatAlignLeftIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Centralizar" onClick={() => editor.chain().focus().setTextAlign("center").run()}><FormatAlignCenterIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Alinhar à direita" onClick={() => editor.chain().focus().setTextAlign("right").run()}><FormatAlignRightIcon fontSize="small" /></ToolbarButton>

        <Divider flexItem orientation="vertical" />
        <ToolbarButton active={editor.isActive("link")} label="Inserir link" onClick={() => requestLink(editor)}><InsertLinkIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Inserir imagem por URL" onClick={() => requestImageByUrl(editor)}><ImageOutlinedIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Inserir imagem da máquina" onClick={() => document.getElementById(localImageInputId)?.click()}><ImageOutlinedIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()}><HorizontalRuleIcon fontSize="small" /></ToolbarButton>
        <ToolbarButton label="Limpar formatação" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><FormatClearIcon fontSize="small" /></ToolbarButton>
      </Stack>

      <Divider />
      <Box
        sx={{
          "& .tiptap": { minHeight: 380, outline: 0, p: 2.5 },
          "& .tiptap blockquote": { borderLeft: "4px solid", borderColor: "primary.main", m: 0, my: 2, pl: 2 },
          "& .tiptap img": { borderRadius: 2, display: "block", height: "auto", my: 2, maxWidth: "100%" },
          "& .tiptap iframe": { aspectRatio: "16 / 9", border: 0, borderRadius: 2, height: "auto", maxWidth: "100%", width: "100%" },
          "& .tiptap p.is-editor-empty:first-of-type::before": { color: "text.disabled", content: '"Comece a escrever o artigo..."', float: "left", height: 0, pointerEvents: "none" },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
