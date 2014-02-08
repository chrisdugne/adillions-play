---------------------------------------------------------------------
-- nb tickets/player

select player.user_name, player.email, player.lang, r2.nb as nb from player, (select player_uid, count(lottery_ticket.*) as nb from lottery_ticket group by player_uid) as r2 where r2.player_uid = player.uid order by nb desc

---------------------------------------------------------------------
-- all tickets for a player

select creation_date, numbers, lottery_uid from lottery_ticket where player_uid = '1439f3332e9823f92b0' order by creation_date desc

-- tim free 			14293c48533c0d12bb6
-- benoit 				143c549936a1c5e844a
-- asensio F. = KuddoH.	14387333f7729c5f0d0
-- Marchand E.			143a1a597b7b9c4bc58
-- Marchant M.			1439f3332e9823f92b0
	 

---------------------------------------------------------------------
-- look for player

select * from player where 	user_name 		like '%UCDHS3%' 
					 or 	first_name 		like '%UCDHS3%' 
					 or 	last_name 		like '%UCDHS3%' 
					 or 	email 			like '%UCDHS3%'
					 or		referrer_id		like '%UCDHS3%'
					 or		sponsor_code	like '%UCDHS3%'