import { Download, ExternalLink } from "lucide-react";
import resumePdf from "@/assets/mayank-resume.pdf";

export function PreviewApp() {
  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 p-3 gap-2">
      <div className="flex items-center justify-end gap-2 shrink-0">
        <a
          href={resumePdf}
          download="Mayank-React-Resume.pdf"
          className="text-xs flex items-center gap-1.5 px-2 py-1 rounded glass-soft hover:text-primary transition"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
        <a
          href={resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs flex items-center gap-1.5 px-2 py-1 rounded glass-soft hover:text-primary transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open
        </a>
      </div>
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-glass-border glass-soft bg-white">
        <iframe
          src={`${resumePdf}#toolbar=1&navpanes=0&view=FitH`}
          title="Mayank Resume"
          className="w-full h-full min-h-0 border-0"
        />
      </div>
    </div>
  );
}
