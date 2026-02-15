import { LucideIcon } from "lucide-react";

interface StandardButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  text: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export function StandardButton({
  onClick,
  icon: Icon,
  text,
  color = "#22c55e",
  disabled = false,
  loading = false,
  type = "button",
  fullWidth = false,
}: StandardButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold uppercase tracking-wide transition-all hover:scale-105 hover:opacity-90 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ml-auto ${
        fullWidth ? "w-full" : ""
      }`}
      style={{
        backgroundColor: color,
        color: "#ffffff",
      }}
    >
      <Icon size={18} />
      <span className="text-xs">{loading ? "CARREGANDO..." : text}</span>
    </button>
  );
}