# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

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

create sequence player_seq;




# --- !Downs

drop table if exists player cascade;

drop sequence if exists player_seq;

