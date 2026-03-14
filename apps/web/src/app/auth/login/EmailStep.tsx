type EmailStepProps = {
  disabled: boolean;
  emailAddress: string;
  errorMessage: string | null;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function EmailStep({
  disabled,
  emailAddress,
  errorMessage,
  onEmailChange,
  onSubmit,
}: EmailStepProps) {
  return (
    <form className="space-y-7" onSubmit={onSubmit}>
      <div className="space-y-3">
        <label
          className="block text-[16px] font-medium text-[#1F252D]"
          htmlFor="email-address"
        >
          Email
        </label>
        <input
          autoComplete="email"
          className="h-[38px] w-full rounded-[6px] border border-[#D6DCE5] bg-white px-4 text-[14px] text-[#1F252D] outline-none transition focus:border-[#9AA6B6] focus:ring-2 focus:ring-[#C7D3E3]"
          disabled={disabled}
          id="email-address"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="Hr@company.com"
          type="email"
          value={emailAddress}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm leading-6 text-[#C53030]">{errorMessage}</p>
      ) : null}

      <button
        className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-black text-[14px] font-medium text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:bg-[#3a3a3a]"
        disabled={disabled}
        type="submit"
      >
        {disabled ? "Loading..." : "Log in"}
      </button>
    </form>
  );
}
