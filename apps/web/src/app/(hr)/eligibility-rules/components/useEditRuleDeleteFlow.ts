"use client";

import { useState } from "react";
import type { ApprovalRoleValue } from "./RuleApprovalSection";

type UseEditRuleDeleteFlowParams = {
  onDelete: (
    payload: {
      approvalRole: ApprovalRoleValue;
      deleteComment: string;
      id: string;
    },
  ) => Promise<void>;
  ruleId: string;
  setErrorMessage: (value: string | null) => void;
};

export function useEditRuleDeleteFlow({
  onDelete,
  ruleId,
  setErrorMessage,
}: UseEditRuleDeleteFlowParams) {
  const [deleteComment, setDeleteComment] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  function handleDeleteClick() {
    setIsDeleteConfirmOpen(false);
    setErrorMessage(null);
    setDeleteMode(true);
  }

  function handleDeleteCancel() {
    setDeleteComment("");
    setDeleteMode(false);
    setIsDeleteConfirmOpen(false);
  }

  function handleDeleteConfirmClick() {
    if (!deleteComment.trim()) {
      setErrorMessage("Please add an archive comment before submitting.");
      return;
    }

    setErrorMessage(null);
    setIsDeleteConfirmOpen(true);
  }

  async function handleDeleteSubmit(approvalRole: ApprovalRoleValue) {
    await onDelete({
      approvalRole,
      deleteComment,
      id: ruleId,
    });
    setIsDeleteConfirmOpen(false);
  }

  return {
    deleteComment,
    deleteMode,
    handleDeleteCancel,
    handleDeleteClick,
    handleDeleteConfirmClick,
    handleDeleteSubmit,
    isDeleteConfirmOpen,
    setDeleteComment,
  };
}
