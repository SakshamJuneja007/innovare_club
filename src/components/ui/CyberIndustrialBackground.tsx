"use client";

import { motion } from "framer-motion";

export default function CyberIndustrialBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCA0MCAwIE0gMCAwIEwgMCA0MCBNIDQwIDQwIEwgMCA0MCBNIDQwIDQwIEwgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIwNywgMjUxLCA0NSwgMC4wOCkiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0gMjAgMCBMIDIwIDQwIE0gMCAyMCBMIDQwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjA3LCAyNTEsIDQ1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

      {/* Terminal window border effect */}
      <div className="absolute inset-4 border border-[#CFFB2D]/10 rounded-lg">
        <div className="absolute top-0 left-4 -translate-y-3 px-4 bg-[#0a0a0a] font-['Share_Tech_Mono'] text-[#CFFB2D]/40 text-sm">
          SYSTEM://terminal_v2.5
        </div>
      </div>

      {/* Digital noise overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay">
        <div className="h-full w-full" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }} />
      </div>

      {/* Silhouettes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 w-[300px] h-[500px] bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb')] bg-cover bg-center opacity-30" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[500px] bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover bg-center opacity-30 transform scale-x-[-1]" />
      </div>

      {/* HUD Elements */}
      <div className="absolute inset-x-8 top-8 flex justify-between items-start font-['Share_Tech_Mono'] text-xs text-[#CFFB2D]/30">
        <div className="space-y-1">
          <div>SYS_STATUS: ONLINE</div>
          <div>CPU_LOAD: 32%</div>
          <div>MEM_USAGE: 4.2GB</div>
        </div>
        <div className="space-y-1 text-right">
          <div>LAT: 51.5074° N</div>
          <div>LON: 0.1278° W</div>
          <div>SIGNAL: 98%</div>
        </div>
      </div>

      {/* Animated scan line */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#CFFB2D]/[0.03] to-transparent"
        animate={{
          y: ["0%", "100%", "0%"]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ height: "200%" }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/80" />
    </div>
  );
}
