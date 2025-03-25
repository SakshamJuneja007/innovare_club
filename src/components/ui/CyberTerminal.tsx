"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X } from "lucide-react";
import confetti from "canvas-confetti";

import { TerminalCommand, TerminalPluginManager } from "./terminal/TerminalPlugin";
import { helpCommand, systemCommand, statsCommand, infoCommand } from "./terminal/plugins/SystemCommands";
import { themeCommand, fontCommand, toggleCommand } from "./terminal/plugins/UICommands";
import { matrixCommand, hackCommand, partyCommand } from "./terminal/plugins/EasterEggCommands";
import MatrixRain from "./effects/MatrixRain";

export default function CyberTerminal() {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Array<{url: string; name: string; role: string}>>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pluginManager = useRef(new TerminalPluginManager());

  useEffect(() => {
    const manager = pluginManager.current;
    
    // Register system commands
    manager.registerPlugin("help", helpCommand);
    manager.registerPlugin("system", systemCommand);
    manager.registerPlugin("stats", statsCommand);
    manager.registerPlugin("info", infoCommand);
    
    // Register UI commands
    manager.registerPlugin("theme", themeCommand);
    manager.registerPlugin("font", fontCommand);
    manager.registerPlugin("toggle", toggleCommand);
    
    // Register easter egg commands
    manager.registerPlugin("matrix", matrixCommand);
    manager.registerPlugin("hack", hackCommand);
    manager.registerPlugin("party", partyCommand);

    // Register clear command
    manager.registerPlugin("clear", {
      name: "clear",
      description: "Clears the terminal",
      async execute() {
        setCommands([]);
        return {
          input: "clear",
          output: "",
          timestamp: new Date().toLocaleTimeString(),
          type: "success"
        };
      }
    });

    // Add welcome message
    setCommands([{
      input: "",
      output: `CyberTerminal v2.5 initialized.
Type 'help' for available commands.`,
      timestamp: new Date().toLocaleTimeString(),
      type: "info"
    }]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    
    const result = await pluginManager.current.executeCommand(cmd);
    
    if (result.input === "clear") {
      setCommands([]);
    } else {
      setCommands(prev => [...prev, result]);
       
      // Handle special effects
      if (result.effect === "matrix") {
        setActiveEffect("matrix");
      } else if (result.effect === "party") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else if (result.effect === "showPhotos") {
        setPhotos(result.photos || []);
        setActiveEffect("photos");
      }
    }
    
    // Handle special commands that affect terminal state
    const [command] = cmd.toLowerCase().trim().split(" ");
    if (command === "toggle") {
      setIsMinimized(prev => !prev);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 md:bottom-8 right-4 md:right-8 w-[calc(100%-2rem)] md:w-[600px] z-50 max-h-[80vh] overflow-hidden"
    >
      <AnimatePresence>
        {activeEffect === "matrix" && (
          <MatrixRain onComplete={() => setActiveEffect(null)} />
        )}
        {activeEffect === "photos" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
            onClick={() => {
              setActiveEffect(null);
              setPhotos([]);
            }}
          >
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="relative h-64 overflow-hidden rounded-xl border-2 border-[#CFFB2D]/20">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold text-[#CFFB2D] font-['Orbitron']">
                      {photo.name}
                    </h3>
                    <p className="text-sm text-[#8B30FF] font-['Share_Tech_Mono']">
                      {photo.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="rounded-t-lg bg-black/80 p-2 backdrop-blur-md border-t border-x border-[#CFFB2D]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#CFFB2D]">
            <TerminalIcon size={16} />
            <span className="font-['Share_Tech_Mono'] text-sm">SYSTEM:TERMINAL</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[#CFFB2D] hover:text-[#CFFB2D]/80"
            >
              {isMinimized ? "□" : "−"}
            </button>
            <button
              onClick={() => setCommands([])}
              className="text-[#CFFB2D] hover:text-[#CFFB2D]/80"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "400px" }}
            exit={{ height: 0 }}
            className="relative rounded-b-lg bg-black/80 backdrop-blur-md border border-t-0 border-[#CFFB2D]/20"
          >
            <div
              ref={terminalRef}
              className="h-[40vh] md:h-[356px] overflow-y-auto p-4 font-['Share_Tech_Mono'] text-sm"
            >
              {commands.map((cmd, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center gap-2 text-[#CFFB2D]">
                    <span className="opacity-50">[{cmd.timestamp}]</span>
                    <span className="text-[#8B30FF]">$</span>
                    <span>{cmd.input}</span>
                  </div>
                  <div className={`mt-1 whitespace-pre-wrap ${
                    cmd.type === "error" ? "text-red-400" :
                    cmd.type === "success" ? "text-[#CFFB2D]" :
                    "text-gray-400"
                  }`}>
                    {cmd.output}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 p-2 border-t border-[#CFFB2D]/20">
              <div className="flex items-center gap-2">
                <span className="text-[#8B30FF]">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent font-['Share_Tech_Mono'] text-[#CFFB2D] outline-none"
                  placeholder="Type 'help' for available commands..."
                  spellCheck={false}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
