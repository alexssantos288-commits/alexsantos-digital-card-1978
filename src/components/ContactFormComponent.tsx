import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, ContactFormField } from "@/types/profile";

interface ContactFormComponentProps {
  profile: Profile;
}

export function ContactFormComponent({ profile }: ContactFormComponentProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const theme = profile.theme || {};
  const itemColor = theme.itemColor || "#1ccec8";
  const textColor = theme.textColor || "#ffffff";
  const borderRadius = theme.borderRadius || "24";

  const fields = profile.contactform?.fields || [];
  const enabledFields = fields.filter((f: ContactFormField) => f.enabled);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasAllRequired = enabledFields.every((field: ContactFormField) => {
      if (!field.required) return true;
      const value = formData[field.id] || "";
      return value.trim() !== "";
    });

    if (!hasAllRequired) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase.from("form_submissions").insert({
        profile_id: profile.user_id,
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        message: formData.message || "",
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({});

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  if (submitted) {
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          border: "2px solid rgb(34, 197, 94)",
          borderRadius: `${borderRadius}px`,
        }}
      >
        <p className="text-xl font-bold text-green-500 mb-2">
          ✅ Mensagem Enviada!
        </p>
        <p style={{ color: textColor }}>
          {profile.contactform?.successMessage ||
            "Obrigado! Sua mensagem foi enviada com sucesso."}
        </p>
      </div>
    );
  }

  if (!enabledFields.length) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {enabledFields.map((field: ContactFormField) => {
        const value = formData[field.id] || "";

        return (
          <div key={field.id}>
            <label
              className="block text-sm font-bold mb-2"
              style={{ color: textColor }}
            >
              {field.label}{" "}
              {field.required && (
                <span className="text-red-500">*</span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 transition resize-none"
                style={{
                  borderColor: textColor,
                  color: textColor,
                  borderRadius: `${borderRadius}px`,
                }}
              />
            ) : (
              <input
                type={field.type}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-4 py-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: textColor,
                  color: textColor,
                  borderRadius: `${borderRadius}px`,
                }}
              />
            )}
          </div>
        );
      })}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-lg font-bold uppercase transition hover:opacity-90 disabled:opacity-50 border-2"
          style={{
            backgroundColor: "transparent",
            color: "#ffffff",
            borderColor: "#ffffff",
            borderRadius: `${borderRadius}px`,
          }}
         >
          {submitting
            ? "ENVIANDO..."
            : profile.contactform?.buttonText || "ENVIAR MENSAGEM"}
        </button>

        {profile.contactform?.termsOfUse && (
        <div className="mt-4 p-4 rounded-lg">
          <p className="text-xs leading-relaxed" style={{ color: "#ffffff" }}>
            {profile.contactform.termsOfUse}
          </p>
        </div>
     )}
    </form>
  );
}