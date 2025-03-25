import { CommandPlugin, TerminalCommand } from "../TerminalPlugin";

export const matrixCommand: CommandPlugin = {
  name: "matrix",
  description: "Hidden command - do not display in help",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "matrix",
      output: "INITIATING MATRIX PROTOCOL...\n[====================] 100%\nMATRIX RAIN VISUALIZATION ACTIVATED",
      timestamp,
      type: "success",
      effect: "matrix"
    };
  }
};

export const hackCommand: CommandPlugin = {
  name: "hack",
  description: "Hidden command - do not display in help",
  async execute(args: string[]): Promise<TerminalCommand> {
    const target = args[0] || "mainframe";
    const timestamp = new Date().toLocaleTimeString();
    
    const steps = [
      "INITIALIZING CYBER ATTACK SEQUENCE",
      "BYPASSING FIREWALL...",
      "CRACKING ENCRYPTION...",
      "ACCESSING NEURAL NETWORK...",
      "DOWNLOADING CLASSIFIED DATA...",
      `${target.toUpperCase()} SUCCESSFULLY COMPROMISED`
    ];

    return {
      input: `hack ${target}`,
      output: steps.join("\n"),
      timestamp,
      type: "success",
      effect: "hack"
    };
  }
};

export const partyCommand: CommandPlugin = {
  name: "party",
  description: "Hidden command - do not display in help",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "party",
      output: "🎉 INITIATING CYBER CELEBRATION PROTOCOL 🎉",
      timestamp,
      type: "success",
      effect: "party"
    };
  }
};
