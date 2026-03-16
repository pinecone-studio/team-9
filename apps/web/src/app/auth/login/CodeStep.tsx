type CodeStepProps = {
  code: string;
  disabled: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onCodeChange: (value: string) => void;
  onResend: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  pendingEmailAddress: string;
};

export default function CodeStep({
  code,
  disabled,
  errorMessage,
  onCodeChange,
  onSubmit,
  pendingEmailAddress,
}: CodeStepProps) {
  return (
    <form className="space-y-7" onSubmit={onSubmit}>
      <div className="space-y-3">
        <div className="space-y-2">
          <label
            className="block text-[16px] font-medium text-[#1F252D]"
            htmlFor="email-code"
          >
            Verification code
          </label>
          <p className="text-sm leading-6 text-[#5F6B7A]">
            Enter the code sent to {pendingEmailAddress}.
          </p>
        </div>

        <input
          autoComplete="one-time-code"
          className="h-[38px] w-full rounded-[6px] border border-[#D6DCE5] bg-white px-4 text-[14px] tracking-[0.2em] text-[#1F252D] outline-none transition focus:border-[#9AA6B6] focus:ring-2 focus:ring-[#C7D3E3]"
          disabled={disabled}
          id="email-code"
          inputMode="numeric"
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder="123456"
          type="text"
          value={code}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm leading-6 text-[#C53030]">{errorMessage}</p>
      ) : null}

      <div className="space-y-3">
        <button
          className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-black text-[14px] font-medium text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:bg-[#3a3a3a]"
          disabled={disabled}
          type="submit"
        >
          {disabled ? "Verifying..." : "Verify code"}
        </button>
      </div>
    </form>
  );
}
