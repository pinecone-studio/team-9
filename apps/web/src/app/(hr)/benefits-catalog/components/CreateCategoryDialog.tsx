"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  HR_DIALOG_MAX_HEIGHT_CLASS,
  HR_DIALOG_OVERLAY_BASE_CLASS,
} from "@/shared/ui/dialog-styles";

import {
  CATEGORY_ICON_OPTIONS,
  type CategoryIconKey,
} from "../benefit-data-icons";

type CreateCategoryDialogProps = {
  creating?: boolean;
  onClose: () => void;
  onCreated: (categoryId: string) => void;
  onSubmit: (name: string, iconKey: CategoryIconKey) => Promise<{ id: string; name: string }>;
};

export default function CreateCategoryDialog({
  creating = false,
  onClose,
  onCreated,
  onSubmit,
}: CreateCategoryDialogProps) {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedIconKey, setSelectedIconKey] = useState<CategoryIconKey>("laptop");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleCreate() {
    setErrorMessage(null);

    try {
      const category = await onSubmit(name, selectedIconKey);
      onCreated(category.id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Category could not be created.",
      );
    }
  }

  return (
    <div
      className={`${HR_DIALOG_OVERLAY_BASE_CLASS} z-50 flex items-center justify-center`}
      onClick={(event) => {
        if (event.target === event.currentTarget && !creating) {
          onClose();
        }
      }}
    >
      <div className={`relative box-border flex w-full max-w-[512px] flex-col items-start gap-4 overflow-y-auto rounded-[10px] border border-[#E5E5E5] bg-white p-6 ${HR_DIALOG_MAX_HEIGHT_CLASS}`}>
        <button
          className="absolute top-[17px] right-[17px] flex h-6 w-6 items-center justify-center text-black disabled:opacity-50"
          disabled={creating}
          onClick={onClose}
          type="button"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex w-full flex-col gap-2 pr-10">
          <h2 className="text-[18px] leading-[18px] font-semibold text-[#0A0A0A]">
            Create New Category
          </h2>
          <p className="text-[14px] leading-5 text-[#737373]">
            Add a new category for organizing benefits.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 py-4">
          <label className="flex w-full flex-col gap-2" htmlFor="category-name-input">
            <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
              Category Name
            </span>
            <input
              className="h-9 rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
              id="category-name-input"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !creating) {
                  void handleCreate();
                }
              }}
              placeholder="e.g., Transportation"
              ref={inputRef}
              type="text"
              value={name}
            />
          </label>

          <div className="flex w-full flex-col gap-2">
            <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
              Icon
            </span>
            <div className="flex w-full flex-wrap items-start content-start gap-x-[23px] gap-y-[7px]">
              {CATEGORY_ICON_OPTIONS.map(({ icon: Icon, key, label }) => {
                const isSelected = key === selectedIconKey;

                return (
                  <button
                    aria-label={label}
                    className={`flex h-9 w-9 items-center justify-center rounded-[8px] border transition-colors ${
                      isSelected
                        ? "border-[#171717] bg-[rgba(23,23,23,0.1)]"
                        : "border-[#E5E5E5] bg-white"
                    }`}
                    key={key}
                    onClick={() => setSelectedIconKey(key)}
                    type="button"
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isSelected ? "text-[#171717]" : "text-[#737373]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {errorMessage ? (
          <p className="w-full rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex w-full items-start justify-end gap-2">
          <button
            className="h-9 rounded-[8px] border border-[#E5E5E5] bg-white px-4 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            disabled={creating}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="h-9 rounded-[8px] bg-[#171717] px-4 text-[14px] leading-5 font-medium text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={creating || name.trim().length === 0}
            onClick={() => void handleCreate()}
            type="button"
          >
            {creating ? "Creating..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
