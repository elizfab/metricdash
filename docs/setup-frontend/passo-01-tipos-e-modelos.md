# Passo 01 — Tipos e Modelos

Criar em `src/app/core/models/` interfaces TS espelhando as tabelas do banco (ver `public/assets/database/schema.sql`).

## Arquivos

| Arquivo | Interface | Origem |
| ------- | --------- | ------ |
| `perfil.model.ts` | `Perfil` | `perfis` |
| `dominio.model.ts` | `Dominio` | `dominios` |
| `categoria-despesa.model.ts` | `CategoriaDespesa` | `categorias_despesa` |
| `forma-pagamento.model.ts` | `FormaPagamento` | `formas_pagamento` |
| `hotel.model.ts` | `Hotel` | `hoteis` |
| `status-viagem.model.ts` | `StatusViagem` | `status_viagem` |
| `viagem.model.ts` | `Viagem` (+ `ViagemResumo` da view) | `viagens` + `vw_custo_viagem` |
| `hospedagem.model.ts` | `Hospedagem` | `hospedagens` |
| `lancamento.model.ts` | `Lancamento` | `lancamentos` |
| `configuracao.model.ts` | `Configuracao` | `configuracoes` |
| `paginacao.model.ts` | `Pagina<T>` `{ dados, total, pagina, tamanhoPagina }` | contrato da API |
| `relatorio.model.ts` | `ResumoDashboard`, `ResumoMensalCategoria`, `ResumoMensal`, `CustoViagem` | views `vw_*` |

## Convenções

- Datas como `string` (`YYYY-MM-DD`); timestamps `string` ISO.
- Valores monetários: `*_centavos: number` (integer). Conversão para exibição só em pipes.
- Campos calculados (`dias`, `diarias`, `valor_total_centavos`, `mes`, `ano`) são `readonly` na interface — vêm do banco.
- Filtros: `FiltroLancamentos { ano?, mes?, categoriaId?, viagemId?, dominioId?, busca? }` em `core/types/`.

## Exemplo

```ts
export interface Lancamento {
  readonly id: string;
  dominio_id: string;
  categoria_id: string;
  forma_pagamento_id: string | null;
  viagem_id: string | null;
  hotel_id: string | null;
  descricao: string;
  data_despesa: string;
  quantidade: number;
  valor_unitario_centavos: number;
  readonly valor_total_centavos: number;
  origem: string | null;
  destino: string | null;
  observacoes: string | null;
  readonly mes: number;
  readonly ano: number;
}
```

## Validação

- `npm run build` compila; `npm run lint` sem erros.
- Um spec por model não é necessário (são interfaces); validar via uso nos services.
