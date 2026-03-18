type ContractsSuccessToastProps = {
  message: string | null;
};

export default function ContractsSuccessToast({ message }: ContractsSuccessToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-[95] max-w-[360px] rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
      <p className="text-[14px] leading-5 font-medium text-[#166534]">{message}</p>
    </div>
  );
}
