import Headline from "@/components/headline";
import Image from "next/image";

const GuidePage = () => {
  return (
    <div className="w-full">
      <div className="space-y-12 px-6 pb-6 pt-16">
        <Headline>Anleitung: Link Kopieren</Headline>
        <div className="max-w-[600px]">
          Aus Sicherheitsgründen kann nicht einfach der Link aus der
          Adressleiste kopiert werden. Wenn man als Mannschaftsführer eingeloggt
          ist, kann man den Link über den Button &quot;Link kopieren&quot; in
          der Mannschaftsübersicht kopieren. Dieser Link muss dann an die
          Mannschaftsmitglieder weitergegeben werden, damit diese der Mannschaft
          beitreten können. Andere Links funktionieren nicht.
        </div>
        <div className="border rounded-md shadow max-w-[500px] w-full overflow-hidden">
          <Image
            src="/assets/invite-link.png"
            alt="Anleitung zum Link Kopieren"
            width={1076}
            height={844}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
