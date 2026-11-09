export interface Perfil {
  readonly id: string;
  auth_user_id: string;
  nome: string;
  apelido: string | null;
  telefone: string | null;
  idioma: string;
  tema_preferido: 'dark' | 'light';
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
