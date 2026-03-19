type EditRuleDeleteCommentFieldProps = {
  onChange: (value: string) => void;
  value: string;
};

export default function EditRuleDeleteCommentField({
  onChange,
  value,
}: EditRuleDeleteCommentFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[13px] leading-5 font-medium text-[#0F172A]"
        htmlFor="rule-delete-comment"
      >
        Archive comment
      </label>
      <textarea
        className="min-h-[96px] rounded-[10px] border border-[#CBD5E1] px-3 py-2 text-[14px] leading-5 text-[#0F172A] outline-none"
        id="rule-delete-comment"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Explain why this rule should be archived."
        value={value}
      />
    </div>
  );
}
