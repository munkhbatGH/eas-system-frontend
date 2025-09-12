import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        {/* <span className={title()}>Бидний тухай&nbsp;</span> */}
        <span className={title({ color: "violet" })}>Бидний тухай&nbsp;</span>
        <br />
      </div>
    </section>
  );
}
