# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table lottery (
  uid                       varchar(255) not null,
  date                      bigint,
  max_picks                 integer,
  max_numbers               integer,
  nb_players                integer,
  tool_players              integer,
  min_price                 integer,
  max_price                 integer,
  cpm                       float,
  charity                   float,
  theme                     TEXT,
  result                    varchar(255),
  final_price               float,
  prizes                    varchar(255),
  rate_usdto_eur            float,
  last_update               timestamp not null,
  constraint pk_lottery primary key (uid))
;

create table lottery_ticket (
  uid                       varchar(255) not null,
  numbers                   varchar(255),
  lottery_uid               varchar(255),
  price                     float,
  status                    integer,
  player_uid                varchar(255),
  creation_date             bigint,
  constraint pk_lottery_ticket primary key (uid))
;

create table player (
  uid                       varchar(255) not null,
  facebook_id               varchar(255),
  twitter_id                varchar(255),
  twitter_name              varchar(255),
  lang                      varchar(255),
  user_name                 varchar(255),
  email                     varchar(255),
  first_name                varchar(255),
  last_name                 varchar(255),
  birth_date                varchar(255),
  accept_emails             boolean,
  current_points            integer,
  idle_points               integer,
  total_points              integer,
  extra_tickets             integer,
  available_tickets         integer,
  played_bonus_tickets      integer,
  total_played_tickets      integer,
  total_paid_tickets        integer,
  sponsor_code              varchar(255),
  referrer_id               varchar(255),
  gift_to_referrer          boolean,
  current_lottery_uid       varchar(255),
  has_post_on_facebook      boolean,
  has_tweet                 boolean,
  has_tweet_an_invite       boolean,
  has_invited_on_facebook   boolean,
  is_facebook_fan           boolean,
  is_twitter_fan            boolean,
  auth_token                varchar(255),
  secret                    varchar(255),
  creation_date             bigint,
  status                    integer,
  last_update               timestamp not null,
  constraint pk_player primary key (uid))
;

create table raffle (
  uid                       varchar(255) not null,
  date                      bigint,
  last_update               timestamp not null,
  constraint pk_raffle primary key (uid))
;

create table raffle_ticket (
  uid                       varchar(255) not null,
  number                    varchar(255),
  raffle_uid                varchar(255),
  player_uid                varchar(255),
  constraint pk_raffle_ticket primary key (uid))
;

create sequence lottery_seq;

create sequence lottery_ticket_seq;

create sequence player_seq;

create sequence raffle_seq;

create sequence raffle_ticket_seq;

alter table lottery_ticket add constraint fk_lottery_ticket_lottery_1 foreign key (lottery_uid) references lottery (uid);
create index ix_lottery_ticket_lottery_1 on lottery_ticket (lottery_uid);
alter table lottery_ticket add constraint fk_lottery_ticket_player_2 foreign key (player_uid) references player (uid);
create index ix_lottery_ticket_player_2 on lottery_ticket (player_uid);
alter table raffle_ticket add constraint fk_raffle_ticket_raffle_3 foreign key (raffle_uid) references raffle (uid);
create index ix_raffle_ticket_raffle_3 on raffle_ticket (raffle_uid);
alter table raffle_ticket add constraint fk_raffle_ticket_player_4 foreign key (player_uid) references player (uid);
create index ix_raffle_ticket_player_4 on raffle_ticket (player_uid);



# --- !Downs

drop table if exists lottery cascade;

drop table if exists lottery_ticket cascade;

drop table if exists player cascade;

drop table if exists raffle cascade;

drop table if exists raffle_ticket cascade;

drop sequence if exists lottery_seq;

drop sequence if exists lottery_ticket_seq;

drop sequence if exists player_seq;

drop sequence if exists raffle_seq;

drop sequence if exists raffle_ticket_seq;

