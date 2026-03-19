"use client";

import { useState } from "react";

type UseEditBenefitArchiveFlowParams = {
  handleDelete: (
    archiveComment: string,
    setErrorMessage: (value: string | null) => void,
  ) => Promise<boolean>;
  setErrorMessage: (value: string | null) => void;
};

export function useEditBenefitArchiveFlow({
  handleDelete,
  setErrorMessage,
}: UseEditBenefitArchiveFlowParams) {
  const [archiveComment, setArchiveComment] = useState("");
  const [archiveMode, setArchiveMode] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);

  function handleArchiveClick() {
    setIsArchiveConfirmOpen(false);
    setErrorMessage(null);
    setArchiveMode(true);
  }

  function handleArchiveCancel() {
    setIsArchiveConfirmOpen(false);
    setArchiveComment("");
    setArchiveMode(false);
  }

  function handleArchiveConfirmClick() {
    if (!archiveComment.trim()) {
      setErrorMessage("Please add an archive comment before submitting.");
      return;
    }

    setErrorMessage(null);
    setIsArchiveConfirmOpen(true);
  }

  async function handleArchiveSubmit() {
    const archived = await handleDelete(archiveComment, setErrorMessage);

    if (archived) {
      setIsArchiveConfirmOpen(false);
    }
  }

  return {
    archiveComment,
    archiveMode,
    handleArchiveCancel,
    handleArchiveClick,
    handleArchiveConfirmClick,
    handleArchiveSubmit,
    isArchiveConfirmOpen,
    setArchiveComment,
    setIsArchiveConfirmOpen,
  };
}
