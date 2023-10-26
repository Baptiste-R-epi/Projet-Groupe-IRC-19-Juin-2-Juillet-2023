Ceci est un projet de groupe qui a été réalisé en deux semaines, du 19 juin au 10 juillet 2023.

L'objectif a été de pouvoir créer un chat. Plusieurs clients, via Socket.io, peuvent se connecter et communiquer entre eux.
Une personne nouvellement connecté averti les autres utilisateurs de sa venu. Seules les personnes connectés à un channel peuvent y écrire et en voir les messages. On ne peut être connecté qu'à un channel à la fois (comme demandé dans le sujet), et on est connecté au channel général par défaut.

Il existe plusiers commandes utilisable à l'aide d'un slash :
	/nick $name:	Permet à l'utilisateur de se renommer, si le nouveau nom n'est pas déjà pris.
					Envoie un message de confirmation/infirmation, et averti les autres utilisateurs.
	/create $name :	Crée un nouveau channel nommé et y connecte l'utilisateur. Averti les autres utilisateurs de sa création.
	/delete $name :	Supprime le channel donnée en paramètre. La suppression ne peut être effectué que par le créateur du channel.
					Si le créateur se déconnecte de l'IRC, le statut est donné à un utilisateur du channel. Le channel est supprimmé s'il n'y avait plus d'utilisateur.
	/join $name :	Rejoins le channel indiqué. Averti les utilisateurs de l'ancien channel du départ, et ceux du nouveau channel de l'arrivée de l'utilisateur.
	/leave :		Quitte le channel actuel (retourne sur le channel General). Comme join, averti les autre utilisateurs des changements de channel.
	/list $name :	Renvoie la liste des channels existants.
					Si un paramètre est renseignée, limite le résultat aux channels contenant le paramètre.
	/msg $name $msg:Envoi un message privé à un autre utilisateur.
	/users $name :	Renvoie la liste des utilisateurs existants.
					Si un paramètre est renseignée, renvoie les utilisateurs connectés au channel en paramètre.