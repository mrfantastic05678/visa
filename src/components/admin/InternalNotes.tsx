"use client";

import { Avatar } from "./ui";
import { useState } from "react";

interface Note {
  author: string;
  initials: string;
  time: string;
  text: string;
}

export function InternalNotes({ initial }: { initial: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initial);
  const [text, setText] = useState("");

  function post() {
    if (!text.trim()) return;
    setNotes((n) => [
      { author: "Aisha", initials: "A", time: "Just now", text: text.trim() },
      ...n,
    ]);
    setText("");
  }

  return (
    <div>
      <div className="space-y-3 mb-4">
        {notes.map((n, i) => (
          <div key={i} className="rounded-lg bg-mist p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar initials={n.initials} className="h-5 w-5 text-[9px] flex-shrink-0" />
                <span className="text-sm font-sans font-semibold text-ink truncate">{n.author}</span>
              </div>
              <span className="text-xs font-sans text-muted flex-shrink-0">{n.time}</span>
            </div>
            <p className="text-sm font-sans text-ink leading-relaxed">{n.text}</p>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Add a note…"
        className="w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none"
      />
      <button
        onClick={post}
        className="mt-2 w-full h-10 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity"
      >
        Post note
      </button>
    </div>
  );
}
