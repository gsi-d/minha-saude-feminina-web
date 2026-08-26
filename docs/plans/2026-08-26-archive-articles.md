# Article Archiving Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a confirmed archive action to the article edit form while reusing the existing `ARQUIVADO` persistence flow.

**Architecture:** Keep the behavior inside `ArticleEditorForm`, because it already owns the editable values and the `save(status)` pipeline. Add a local Material UI confirmation dialog and submit the current form state with `status: "ARQUIVADO"`; no API, repository, mapper, or database changes are needed.

**Tech Stack:** Next.js 16, React 19, TypeScript, Material UI 9, Vitest, React Testing Library.

---

### Task 1: Configure component testing

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vitest.config.mts`
- Create: `vitest.setup.ts`

**Step 1: Install the test dependencies**

Run:

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom
```

Expected: the command exits with code 0 and records the four packages in `devDependencies` and `package-lock.json`.

**Step 2: Enable jsdom and the assertion setup**

Update the `test` section in `vitest.config.mts`:

```ts
test: {
  environment: "jsdom",
  exclude: ["**/node_modules/**", "**/.git/**", "**/.worktrees/**"],
  setupFiles: ["./vitest.setup.ts"],
},
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

**Step 3: Verify the test runner starts**

Run: `npm test -- --passWithNoTests`

Expected: Vitest exits with code 0.

**Step 4: Commit the test setup**

```bash
git add package.json package-lock.json vitest.config.mts vitest.setup.ts
git commit -m "test: configure component testing"
```

### Task 2: Specify the archive interaction

**Files:**
- Create: `src/features/articles/presentation/ArticleEditorForm.test.tsx`
- Test: `src/features/articles/presentation/ArticleEditorForm.test.tsx`

**Step 1: Create test fixtures and isolate heavy editor children**

In the test, mock only `ArticleRichTextEditor` and `ArticleMobilePreview`, which are unrelated TipTap/preview integration boundaries. Create a valid `Article` fixture with `status: "PUBLICADO"`, one valid category, and a `vi.fn()` `onSave` callback.

**Step 2: Write tests for action visibility**

Add tests proving:

```ts
expect(screen.queryByRole("button", { name: /arquivar artigo/i })).not.toBeInTheDocument();
```

when `initialArticle` is absent and when its status is `ARQUIVADO`, plus:

```ts
expect(screen.getByRole("button", { name: /arquivar artigo/i })).toBeInTheDocument();
```

when editing a published or draft article.

**Step 3: Write the cancel test**

Click **Arquivar artigo**, assert that the confirmation dialog is visible, click **Cancelar**, and assert that `onSave` was not called.

**Step 4: Write the confirmation test**

Click **Arquivar artigo**, confirm in the dialog, and assert that `onSave` receives all current form values with:

```ts
expect.objectContaining({ status: "ARQUIVADO" })
```

Resolve `onSave` and assert that `Artigo arquivado com sucesso.` appears.

**Step 5: Run the focused test and verify RED**

Run: `npm test -- src/features/articles/presentation/ArticleEditorForm.test.tsx`

Expected: FAIL because the **Arquivar artigo** action and dialog do not exist yet.

**Step 6: Commit the failing specification**

```bash
git add src/features/articles/presentation/ArticleEditorForm.test.tsx
git commit -m "test: specify article archiving flow"
```

### Task 3: Implement the archive action

**Files:**
- Modify: `src/features/articles/presentation/ArticleEditorForm.tsx`
- Test: `src/features/articles/presentation/ArticleEditorForm.test.tsx`

**Step 1: Add Material UI archive and dialog imports**

Import `ArchiveOutlinedIcon`, `Dialog`, `DialogActions`, `DialogContent`, `DialogContentText`, and `DialogTitle`.

**Step 2: Track confirmation state**

Inside `ArticleEditorForm`, add:

```ts
const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
const canArchive = Boolean(initialArticle && initialArticle.status !== "ARQUIVADO");
```

**Step 3: Add the edit-only action**

Place this action alongside the existing form actions:

```tsx
{canArchive && (
  <Button
    color="warning"
    disabled={saving}
    onClick={() => setArchiveDialogOpen(true)}
    startIcon={<ArchiveOutlinedIcon />}
    variant="outlined"
  >
    Arquivar artigo
  </Button>
)}
```

**Step 4: Add the confirmation dialog**

Render a controlled Material UI dialog with the title `Arquivar artigo?`, explanatory text containing the current article title, a **Cancelar** action, and a warning-colored **Arquivar** action. Cancel closes the dialog. Confirm closes the dialog and calls `void save("ARQUIVADO")`. Disable dialog actions while `saving` is true.

**Step 5: Add the archive success message**

Replace the two-way success-message conditional with an exhaustive `Record<ArticleStatus, string>`:

```ts
const successMessages: Record<ArticleStatus, string> = {
  ARQUIVADO: "Artigo arquivado com sucesso.",
  PUBLICADO: "Artigo publicado com sucesso.",
  RASCUNHO: "Rascunho salvo com sucesso.",
};
```

After `onSave`, use `setMessage(successMessages[status])`.

**Step 6: Run the focused test and verify GREEN**

Run: `npm test -- src/features/articles/presentation/ArticleEditorForm.test.tsx`

Expected: all archive-form tests pass.

**Step 7: Commit the implementation**

```bash
git add src/features/articles/presentation/ArticleEditorForm.tsx
git commit -m "feat: allow articles to be archived"
```

### Task 4: Verify the complete change

**Files:**
- Verify: `src/features/articles/presentation/ArticleEditorForm.tsx`
- Verify: `src/features/articles/presentation/ArticleEditorForm.test.tsx`

**Step 1: Run the full test suite**

Run: `npm test`

Expected: all tests pass with zero failures.

**Step 2: Run static verification**

Run: `npm run lint`

Expected: ESLint exits with code 0.

Run: `npm run typecheck`

Expected: TypeScript exits with code 0.

**Step 3: Run the production build**

Run: `npm run build`

Expected: Next.js production build exits with code 0.

**Step 4: Review scope and working tree**

Run: `git diff HEAD~2 --stat` and `git status --short`

Expected: the change contains only test setup, the article form test, the article form implementation, and the two planning documents; the pre-existing untracked `src/app/favicon.ico` remains untouched.

