export type ResolvedColorMode = "light" | "dark";

export function getNextColorMode(
  mode: "light" | "dark" | "system" | undefined,
  systemMode: ResolvedColorMode | undefined,
): ResolvedColorMode {
  const activeMode = mode === "system" ? systemMode : mode;

  return activeMode === "dark" ? "light" : "dark";
}
