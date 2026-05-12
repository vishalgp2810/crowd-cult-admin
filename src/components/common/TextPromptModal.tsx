"use client";

import React, { useState } from "react";
import { Modal, Button, TextField, Input } from "@heroui/react";

export type TextPromptModalProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onRemove?: (value: string) => void;
  onDone?: () => void;
};

export function TextPromptModal({
  trigger,
  title,
  description,
  placeholder = "",
  onConfirm,
  onRemove,
  onDone,
}: TextPromptModalProps) {
  const [value, setValue] = useState("");
  const [addedTags, setAddedTags] = useState<string[]>([]);

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    setAddedTags((prev) => [...prev, trimmed]);
    setValue("");
  };

  // Remove by index to avoid matching duplicate tag values
  const handleRemoveSessionTag = (index: number) => {
    const tag = addedTags[index];
    setAddedTags((prev) => prev.filter((_, i) => i !== index));
    onRemove?.(tag);
  };

  const handleClose = (close: () => void) => {
    setValue("");
    setAddedTags([]);
    close();
  };

  return (
    <Modal>
      {trigger}

      <Modal.Backdrop
        variant="blur"
        className="bg-black/70 !z-[500]"
        style={{ zIndex: 500 }}
      >
        <Modal.Container placement="center" size="md">
          <Modal.Dialog className="border border-white/10 bg-[#0A0A0A] rounded-2xl shadow-2xl">
            {(renderProps) => (
              <>
                {/* ── Compact header: title + close in one row ── */}
                <Modal.Header className="flex flex-row items-center justify-between px-5 py-4 border-b border-white/5">
                  <Modal.Heading className="text-base font-black italic uppercase tracking-tighter text-white underline decoration-purple-600 decoration-[3px] underline-offset-4">
                    {title}
                  </Modal.Heading>
                  <Modal.CloseTrigger className="relative static inset-auto" />
                </Modal.Header>

                {/* ── Body ── */}
                <Modal.Body className="px-5 py-4 space-y-3">
                  {description && (
                    <p className="text-xs text-gray-500 italic leading-snug">
                      {description}
                    </p>
                  )}

                  <TextField
                    autoFocus
                    aria-label={title}
                    onChange={setValue}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                  >
                    <Input
                      value={value}
                      placeholder={placeholder}
                      className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-700 font-bold italic text-sm h-11 rounded-xl px-4 outline-none focus:border-purple-600/60 hover:border-white/20 transition-all duration-300"
                    />
                  </TextField>

                  {/* Live session tags */}
                  {addedTags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 italic">
                        Added this session
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {addedTags.map((tag, i) => (
                          <span
                            key={`${tag}-${i}`}
                            className="flex items-center gap-1.5 pl-3 pr-1.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border border-purple-600/40 text-purple-400 bg-purple-600/10"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveSessionTag(i)}
                              className="w-3.5 h-3.5 rounded-full bg-purple-600/20 hover:bg-red-500/40 hover:text-red-400 text-purple-500 flex items-center justify-center transition-all duration-200 text-[9px] leading-none"
                              aria-label={`Remove ${tag}`}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Modal.Body>

                {/* ── Compact footer ── */}
                <Modal.Footer className="border-t border-white/5 px-5 py-3 flex justify-end">
                  <Button
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black italic uppercase tracking-widest text-[9px] rounded-lg px-8 h-9 shadow-lg shadow-purple-600/20"
                    onPress={() => {
                      const trimmed = value.trim();
                      if (trimmed) {
                        onConfirm(trimmed);
                        setAddedTags((prev) => [...prev, trimmed]);
                      }
                      onDone?.();
                      handleClose(renderProps.close);
                    }}
                  >
                    Done
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
