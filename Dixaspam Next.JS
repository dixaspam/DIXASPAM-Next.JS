import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Upload, Download, ThumbsUp, ThumbsDown, Share2,
  Bookmark, RotateCcw, Settings, ChevronDown, PlayCircle, Maximize2, Minimize2, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Utilities ---
const uid = () => Math.random().toString(36).slice(2);

const demoVideos = [
  {
    id: uid(),
    title: "City Timelapse (Demo)",
    author: "Universal dI4",
    tags: ["#city", "#timelapse"],
    description: "Sample demo clip.",
    sources: [
      { label: "1080p", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
      { label: "720p", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
      { label: "480p", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
    ],
    poster: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1280&auto=format&fit=crop",
    likes: 12,
    dislikes: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    comments: [
      { id: uid(), name: "Guest", text: "Love the vibe!", at: Date.now() - 1000 * 60 * 60 * 6 },
    ],
  },
];

// --- Helpers for state persistence ---
const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveState = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// --- Main App ---
export default function UniversalDI4App() {
  const [query, setQuery] = useState("");
  const [library, setLibrary] = useState(() => loadState("udi4_library", demoVideos));
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("all");
  const [savedIds, setSavedIds] = useState(() => loadState("udi4_saved", []));

  useEffect(() => saveState("udi4_library", library), [library]);
  useEffect(() => saveState("udi4_saved", savedIds), [savedIds]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const base = tab === "saved" ? library.filter(v => savedIds.includes(v.id)) : library;
    if (!q) return base.sort((a, b) => b.createdAt - a.createdAt);
    return base.filter(
      v =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.tags?.some(t => t.toLowerCase().includes(q))
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [library, query, tab, savedIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-900">
      {/* App Bar */}
      <div className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
            universal <span className="text-indigo-600">dI4</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button className="gap-2"><Upload className="w-4 h-4" /> Upload</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4 px-3 sm:px-6 py-4">
        <aside className="md:sticky md:top-[64px] self-start">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Search className="w-4 h-4" /> Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search videos, movies, #tags" />
            </CardContent>
          </Card>
        </aside>

        <main>
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">No videos match your search.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(v => (
                <motion.div key={v.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="overflow-hidden group cursor-pointer" onClick={() => setActive(v)}>
                    <div className="relative">
                      <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
                        <img src={v.poster} alt={v.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 hidden group-hover:flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white drop-shadow" />
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base line-clamp-1">{v.title}</CardTitle>
                      <div className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleString()}</div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
