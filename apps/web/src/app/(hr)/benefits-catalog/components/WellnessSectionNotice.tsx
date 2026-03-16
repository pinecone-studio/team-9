type WellnessSectionNoticeProps = {
  accentClassName: string;
  borderClassName: string;
  message: string;
};

export default function WellnessSectionNotice({
  accentClassName,
  borderClassName,
  message,
}: WellnessSectionNoticeProps) {
  return (
    <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
      <div className={`rounded-[8px] border bg-white p-6 text-[14px] ${accentClassName} ${borderClassName}`}>
        {message}
      </div>
    </section>
  );
}
