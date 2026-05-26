import { MessageCircle, ExternalLink } from "lucide-react";

const WHATSAPP_URL = "https://wa.link/pf9ivh";

export function ContactApp() {
  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 space-y-5 min-h-0 min-w-0 max-w-full flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl glass-soft flex items-center justify-center">
        <MessageCircle className="w-7 h-7 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Get in touch</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Message me on WhatsApp — I&apos;m open to interesting work and conversations.
        </p>
      </div>
      <button
        type="button"
        onClick={openWhatsApp}
        className="w-full max-w-xs bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <MessageCircle className="w-4 h-4" />
        Chat on WhatsApp
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </button>
    </div>
  );
}
