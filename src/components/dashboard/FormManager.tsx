"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, ContactForm, FormSubmission, ContactFormField } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Save, X, Edit, Download, AlertTriangle } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";

interface FormManagerProps {
  profile: Profile;
  onUpdate: () => void;
}

export function FormManager({ profile, onUpdate }: FormManagerProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const defaultFields: ContactFormField[] = [
    {
      id: "name",
      label: "Nome",
      type: "text",
      placeholder: "Seu nome completo",
      required: true,
      enabled: true,
    },
    {
      id: "email",
      label: "E-mail",
      type: "email",
      placeholder: "seu@email.com",
      required: true,
      enabled: true,
    },
    {
      id: "phone",
      label: "Telefone",
      type: "tel",
      placeholder: "(00) 00000-0000",
      required: false,
      enabled: true,
    },
    {
      id: "message",
      label: "Mensagem",
      type: "textarea",
      placeholder: "Digite sua mensagem...",
      required: true,
      enabled: true,
    },
  ];

  const [formConfig, setFormConfig] = useState<ContactForm>({
    enabled: true,
    title: "Entre em Contato",
    termsOfUse: "",
    buttonText: "Enviar Mensagem",
    successMessage: "Obrigado! Sua mensagem foi enviada com sucesso.",
    fields: defaultFields,
  });

  useEffect(() => {
    loadSubmissions();
    if (profile.contactform) {
      setFormConfig({
        ...profile.contactform,
        fields: profile.contactform.fields || defaultFields,
      });
    }
  }, [profile]);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("profile_id", profile.user_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta resposta?")) return;

    try {
      const { error } = await supabase
        .from("form_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("✅ Resposta excluída com sucesso!");
      loadSubmissions();
    } catch (error: any) {
      alert("❌ Erro ao excluir: " + error.message);
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      alert("⚠️ Não há contatos para exportar!");
      return;
    }

    const headers = ["Nome", "E-mail", "Telefone", "Mensagem", "Data de Envio"];
    
    const rows = submissions.map(sub => [
      sub.name,
      sub.email,
      sub.phone || "",
      sub.message.replace(/\n/g, " ").replace(/"/g, '""'),
      new Date(sub.created_at).toLocaleString("pt-BR"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `contatos_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("✅ CSV exportado com sucesso!");
  };

  const toggleFieldRequired = (fieldId: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, required: !field.required } : field
      ),
    }));
  };

  const toggleFieldEnabled = (fieldId: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, enabled: !field.enabled } : field
      ),
    }));
  };

  const handleSaveConfig = async () => {
    try {
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Erro de autenticação: ${authError.message}`);
      }

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const contactformData = {
        enabled: Boolean(formConfig.enabled),
        title: String(formConfig.title || ""),
        termsOfUse: formConfig.termsOfUse ? String(formConfig.termsOfUse) : null,
        buttonText: String(formConfig.buttonText || ""),
        successMessage: String(formConfig.successMessage || ""),
        fields: Array.isArray(formConfig.fields) ? formConfig.fields.map(field => ({
          id: String(field.id),
          label: String(field.label),
          type: String(field.type),
          placeholder: String(field.placeholder || ""),
          required: Boolean(field.required),
          enabled: Boolean(field.enabled),
        })) : [],
      };

      const { data, error } = await supabase
        .from("profiles")
        .update({
          contactform: contactformData,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id)
        .select();

      if (error) throw error;

      alert("✅ Configurações do formulário salvas com sucesso!");
      setShowConfigModal(false);
      onUpdate();
    } catch (error: any) {
      alert(`❌ Erro ao salvar:\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          contactform: { ...formConfig, enabled: false },
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      alert("✅ Formulário excluído com sucesso!");
      setShowDeleteModal(false);
      setShowConfigModal(false);
      onUpdate();
    } catch (error: any) {
      alert("❌ Erro ao excluir: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " às " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Card>
        <CardHeader>
          
        </CardHeader>
        <CardContent className="space-y-6">
          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Gerencie as respostas recebidas através do formulário de contato do seu perfil
            </p>
            <div className="flex gap-2">
              <StandardButton
                onClick={exportToCSV}
                icon={Download}
                text="EXPORTAR CSV"
                color="#22c55e"
                disabled={submissions.length === 0}
                fullWidth={false}
              />
              <StandardButton
                onClick={() => setShowConfigModal(true)}
                icon={Edit}
                text="EDITAR FORMULÁRIO"
                color="#f97316"
                fullWidth={false}
              />
            </div>
          </div>

          {/* TABELA DE RESPOSTAS */}
          {submissions.length > 0 ? (
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-black/30 border-b border-white/10">
                  <tr>
                    <th className="text-center p-3 text-xs text-gray-400 font-normal uppercase w-20">
                      Ações
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Nome
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Telefone
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      E-mail
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Mensagem
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Data de Envio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => deleteSubmission(submission.id)}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition"
                            title="Excluir"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-white text-sm">{submission.name}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-400 text-sm">{submission.phone || "-"}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-400 text-sm">{submission.email}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-400 text-sm line-clamp-2">
                          {submission.message}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-400 text-sm whitespace-nowrap">
                          {formatDate(submission.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 border border-white/10 rounded-lg bg-black/20">
              <p className="text-gray-500 text-lg font-bold mb-2">Nenhum contato registrado</p>
              <p className="text-gray-400 text-sm">
                Quando alguém preencher seu formulário, as respostas aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL DE CONFIGURAÇÃO */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-[#0a0a0a] rounded-2xl border  max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase">
                  EDITAR <span >FORMULÁRIO</span>
                </h2>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              <div className="space-y-4">
                {/* ATIVAR/DESATIVAR - COR LARANJA */}
                <div className="flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      id="formEnabled"
                      checked={formConfig.enabled}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="formEnabled"
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`w-11 h-6 rounded-full transition relative ${
                        formConfig.enabled ? "bg-[#f97316]" : "bg-gray-600"
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          formConfig.enabled ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </div>
                      <span className="ml-3 text-white font-bold">
                        Exibir formulário de contato no perfil
                      </span>
                    </label>
                  </div>
                </div>

                {/* TÍTULO */}
                <div>
                  <Label className="text-white text-xs font-bold uppercase mb-2 block">
                    Título do Formulário
                  </Label>
                  <Input
                    value={formConfig.title}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Entre em Contato"
                    className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                  />
                </div>

                {/* TERMO DE USO */}
                <div>
                  <Label className="text-white text-xs font-bold uppercase mb-2 block">
                    Termo de Uso
                  </Label>
                  <textarea
                    value={formConfig.termsOfUse}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, termsOfUse: e.target.value }))}
                    placeholder="Ex: Ao enviar este formulário, você concorda com nossa política de privacidade..."
                    rows={4}
                    className="w-full px-3 py-2 bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 rounded-lg focus:outline-none focus:ring-2 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Este texto aparecerá abaixo do formulário
                  </p>
                </div>

                {/* CAMPOS DO FORMULÁRIO - CONFIGURÁVEIS */}
                <div className="p-6 bg-gradient-to-r from-[#f97316]/20 to-[#ea580c]/20 border-2  rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#ffffff] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">📋</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-base font-black uppercase mb-1">
                        Campos do Formulário
                      </h3>
                      <p className="text-gray-300 text-xs">
                        Configure quais campos estarão presentes e se são obrigatórios
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formConfig.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full ${field.required ? "bg-[#f97316]" : "bg-gray-500"}`}></div>
                          <span className="text-white text-sm font-bold">{field.label}</span>
                          <span className="text-xs text-gray-500">({field.type})</span>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* TOGGLE OBRIGATÓRIO */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Obrigatório:</span>
                            <button
                              onClick={() => toggleFieldRequired(field.id)}
                              className={`relative w-10 h-5 rounded-full transition ${
                                field.required ? "bg-[#f97316]" : "bg-gray-600"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                  field.required ? "translate-x-5" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </div>

                          {/* TOGGLE ATIVO */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Ativo:</span>
                            <button
                              onClick={() => toggleFieldEnabled(field.id)}
                              className={`relative w-10 h-5 rounded-full transition ${
                                field.enabled ? "bg-[#f97316]" : "bg-gray-600"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                  field.enabled ? "translate-x-5" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TEXTO DO BOTÃO */}
                <div>
                  <Label className="text-white text-xs font-bold uppercase mb-2 block">
                    Texto do Botão de Envio
                  </Label>
                  <Input
                    value={formConfig.buttonText}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Ex: Enviar Mensagem"
                    className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                  />
                </div>

                {/* MENSAGEM DE SUCESSO */}
                <div>
                  <Label className="text-white text-xs font-bold uppercase mb-2 block">
                    Mensagem de Sucesso
                  </Label>
                  <Input
                    value={formConfig.successMessage}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                    placeholder="Ex: Obrigado! Sua mensagem foi enviada com sucesso."
                    className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                  />
                </div>

                {/* BOTÃO EXCLUIR FORMULÁRIO */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500 text-red-500 font-bold uppercase rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Excluir Formulário
                  </button>
                </div>
              </div>

              {/* BOTÕES - AJUSTADOS */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold uppercase tracking-wide transition-all hover:scale-105 hover:opacity-90 active:scale-95 shadow-lg border-2 border-[#f97316] bg-transparent text-[#f97316]"
                >
                  <X size={18} />
                  <span className="text-xs">Cancelar</span>
                </button>
                <StandardButton
                  onClick={handleSaveConfig}
                  icon={Save}
                  text="SALVAR"
                  color="#f97316"
                  loading={loading}
                  fullWidth={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-6">
          <div className="bg-[#0a0a0a] rounded-2xl border-2 border-red-500 max-w-md w-full p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">EXCLUIR FORMULÁRIO?</h3>
              <p className="text-gray-400 mb-6">
                Tem certeza que deseja excluir o formulário de contato? Esta ação irá desativá-lo do seu perfil.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-500 bg-transparent text-gray-300 hover:bg-gray-500 hover:text-white font-bold uppercase transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteForm}
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase transition-all disabled:opacity-50"
                >
                  {loading ? "EXCLUINDO..." : "EXCLUIR"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}