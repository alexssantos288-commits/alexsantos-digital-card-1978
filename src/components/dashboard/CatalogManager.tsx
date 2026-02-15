"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, CatalogItem } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Save, Edit, X, Upload } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";

interface CatalogManagerProps {
  profile: Profile;
  onUpdate: () => void;
}

export function CatalogManager({ profile, onUpdate }: CatalogManagerProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [showSearchField, setShowSearchField] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // FORM DATA (STATE)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: [] as string[],
    buttonText: "Mais informações",
    buttonLinkType: "whatsapp",
    buttonLink: "",
    showImageAbove: true,
    whatsappMessage: "",
    pixKeyType: "cpf",
    pixBeneficiaryName: "",
    pixBeneficiaryCity: "",
  });

  useEffect(() => {
    if (profile?.catalog && Array.isArray(profile.catalog)) {
      setItems(
        profile.catalog.map((item: any) => ({
          ...item,
          hidden: item.hidden ?? false
        })) as CatalogItem[]
      );
    }
  }, [profile]);

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, "");
    return parseFloat(numbers) / 100;
  };

  const handlePriceChange = (value: string) => {
    setFormData(prev => ({ ...prev, price: formatCurrency(value) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `catalog-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
      alert("✅ Imagem carregada com sucesso!");
    } catch (error: any) {
      alert("❌ Erro ao fazer upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt("Digite a URL da imagem:");
    if (url) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedImageIndex === null) return;
    
    const newImages = [...formData.images];
    const draggedImage = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setDraggedImageIndex(null);
  };

  const openModal = (item?: CatalogItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: formatCurrency((item.price * 100).toString()),
        images: item.images || (item.image ? [item.image] : []),
        buttonText: (item as any).buttonText || "Mais informações",
        buttonLinkType: (item as any).buttonLinkType || "whatsapp",
        buttonLink: item.link || "",
        showImageAbove: (item as any).showImageAbove !== false,
        whatsappMessage: (item as any).whatsappMessage || "",
        pixKeyType: (item as any).pixKeyType || "cpf",
        pixBeneficiaryName: (item as any).pixBeneficiaryName || "",
        pixBeneficiaryCity: (item as any).pixBeneficiaryCity || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        images: [],
        buttonText: "Mais informações",
        buttonLinkType: "whatsapp",
        buttonLink: "",
        showImageAbove: true,
        whatsappMessage: "",
        pixKeyType: "cpf",
        pixBeneficiaryName: "",
        pixBeneficiaryCity: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const saveProduct = () => {
    const newItem: any = {
      id: editingItem?.id || `item-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseCurrency(formData.price),
      images: formData.images,
      image: formData.images[0] || "",
      link: formData.buttonLink,
      order: editingItem?.order || items.length,
      hidden: editingItem?.hidden ?? false,
      buttonText: formData.buttonText,
      buttonLinkType: formData.buttonLinkType,
      showImageAbove: formData.showImageAbove,
      whatsappMessage: formData.whatsappMessage,
      pixKeyType: formData.pixKeyType,
      pixBeneficiaryName: formData.pixBeneficiaryName,
      pixBeneficiaryCity: formData.pixBeneficiaryCity,
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setItems([...items, newItem]);
    }

    closeModal();
  };

  const toggleVisibility = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, hidden: !item.hidden } : item
    ));
  };

  const removeItem = (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          catalog: items.map((item, index) => ({
            ...item,
            order: index,
          })),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      alert("✅ Catálogo salvo com sucesso!");
      onUpdate();
    } catch (error: any) {
      alert("❌ Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          
        </CardHeader>
        <CardContent className="space-y-6">
          {/* DESCRIÇÃO E BOTÃO */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-3">
                Você também pode cadastrar catálogo de produtos! Este é o campo para alterar a ordem dos itens do seu catálogo. 
                Para adicionar um item clique em "Adicionar Produto". É possível alterar a ordem dos produtos apenas arrastando para a posição desejada.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showSearch"
                  checked={showSearchField}
                  onChange={(e) => setShowSearchField(e.target.checked)}
                  className="w-4 h-4 rounded border-[#a855f7] text-[#a855f7] focus:ring-[#a855f7]"
                />
                <label htmlFor="showSearch" className="text-sm text-gray-400">
                  Exibir campo de busca quando tiver 5 ou mais itens no catálogo
                </label>
              </div>
            </div>
            <StandardButton
              onClick={() => openModal()}
              icon={Plus}
              text="ADICIONAR PRODUTO"
              color="#a855f7"
              fullWidth={false}
            />
          </div>

          {/* TABELA */}
          {items.length > 0 && (
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-black/30 border-b border-white/10">
                  <tr>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Arraste para ordenar
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Nome
                    </th>
                    <th className="text-left p-3 text-xs text-gray-400 font-normal uppercase">
                      Preço
                    </th>
                    <th className="text-center p-3 text-xs text-gray-400 font-normal uppercase">
                      Ações
                    </th>
                    <th className="text-center p-3 text-xs text-gray-400 font-normal uppercase">
                      Ocultar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-3">
                        <GripVertical size={16} className="text-gray-500 cursor-move" />
                      </td>
                      <td className="p-3">
                        <span className="text-white text-sm">{item.name || "Sem nome"}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-400 text-sm">
                          {item.price > 0 ? formatCurrency((item.price * 100).toString()) : "R$ 0,00"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(item)}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                          >
                            <Edit size={14} className="text-[#a855f7]" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => toggleVisibility(item.id)}
                            className={`relative w-12 h-6 rounded-full transition ${
                              item.hidden ? "bg-gray-600" : "bg-[#a855f7]"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                item.hidden ? "left-1" : "left-7"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BOTÃO SALVAR */}
          <StandardButton
            onClick={handleSave}
            icon={Save}
            text="SALVAR"
            color="#a855f7"
            loading={loading}
          />
        </CardContent>
      </Card>
            {/* MODAL */}
            {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-[#0a0a0a] rounded-2xl border border-[#a855f7] max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase">
                  {editingItem ? "EDITAR" : "ADICIONAR"} <span className="text-[#a855f7]">PRODUTO</span>
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUNA ESQUERDA - FORMULÁRIO */}
                <div className="lg:col-span-2 space-y-4">
                  {/* NOME */}
                  <div>
                    <Label className="text-white text-xs font-bold uppercase mb-2 block">Nome</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome do produto"
                      className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                    />
                  </div>

                  {/* DESCRIÇÃO */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-white text-xs font-bold uppercase">Descrição</Label>
                      <span className="text-xs text-gray-500">
                        {formData.description.length}/1500
                      </span>
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Digite uma breve descrição do produto (se tiver)"
                      maxLength={1500}
                      rows={4}
                      className="w-full px-3 py-2 bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 rounded-lg focus:outline-none focus:ring-2 transition"
                    />
                  </div>

                  {/* PREÇO */}
                  <div>
                    <Label className="text-white text-xs font-bold uppercase mb-2 block">Preço</Label>
                    <div className="flex gap-2">
                      <select className="px-3 py-2 bg-black text-white border-white/10 focus:border-white/20 focus:ring-white/20 rounded-lg focus:outline-none focus:ring-2">
                        <option>Real (R$)</option>
                      </select>
                      <Input
                        value={formData.price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="0,00"
                        type="text"
                        className="flex-1 bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* TEXTO DO BOTÃO */}
                  <div>
                    <Label className="text-white text-xs font-bold uppercase mb-2 block">Texto do Botão</Label>
                    <Input
                      value={formData.buttonText}
                      onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Mais informações"
                      className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                    />
                  </div>

                  {/* TIPO DE LINK */}
                  <div>
                    <Label className="text-white text-xs font-bold uppercase mb-3 block">Tipo de Link para o Botão</Label>
                    <div className="space-y-2">
                      {[
                        { value: "whatsapp", label: "WhatsApp" },
                        { value: "custom", label: "Link customizado" },
                        { value: "pix", label: "Cobre com PIX" },
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="buttonLinkType"
                            value={option.value}
                            checked={formData.buttonLinkType === option.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, buttonLinkType: e.target.value }))}
                            className="w-4 h-4 text-[#a855f7] focus:ring-[#a855f7]"
                          />
                          <span className="text-white text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* CAMPOS CONDICIONAIS - WHATSAPP */}
                  {formData.buttonLinkType === "whatsapp" && (
                    <>
                      <div>
                        <Label className="text-white text-xs font-bold uppercase mb-2 block">WhatsApp para Contato (com DDD)</Label>
                        <p className="text-xs text-gray-400 mb-3">
                          Neste campo você deve preencher para qual WhatsApp seu cliente será direcionado ao clicar no botão.
                        </p>
                        <Input
                          value={formData.buttonLink}
                          onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                          placeholder="+55 00 00000-0000"
                          className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-xs font-bold uppercase mb-2 block">Mensagem Padrão para Contato no WhatsApp</Label>
                        <p className="text-xs text-gray-400 mb-3">
                          Neste campo você deve preencher a mensagem pré escrita que seu cliente irá enviar para o número cadastrado ao clicar no botão.
                        </p>
                        <Input
                          value={formData.whatsappMessage}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                          placeholder="Digite uma mensagem padrão para o WhatsApp"
                          className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                        />
                      </div>
                    </>
                  )}

                  {/* CAMPOS CONDICIONAIS - LINK CUSTOMIZADO */}
                  {formData.buttonLinkType === "custom" && (
                    <div>
                      <Label className="text-white text-xs font-bold uppercase mb-2 block">Link Customizado do Botão</Label>
                      <p className="text-xs text-gray-400 mb-3">
                        Neste campo você deve preencher com o link que abrirá ao clicar no botão.
                      </p>
                      <Input
                        value={formData.buttonLink}
                        onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                        placeholder="Digite uma URL"
                        className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                      />
                    </div>
                  )}

                  {/* CAMPOS CONDICIONAIS - PIX */}
                  {formData.buttonLinkType === "pix" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white text-xs font-bold uppercase mb-2 block">Tipo da Chave</Label>
                          <select
                            value={formData.pixKeyType}
                            onChange={(e) => setFormData(prev => ({ ...prev, pixKeyType: e.target.value }))}
                            className="w-full px-3 py-2 bg-black text-white border-white/10 focus:border-white/20 focus:ring-white/20 rounded-lg focus:outline-none focus:ring-2"
                          >
                            <option value="cpf">CPF</option>
                            <option value="cnpj">CNPJ</option>
                            <option value="email">E-mail</option>
                            <option value="phone">Telefone</option>
                            <option value="random">Chave Aleatória</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-white text-xs font-bold uppercase mb-2 block">Chave PIX</Label>
                          <Input
                            value={formData.buttonLink}
                            onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                            placeholder="Digite a chave PIX"
                            className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white text-xs font-bold uppercase mb-2 block">Nome do Beneficiário (até 25 letras)</Label>
                          <Input
                            value={formData.pixBeneficiaryName}
                            onChange={(e) => setFormData(prev => ({ ...prev, pixBeneficiaryName: e.target.value }))}
                            placeholder="Nome completo"
                            maxLength={25}
                            className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-xs font-bold uppercase mb-2 block">Cidade do Beneficiário (até 15 letras)</Label>
                          <Input
                            value={formData.pixBeneficiaryCity}
                            onChange={(e) => setFormData(prev => ({ ...prev, pixBeneficiaryCity: e.target.value }))}
                            placeholder="Cidade"
                            maxLength={15}
                            className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* IMAGENS */}
                  <div>
                    <Label className="text-white text-xs font-bold uppercase mb-2 block">Imagens do Produto</Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Você pode arrastar as imagens para ordenar da maneira que desejar
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="showImageAbove"
                        checked={formData.showImageAbove}
                        onChange={(e) => setFormData(prev => ({ ...prev, showImageAbove: e.target.checked }))}
                        className="w-4 h-4 rounded border-[#a855f7] text-[#a855f7] focus:ring-[#a855f7]"
                      />
                      <label htmlFor="showImageAbove" className="text-sm text-gray-400">
                        Exibir as imagens acima do título e descrição
                      </label>
                    </div>
                    
                    {/* BOTÕES ADICIONAR IMAGEM */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={addImageUrl}
                        className="flex-1 px-4 py-2 bg-transparent border-2 border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-white font-bold rounded-lg transition"
                      >
                        Adicionar URL
                      </button>
                      <label
                        htmlFor="image-upload"
                        className="flex-1 px-4 py-2 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-2 transition"
                      >
                        <Upload size={18} />
                        Upload de Imagem
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* LISTA DE IMAGENS COM DRAG AND DROP */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {formData.images.map((img, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            className="relative group cursor-move border-2 border-[#a855f7] rounded-lg overflow-hidden hover:border-[#9333ea] transition"
                          >
                            <img src={img} alt={`Imagem ${index + 1}`} className="w-full h-32 object-cover" />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                              <GripVertical className="text-white opacity-0 group-hover:opacity-100" size={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUNA DIREITA - PREVIEW */}
                <div className="lg:col-span-1">
                  <Label className="text-white text-xs font-bold uppercase mb-3 block">Preview do Produto</Label>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    {formData.images.length > 0 && formData.showImageAbove && (
                      <div className="space-y-2">
                        {formData.images.map((img, index) => (
                          <img key={index} src={img} alt={`Preview ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                    <h3 className="font-bold text-black">{formData.name || "Nome do Produto"}</h3>
                    <p className="text-sm text-gray-600">{formData.description || "Descrição do produto..."}</p>
                    <p className="text-lg font-bold text-black">{formData.price || "R$ 0,00"}</p>
                    <button className="w-full py-2 bg-green-500 text-white rounded-lg font-bold">
                      {formData.buttonText}
                    </button>
                    {formData.images.length > 0 && !formData.showImageAbove && (
                      <div className="space-y-2">
                        {formData.images.map((img, index) => (
                          <img key={index} src={img} alt={`Preview ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTÕES */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={closeModal}
                  className="px-8 py-4 rounded-2xl border-2 border-[#a855f7] bg-transparent text-[#a855f7] hover:bg-[#a855f7] hover:text-white font-bold uppercase transition-all"
                >
                  Cancelar
                </button>
                <StandardButton
                  onClick={saveProduct}
                  icon={Save}
                  text="SALVAR"
                  color="#a855f7"
                  fullWidth={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}