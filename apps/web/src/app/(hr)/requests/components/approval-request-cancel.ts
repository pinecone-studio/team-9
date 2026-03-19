export const REQUEST_CANCELLED_BY_REQUESTER = "REQUEST_CANCELLED_BY_REQUESTER";

export function buildCancelledByRequesterComment() {
  return REQUEST_CANCELLED_BY_REQUESTER;
}

export function isCancelledByRequesterComment(value?: string | null) {
  return value?.trim() === REQUEST_CANCELLED_BY_REQUESTER;
}
