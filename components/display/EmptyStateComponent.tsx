import Image from "next/image";

type EmptyStateProps = {
  titleText: string;
  subtitleText?: string;
  icon: string;
};

export default function EmptyState({ titleText, subtitleText, icon }: EmptyStateProps) {
  return (
    <section className="flex flex-col justify-center items-center h-[55vh]">
      <div className="flex flex-col justify-center items-center w-4/12 text-center">
        <Image src={icon} alt="svg icon" width={146} height={146} />
        <p className="text-2xl font-semibold mb-1">{titleText}</p>
        <p className="text-sm font-normal">{subtitleText}</p>
      </div>
    </section>
  );
}
