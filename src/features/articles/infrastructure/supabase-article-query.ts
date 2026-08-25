export const articleSelect = [
  "ID",
  "ID_CATEGORIA",
  "NM_TITULO",
  "DS_RESUMO",
  "DS_CORPO_TEXTO",
  "TP_PERFIL_ALVO",
  "DS_URL_IMAGEM",
  "DS_URL_FONTE",
  "TP_STATUS",
  "DT_CADASTRO",
  "DT_ATUALIZACAO",
  "CATEGORIA:TB_CATEGORIA!inner(ID,NM_CATEGORIA)",
].join(",");
