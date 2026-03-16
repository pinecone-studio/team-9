"use client";

import { useEffect, useRef, useState } from "react";

type CreateCategoryDialogProps = {
  creating?: boolean;
  onClose: () => void;
  onCreated: (categoryId: string) => void;
  onSubmit: (name: string) => Promise<{ id: string; name: string }>;
};

export default function CreateCategoryDialog({
  creating = false,
  onClose,
  onCreated,
  onSubmit,
}: CreateCategoryDialogProps) {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleCreate() {
    setErrorMessage(null);

    try {
      const category = await onSubmit(name);
      onCreated(category.id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Category could not be created.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget && !creating) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[460px] rounded-[10px] border border-[#DBDEE1] bg-white p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] leading-7 font-semibold text-[#060B10]">
            Create new category
          </h2>
          <p className="text-[14px] leading-5 text-[#64748B]">
            Add a category first, then add benefits inside it.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label
            className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]"
            htmlFor="category-name-input"
          >
            Category name
          </label>
          <input
            className="h-10 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
            id="category-name-input"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !creating) {
                void handleCreate();
              }
            }}
            placeholder="Career Development"
            ref={inputRef}
            type="text"
            value={name}
          />
        </div>

        {errorMessage ? (
          <p className="mt-3 rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            className="h-9 rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-4 text-[14px] leading-4 font-normal text-black"
            disabled={creating}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="h-9 rounded-[6px] bg-black px-4 text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={creating || name.trim().length === 0}
            onClick={() => void handleCreate()}
            type="button"
          >
            {creating ? "Creating..." : "Create category"}
          </button>
        </div>
      </div>
    </div>
  );
}
