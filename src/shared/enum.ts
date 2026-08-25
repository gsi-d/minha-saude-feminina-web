export enum enumTipoUsuario {
  Adolescente = "Adolescente",
  Gestante = "Gestante",
  Tentante = "Tentante",
  Menopausa = "Menopausa",
  NaoDefinido = "NaoDefinido",
  Administrador = "Administrador",
}

export const tiposUsuarioPublico = [
  enumTipoUsuario.Adolescente,
  enumTipoUsuario.Gestante,
  enumTipoUsuario.Tentante,
  enumTipoUsuario.Menopausa,
] as const;

export type TipoUsuarioPublico = (typeof tiposUsuarioPublico)[number];

export function isTipoUsuarioPublico(
  value: unknown,
): value is TipoUsuarioPublico {
  return tiposUsuarioPublico.some((tipoUsuario) => tipoUsuario === value);
}

export function toTipoUsuarioPublico(
  value: unknown,
): TipoUsuarioPublico | null {
  return isTipoUsuarioPublico(value) ? value : null;
}
