export interface TerminalCommand {
  input: string;
  output: string;
  timestamp: string;
  type: "success" | "error" | "info";
  effect?: "matrix" | "hack" | "party" | "showPhotos";
  photos?: Array<{
    url: string;
    name: string;
    role: string;
  }>;
}

export interface CommandPlugin {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<TerminalCommand>;
}

export interface TerminalState {
  isVisible: boolean;
  theme: "light" | "dark";
  fontSize: number;
}

export class TerminalPluginManager {
  private plugins: Map<string, CommandPlugin> = new Map();
  private state: TerminalState = {
    isVisible: true,
    theme: "dark",
    fontSize: 14
  };

  registerPlugin(command: string, plugin: CommandPlugin) {
    this.plugins.set(command.toLowerCase(), plugin);
  }

  async executeCommand(command: string): Promise<TerminalCommand> {
    const [cmd, ...args] = command.toLowerCase().trim().split(" ");
    const plugin = this.plugins.get(cmd);

    if (!plugin) {
      return {
        input: command,
        output: `Command not found: ${cmd}. Type 'help' for available commands.`,
        timestamp: new Date().toLocaleTimeString(),
        type: "error"
      };
    }

    try {
      return await plugin.execute(args);
    } catch (error: any) {
      return {
        input: command,
        output: `Error executing command: ${error?.message || 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "error"
      };
    }
  }

  getState(): TerminalState {
    return { ...this.state };
  }

  setState(newState: Partial<TerminalState>) {
    this.state = { ...this.state, ...newState };
  }

  getCommands(): { command: string; description: string }[] {
    return Array.from(this.plugins.entries()).map(([command, plugin]) => ({
      command,
      description: plugin.description
    }));
  }
}
