import { CommandPlugin, TerminalCommand } from "../TerminalPlugin";

export const themeCommand: CommandPlugin = {
  name: "theme",
  description: "Changes terminal theme (light/dark)",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    const theme = args[0]?.toLowerCase();

    if (!theme || !["light", "dark"].includes(theme)) {
      return {
        input: `theme ${theme || ""}`,
        output: "Usage: theme <light|dark>",
        timestamp,
        type: "error"
      };
    }

    return {
      input: `theme ${theme}`,
      output: `Terminal theme changed to ${theme}`,
      timestamp,
      type: "success"
    };
  }
};

export const fontCommand: CommandPlugin = {
  name: "font",
  description: "Changes font size (12-20)",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    const size = parseInt(args[0] ?? "", 10);

    if (isNaN(size) || size < 12 || size > 20) {
      return {
        input: `font ${args[0] || ""}`,
        output: "Usage: font <size> (12-20)",
        timestamp,
        type: "error"
      };
    }

    return {
      input: `font ${size}`,
      output: `Font size changed to ${size}px`,
      timestamp,
      type: "success"
    };
  }
};

export const toggleCommand: CommandPlugin = {
  name: "toggle",
  description: "Shows/hides the terminal",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "toggle",
      output: "Terminal visibility toggled",
      timestamp,
      type: "success"
    };
  }
};
