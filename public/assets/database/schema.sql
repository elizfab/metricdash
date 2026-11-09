-- ============================================================================
-- MetricDash — Schema inicial (PostgreSQL / Supabase)
-- Baseado em docs/setup-database/panel-finance-itau.md
-- Todos os elementos (tabelas, colunas, textos) em português.
--
-- Convenções:
--   * Valores monetários em CENTAVOS (bigint).
--   * Totais, diárias, dias, mês e ano calculados por colunas geradas.
--   * dominio_id permite expansão para outros nichos sem remodelar.
--   * Ano dos seeds é DINÂMICO: ano corrente do banco (extract(year from current_date)).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Autenticação — perfis de usuário (Supabase Auth gerencia auth.users)
-- ---------------------------------------------------------------------------
create table perfis (
    id              uuid primary key default gen_random_uuid(),
    auth_user_id    uuid not null unique,          -- referencia auth.users.id (Supabase Auth)
    nome            text not null,
    apelido         text,
    telefone        text,
    idioma          text not null default 'pt-BR',
    tema_preferido  text not null default 'dark' check (tema_preferido in ('dark', 'light')),
    ativo           boolean not null default true,
    criado_em       timestamptz not null default now(),
    atualizado_em   timestamptz not null default now()
);

comment on table perfis is 'Perfis de usuário vinculados ao Supabase Auth (auth.users). Um usuário = um perfil.';
comment on column perfis.auth_user_id is 'ID do usuário no Supabase Auth (auth.users.id).';
comment on column perfis.tema_preferido is 'Tema preferido do usuário: dark (padrão) ou light.';

-- ---------------------------------------------------------------------------
-- Nichos / domínios (base para expansão a outros contextos)
-- ---------------------------------------------------------------------------
create table dominios (
    id           uuid primary key default gen_random_uuid(),
    slug         text not null unique,
    nome         text not null,
    descricao    text,
    ativo        boolean not null default true,
    criado_em    timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

comment on table dominios is 'Nichos/domínios do MetricDash (ex.: deslocamento-trabalho). Base para expansão a outros contextos.';

-- ---------------------------------------------------------------------------
-- Categorias de despesa (por domínio)
-- ---------------------------------------------------------------------------
create table categorias_despesa (
    id           uuid primary key default gen_random_uuid(),
    dominio_id   uuid not null references dominios (id) on delete cascade,
    nome         text not null,
    slug         text not null,
    icone        text,
    ordem        int  not null default 0,
    ativo        boolean not null default true,
    criado_em    timestamptz not null default now(),
    atualizado_em timestamptz not null default now(),
    unique (dominio_id, slug)
);

comment on table categorias_despesa is 'Categorias de despesa configuráveis por domínio (tela de Configurações).';

-- ---------------------------------------------------------------------------
-- Formas de pagamento
-- ---------------------------------------------------------------------------
create table formas_pagamento (
    id           uuid primary key default gen_random_uuid(),
    nome         text not null unique,
    tipo         text, -- ex.: 'credito', 'debito', 'pix', 'dinheiro', 'boleto'
    ativo        boolean not null default true,
    criado_em    timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

comment on table formas_pagamento is 'Formas de pagamento configuráveis (tela de Configurações).';

-- ---------------------------------------------------------------------------
-- Hotéis (cadastro feito pelo frontend, consumido por hospedagens)
-- ---------------------------------------------------------------------------
create table hoteis (
    id              uuid primary key default gen_random_uuid(),
    nome            text not null,
    endereco        text,
    cidade          text,
    estado          text,
    telefone        text,
    site            text,
    hora_checkin    time,
    hora_checkout   time,
    classificacao   numeric(2, 1) check (classificacao between 0 and 5),
    ativo           boolean not null default true,
    criado_em       timestamptz not null default now(),
    atualizado_em   timestamptz not null default now()
);

comment on table hoteis is 'Cadastro de hotéis; consumido pelo frontend e referenciado pelas hospedagens.';

-- ---------------------------------------------------------------------------
-- Status de viagem (tabela de domínio — workflow evolutivo)
-- ---------------------------------------------------------------------------
create table status_viagem (
    id          int generated by default as identity primary key,
    slug        text not null unique,
    nome        text not null,
    descricao   text,
    ordem       int not null default 0,
    ativo       boolean not null default true,
    criado_em   timestamptz not null default now()
);

comment on table status_viagem is 'Status de viagem (planejada, em andamento, realizada, cancelada). Tabela para evolução do workflow.';

-- ---------------------------------------------------------------------------
-- Viagens
-- ---------------------------------------------------------------------------
create table viagens (
    id            uuid primary key default gen_random_uuid(),
    dominio_id    uuid not null references dominios (id) on delete restrict,
    identificador text not null,                 -- ex.: 'Viagem 1'
    origem        text,
    destino       text,
    data_inicio   date not null,
    data_fim      date not null,
    dias          int generated always as (data_fim - data_inicio) stored,
    observacoes   text,
    status_id     int not null references status_viagem (id),
    criado_em     timestamptz not null default now(),
    atualizado_em timestamptz not null default now(),
    check (data_fim >= data_inicio)
);

comment on table viagens is 'Viagens de trabalho; dias calculado automaticamente.';
create index idx_viagens_dominio on viagens (dominio_id);
create index idx_viagens_datas   on viagens (data_inicio, data_fim);
create index idx_viagens_status  on viagens (status_id);

-- ---------------------------------------------------------------------------
-- Hospedagens (N por viagem)
-- ---------------------------------------------------------------------------
create table hospedagens (
    id                     uuid primary key default gen_random_uuid(),
    viagem_id              uuid not null references viagens (id) on delete cascade,
    hotel_id               uuid references hoteis (id) on delete set null,
    check_in               date not null,
    check_out              date not null,
    diarias                int generated always as (check_out - check_in) stored,
    valor_diaria_centavos  bigint not null check (valor_diaria_centavos >= 0),
    valor_total_centavos   bigint generated always as
                           ((check_out - check_in) * valor_diaria_centavos)::bigint stored,
    observacoes            text,
    criado_em              timestamptz not null default now(),
    atualizado_em          timestamptz not null default now(),
    check (check_out > check_in)
);

comment on table hospedagens is 'Hospedagens vinculadas a viagens; diárias e total calculados.';
create index idx_hospedagens_viagem on hospedagens (viagem_id);

-- ---------------------------------------------------------------------------
-- Lançamentos financeiros (tabela central)
-- ---------------------------------------------------------------------------
create table lancamentos (
    id                      uuid primary key default gen_random_uuid(),
    dominio_id              uuid not null references dominios (id) on delete restrict,
    categoria_id            uuid not null references categorias_despesa (id) on delete restrict,
    forma_pagamento_id      uuid references formas_pagamento (id) on delete set null,
    viagem_id               uuid references viagens (id) on delete set null,
    hotel_id                uuid references hoteis (id) on delete set null,
    descricao               text not null,
    data_despesa            date not null,
    quantidade              numeric(10, 2) not null default 1 check (quantidade > 0),
    valor_unitario_centavos bigint not null check (valor_unitario_centavos >= 0),
    valor_total_centavos    bigint generated always as
                            (round(quantidade * valor_unitario_centavos))::bigint stored,
    origem                  text,
    destino                 text,
    observacoes             text,
    mes                     smallint generated always as (extract(month from data_despesa)::smallint) stored,
    ano                     smallint generated always as (extract(year  from data_despesa)::smallint) stored,
    criado_em               timestamptz not null default now(),
    atualizado_em           timestamptz not null default now()
);

comment on table lancamentos is 'Lançamentos de despesas; total, mês e ano calculados automaticamente.';
create index idx_lancamentos_data      on lancamentos (data_despesa);
create index idx_lancamentos_ano_mes   on lancamentos (ano, mes);
create index idx_lancamentos_categoria on lancamentos (categoria_id);
create index idx_lancamentos_viagem    on lancamentos (viagem_id);
create index idx_lancamentos_dominio   on lancamentos (dominio_id);
create index idx_lancamentos_busca     on lancamentos using gin (to_tsvector('portuguese', descricao));

-- ---------------------------------------------------------------------------
-- Configurações da aplicação (chave-valor)
-- ---------------------------------------------------------------------------
create table configuracoes (
    chave       text primary key,
    valor       text not null,
    descricao   text,
    atualizado_em timestamptz not null default now()
);

comment on table configuracoes is 'Configurações globais do sistema.';

-- ---------------------------------------------------------------------------
-- VIEWS — métricas e consolidadores consumidos pelos charts do frontend
-- ---------------------------------------------------------------------------

-- Custo consolidado por viagem (hospedagens + lançamentos vinculados)
create or replace view vw_custo_viagem as
select
    v.id                as viagem_id,
    v.identificador,
    v.origem,
    v.destino,
    v.data_inicio,
    v.data_fim,
    v.dias,
    coalesce(h.total_hospedagem, 0)::bigint      as total_hospedagem_centavos,
    coalesce(h.total_diarias, 0)::int            as total_diarias,
    coalesce(l.total_lancamentos, 0)::bigint     as total_lancamentos_centavos,
    coalesce(h.total_hospedagem, 0)
      + coalesce(l.total_lancamentos, 0)         as custo_total_viagem_centavos
from viagens v
left join lateral (
    select sum(hs.valor_total_centavos)      as total_hospedagem,
           sum(hs.diarias)                   as total_diarias
    from hospedagens hs
    where hs.viagem_id = v.id
) h on true
left join lateral (
    select sum(la.valor_total_centavos)      as total_lancamentos
    from lancamentos la
    where la.viagem_id = v.id
) l on true;

comment on view vw_custo_viagem is 'Custo consolidado por viagem: hospedagem + lançamentos, sem duplicar valores.';

-- Resumo mensal por categoria (alimenta dashboard, resumo mensal e charts)
create or replace view vw_resumo_mensal_categoria as
select
    l.ano,
    l.mes,
    c.nome               as categoria,
    c.slug               as categoria_slug,
    sum(l.valor_total_centavos)::bigint as total_centavos,
    count(*)             as quantidade_lancamentos
from lancamentos l
join categorias_despesa c on c.id = l.categoria_id
group by l.ano, l.mes, c.nome, c.slug;

comment on view vw_resumo_mensal_categoria is 'Totais por mês/ano/categoria — fonte única para cards, tabelas e gráficos.';

-- Resumo mensal geral (totais + viagens + diárias por mês)
create or replace view vw_resumo_mensal as
select
    l.ano,
    l.mes,
    sum(l.valor_total_centavos)::bigint as total_geral_centavos
from lancamentos l
group by l.ano, l.mes;

comment on view vw_resumo_mensal is 'Total geral de lançamentos por mês/ano.';

-- ============================================================================
-- SEEDS — dados iniciais (nicho: deslocamento-trabalho Jaú → São Paulo)
-- Ano DINÂMICO: ano corrente do banco (sem dependência de configuração manual).
-- ============================================================================

insert into status_viagem (slug, nome, descricao, ordem) values
    ('planejada',     'Planejada',     'Viagem planejada, ainda não realizada', 1),
    ('em-andamento',  'Em andamento',  'Viagem em curso',                        2),
    ('realizada',     'Realizada',     'Viagem concluída',                       3),
    ('cancelada',     'Cancelada',     'Viagem cancelada',                      4);

insert into dominios (slug, nome, descricao) values
    ('deslocamento-trabalho', 'Deslocamento para Trabalho',
     'Despesas de viagens de trabalho Jaú → São Paulo (regime híbrido).');

insert into configuracoes (chave, valor, descricao) values
    ('idioma_padrao', 'pt-BR', 'Idioma padrão da aplicação'),
    ('moeda_padrao',  'BRL',   'Moeda padrão dos valores'),
    ('seed_aplicado', 'true',  'Indica que os dados iniciais já foram inseridos (idempotência)');

insert into categorias_despesa (dominio_id, nome, slug, icone, ordem)
select d.id, c.nome, c.slug, c.icone, c.ordem
from dominios d
cross join (values
    ('Passagem de ônibus', 'passagem-onibus', 'car',         1),
    ('Metrô',              'metro',            'subway',      2),
    ('Transporte por app', 'transporte-app',   'car',         3),
    ('Ônibus urbano',      'onibus-urbano',    'bus',         4),
    ('Alimentação',        'alimentacao',      'coffee',      5),
    ('Estacionamento',     'estacionamento',   'environment', 6),
    ('Outras despesas',    'outras',           'more',        7)
) as c(nome, slug, icone, ordem)
where d.slug = 'deslocamento-trabalho';
-- Nota: 'Hospedagem' NÃO é categoria de lançamento — diárias ficam em `hospedagens`,
-- evitando dupla contagem nos totalizadores (regras 8 e 10 do documento).

insert into formas_pagamento (nome, tipo) values
    ('Pix',      'pix'),
    ('Crédito',  'credito'),
    ('Débito',   'debito'),
    ('Dinheiro', 'dinheiro');

-- Viagens de dezembro do ano corrente (dinâmico)
insert into viagens (dominio_id, identificador, origem, destino, data_inicio, data_fim, observacoes, status_id)
select d.id, v.identificador, 'Jaú', 'São Paulo',
       make_date(extract(year from current_date)::int, 12, v.dia_ida),
       make_date(extract(year from current_date)::int, 12, v.dia_volta),
       'Deslocamento de trabalho — regime híbrido',
       (select id from status_viagem where slug = 'realizada')
from dominios d
cross join (values
    ('Viagem 1', 2,  4),
    ('Viagem 2', 9,  11),
    ('Viagem 3', 17, 18)
) as v(identificador, dia_ida, dia_volta)
where d.slug = 'deslocamento-trabalho';

-- Hospedagens (diária R$ 155,00 = 15500 centavos) — hotel_id preenchido pelo frontend
insert into hospedagens (viagem_id, check_in, check_out, valor_diaria_centavos)
select t.id,
       make_date(extract(year from current_date)::int, 12, v.dia_in),
       make_date(extract(year from current_date)::int, 12, v.dia_out),
       15500
from viagens t
join dominios d on d.id = t.dominio_id
cross join (values
    ('Viagem 1', 2,  4),
    ('Viagem 2', 9,  11),
    ('Viagem 3', 17, 18)
) as v(identificador, dia_in, dia_out)
where d.slug = 'deslocamento-trabalho' and t.identificador = v.identificador;

-- Passagens de dezembro (ida R$ 85,40 / volta R$ 94,66)
insert into lancamentos
    (dominio_id, categoria_id, descricao, data_despesa, quantidade, valor_unitario_centavos, origem, destino)
select d.id, c.id, e.descricao,
       make_date(extract(year from current_date)::int, 12, e.dia),
       1, e.cents, 'Jaú', 'São Paulo'
from dominios d
join categorias_despesa c on c.dominio_id = d.id and c.slug = 'passagem-onibus'
cross join (values
    ('Passagem de ônibus — ida',   2,  8540),
    ('Passagem de ônibus — volta', 4,  9466)
) as e(descricao, dia, cents)
where d.slug = 'deslocamento-trabalho';

-- Totais esperados (verificação):
--   passagens: R$ 180,06 | hospedagem: R$ 775,00 | diárias: 5 | parcial: R$ 955,06
