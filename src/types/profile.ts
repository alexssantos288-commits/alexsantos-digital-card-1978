// ============================================
// INTERFACES AUXILIARES
// ============================================

export interface Theme {
  backgroundType?: string;
  itemColor?: string;
  textColor?: string;
  opacity?: string;
  borderRadius?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  selectedGradient?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  blur?: string;
}

export interface PixConfig {
  enabled: boolean;
  pixType: "telefone" | "email" | "cpf" | "cnpj" | "chave-aleatoria";
  pixKey: string;
  beneficiaryName: string;
  city: string;
  amount?: number;
  description?: string;
}

export interface Link {
  id: string;
  type: "custom" | "email" | "phone" | "whatsapp" | "address" | "website" | "instagram" | "facebook" | "linkedin" | "twitter" | "youtube" | "pix" | "catalog" | "form";
  title: string;
  url: string;
  icon?: string;
  showIconOnly?: boolean;
  visible: boolean;
  order: number;
  hidden?: boolean;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  link?: string;
  order: number;
  hidden?: boolean;
  buttonText?: string;
  buttonLinkType?: "whatsapp" | "custom" | "pix";
  showImageAbove?: boolean;
  whatsappMessage?: string;
}

export interface ContactFormField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  required: boolean;
  enabled: boolean;
}

export interface ContactForm {
  enabled: boolean;
  title: string;
  termsOfUse?: string;
  buttonText: string;
  successMessage: string;
  fields: ContactFormField[];
}

export interface FormSubmission {
  id: string;
  profile_id: string;
  name: string;
  phone?: string;
  email: string;
  message: string;
  created_at: string;
}


export interface ContactSave {
  id: string;
  profile_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================
// INTERFACE PRINCIPAL
// ============================================

export interface Profile {
  user_id: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  
  
  // Contatos
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  
  // Redes Sociais
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  google_reviews?: string;
  spotify?: string;
  
  // Configurações de Tema
  theme?: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundType?: string;
    gradientColor1?: string;
    gradientColor2?: string;
    selectedGradient?: string;
    blur?: string;
    opacity?: string;
    textColor?: string;
    itemColor?: string;
    borderRadius?: string;
  };
  
  // Links e Catálogo
  links?: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string;
  }>;
  
  catalog?: Array<{
    id: string;
    name: string;
    price: string;
    description?: string;
    image?: string;
  }>;
  
  // PIX - Colunas separadas (para compatibilidade)
  pix_enabled?: boolean;
  pix_key?: string;
  pix_type?: string;
  
  // PIX - Objeto completo (formato novo)
  pix?: {
    enabled?: boolean;
    pixType?: string;
    pixKey?: string;
    beneficiaryName?: string;
    city?: string;
    amount?: number;
    description?: string;
    
  };
  
  // Formulário de Contato
  contactform?: ContactForm;
  
  // Ordem e Visibilidade dos Contatos
  contact_order?: string[];
  contact_active?: Record<string, boolean>;
  contact_icon_only?: Record<string, boolean>;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}