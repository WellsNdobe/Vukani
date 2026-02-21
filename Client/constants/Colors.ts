export type ThemeName = "light" | "dark" | "sage";

export type ThemePalette = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  cardBackground: string;
  border: string;
  placeholder: string;
  divider: string;
  separator: string;
  success: string;
  destructive: string;
  pressedTint: string;
};

const baseLight = {
  text: "#11181C",
  background: "#FFFFFF",
  tint: "#0A7EA4",
  icon: "#687076",
  tabIconDefault: "#687076",
  tabIconSelected: "#0A7EA4",
};

const baseDark = {
  text: "#ECEDEE",
  background: "#151718",
  tint: "#FFFFFF",
  icon: "#9BA1A6",
  tabIconDefault: "#9BA1A6",
  tabIconSelected: "#FFFFFF",
};

const sageAccent = "#2F9E6D";

export const Colors: Record<ThemeName, ThemePalette> = {
  light: {
    ...baseLight,
    cardBackground: "#F5F7F8",
    border: "#D6DBDF",
    placeholder: "#8A939A",
    divider: "#E3E7EA",
    separator: "#E3E7EA",
    success: "#2F9E6D",
    destructive: "#D65A5A",
    pressedTint: "#086785",
  },
  dark: {
    ...baseDark,
    cardBackground: "#1D2225",
    border: "#2C353B",
    placeholder: "#8D98A0",
    divider: "#2C353B",
    separator: "#2C353B",
    success: "#57C08B",
    destructive: "#F08A8A",
    pressedTint: "#E5E7E8",
  },
  sage: {
    text: "#10352A",
    background: "#FFFFFF",
    tint: sageAccent,
    icon: "#5E7F72",
    tabIconDefault: "#7C9C90",
    tabIconSelected: sageAccent,
    cardBackground: "#FFFFFF",
    border: "#C7DDD2",
    placeholder: "#6E8E82",
    divider: "#E8F4EE",
    separator: "#D7EADF",
    success: "#2D8E62",
    destructive: "#D96C6C",
    pressedTint: "#257F58",
  },
};
