import { describe, expect, it } from "vitest";

import { appTheme } from "@/shared/config/theme";

describe("appTheme dark color scheme", () => {
  const darkColorScheme = appTheme.colorSchemes.dark;

  if (!darkColorScheme) {
    throw new Error("The dark color scheme must be configured");
  }

  const darkPalette = darkColorScheme.palette;

  it("keeps the primary brand color used by the top app bar", () => {
    expect(darkPalette.primary.main).toBe("#C56682");
  });

  it("uses a lighter rose-charcoal hierarchy for page and surfaces", () => {
    expect(darkPalette.background.default).toBe("#211A1D");
    expect(darkPalette.background.paper).toBe("#2C2327");
    expect(darkPalette.background.paper).not.toBe(darkPalette.background.default);
  });

  it("defines warm readable text, dividers, and interaction states", () => {
    expect(darkPalette.text.primary).toBe("#F8ECEF");
    expect(darkPalette.text.secondary).toBe("#D8C2C9");
    expect(darkPalette.divider).toBe("rgba(229, 185, 198, 0.18)");
    expect(darkPalette.action.hover).toBe("rgba(197, 102, 130, 0.10)");
    expect(darkPalette.action.selected).toBe("rgba(197, 102, 130, 0.18)");
  });
});
