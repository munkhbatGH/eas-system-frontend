import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

import { Navbar } from "@/components/layout/navbar/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (

    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-xl text-center justify-center">
            <span className={title()}>EZ&nbsp;</span>
            <span className={title({ color: "violet" })}>СИСТЕМ&nbsp;</span>
            <br /><br />
            <span className={title()}>
              Энгийн загвар, хурдан хөгжүүлэлт, орчин үеийн UI.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
              Загварлаг, хурдан мөн орчин үеийн шийдэлттэй вэб аппликейшн.
            </div>
          </div>

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span className="text-wrap">
                Та хэрхэн ашиглахаа мэдэхгүй бол эндээс харна уу <Code color="primary">тест эрх</Code>
              </span>
            </Snippet>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
