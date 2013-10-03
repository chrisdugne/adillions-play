# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table draw (
  uid                       varchar(255) not null,
  date                      bigint,
  max_picks                 integer,
  max_numbers               integer,
  ratio                     float,
  additional_icons          TEXT,
  result                    varchar(255),
  constraint pk_draw primary key (uid))
;

create table draw_ticket (
  uid                       varchar(255) not null,
  numbers                   varchar(255),
  draw_uid                  varchar(255),
  player_uid                varchar(255),
  constraint pk_draw_ticket primary key (uid))
;

create table lottery (
  uid                       varchar(255) not null,
  date                      bigint,
  constraint pk_lottery primary key (uid))
;

create table lottery_ticket (
  uid                       varchar(255) not null,
  number                    varchar(255),
  lottery_uid               varchar(255),
  player_uid                varchar(255),
  constraint pk_lottery_ticket primary key (uid))
;

create table player (
  uid                       varchar(255) not null,
  facebook_id               varchar(255),
  user_name                 varchar(255),
  email                     varchar(255),
  first_name                varchar(255),
  last_name                 varchar(255),
  referrer_id               varchar(255),
  birth_date                varchar(255),
  current_points            integer,
  idle_points               integer,
  total_points              integer,
  auth_token                varchar(255),
  secret                    varchar(255),
  creation_date             bigint,
  constraint pk_player primary key (uid))
;

create sequence draw_seq;

create sequence draw_ticket_seq;

create sequence lottery_seq;

create sequence lottery_ticket_seq;

create sequence player_seq;

alter table draw_ticket add constraint fk_draw_ticket_draw_1 foreign key (draw_uid) references draw (uid);
create index ix_draw_ticket_draw_1 on draw_ticket (draw_uid);
alter table draw_ticket add constraint fk_draw_ticket_player_2 foreign key (player_uid) references player (uid);
create index ix_draw_ticket_player_2 on draw_ticket (player_uid);
alter table lottery_ticket add constraint fk_lottery_ticket_lottery_3 foreign key (lottery_uid) references lottery (uid);
create index ix_lottery_ticket_lottery_3 on lottery_ticket (lottery_uid);
alter table lottery_ticket add constraint fk_lottery_ticket_player_4 foreign key (player_uid) references player (uid);
create index ix_lottery_ticket_player_4 on lottery_ticket (player_uid);



# --- !Downs

drop table if exists draw cascade;

drop table if exists draw_ticket cascade;

drop table if exists lottery cascade;

drop table if exists lottery_ticket cascade;

drop table if exists player cascade;

drop sequence if exists draw_seq;

drop sequence if exists draw_ticket_seq;

drop sequence if exists lottery_seq;

drop sequence if exists lottery_ticket_seq;

drop sequence if exists player_seq;

