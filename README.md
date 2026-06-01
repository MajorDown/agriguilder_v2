# Documentation technique

## Pages

### Application générale

| `/connexion` | `app/(application)/connexion/page.tsx` | Connexion utilisateur |
| `/dashboard` | `app/(application)/dashboard/page.tsx` | Tableau de bord |
| `/guilde` | `app/(application)/guilde/page.tsx` | Informations de guilde |
| `/options` | `app/(application)/options/page.tsx` | Options utilisateur |

### Espace membre

| `/declarer` | `app/(application)/(membre)/declarer/page.tsx` | Déclaration d’intervention |
| `/historique` | `app/(application)/(membre)/historique/page.tsx` | Historique membre |
| `/soldes` | `app/(application)/(membre)/soldes/page.tsx` | Soldes / points |

### Espace admin

| `/membres` | `app/(application)/(admin)/membres/page.tsx` | Gestion des membres |
| `/outils` | `app/(application)/(admin)/outils/page.tsx` | Gestion des outils |
| `/interventions` | `app/(application)/(admin)/interventions/page.tsx` | Gestion des interventions |
| `/contestations` | `app/(application)/(admin)/contestations/page.tsx` | Gestion des contestations |

### Espace dev

| `/gestion` | `app/(application)/(dev)/gestion/page.tsx` | Gestion globale de l’application |
| `/inscription` | `app/(application)/(dev)/inscription/page.tsx` | Inscription / création d’une guilde |

## Endpoints API

### Auth / session

| `POST` | `/api/session/login` | Connexion utilisateur |
| `POST` | `/api/session/logout` | Déconnexion utilisateur |
| `POST` | `/api/session/refresh` | Rafraîchissement de session |

### User

| `POST` | `/api/user/signup` | Création de compte |
| `GET` | `/api/user/get-context` | Récupération du contexte utilisateur |
| `PUT` | `/api/user/update/infos` | Mise à jour des informations utilisateur |
| `PUT` | `/api/user/update/email` | Mise à jour email |
| `PUT` | `/api/user/update/password` | Mise à jour mot de passe |

### Email auth code

| `POST` | `/api/email-auth-code/create` | Création d’un code email |
| `POST` | `/api/email-auth-code/check` | Vérification d’un code email |

### Guild

| `GET` | `/api/guild/get-all` | Liste des guildes, réservé dev |
| `POST` | `/api/guild/create` | Création d’une guilde |
| `GET` | `/api/guild/get-informations/[guildName]` | Informations d’une guilde |

### Dashboard

| `GET` | `/api/dashboard/admin/[guildName]` | Données dashboard admin |
| `GET` | `/api/dashboard/member/[guildName]` | Données dashboard membre |

### Members

| `GET` | `/api/member/get-by-guild/[guildName]` | Liste des membres d’une guilde |
| `POST` | `/api/member/create` | Création d’un membre |
| `POST` | `/api/member/check-by-email` | Vérification d’un membre par email |
| `DELETE` | `/api/member/delete` | Suppression / révocation d’un membre |

### Tools

| `GET` | `/api/tool/get-by-guild/[guildName]` | Liste des outils d’une guilde |
| `POST` | `/api/tool/create` | Création d’un outil |
| `PUT` | `/api/tool/update` | Mise à jour d’un outil |
| `PUT` | `/api/tool/update/status` | Activation / désactivation d’un outil |
| `DELETE` | `/api/tool/delete` | Suppression / révocation d’un outil |

### Rules

| `POST` | `/api/rule/create` | Création d’une règle |
| `PUT` | `/api/rule/update` | Mise à jour d’une règle |
| `DELETE` | `/api/rule/delete` | Suppression d’une règle |

### Interventions

| `POST` | `/api/intervention/create` | Création d’une intervention |
| `GET` | `/api/intervention/get-by-guild/[guildName]` | Liste des interventions d’une guilde |
| `GET` | `/api/intervention/get-by-member/[guildName]` | Liste des interventions du membre connecté |

### Contestations

| `POST` | `/api/contestation/create` | Création d’une contestation |
| `GET` | `/api/contestation/get-by-guild/[guildName]` | Liste des contestations d’une guilde |
| `PUT` | `/api/contestation/resolve` | Résolution d’une contestation |

### Adjustments

| `POST` | `/api/adjustment/create` | Création d’un ajustement de points |

### Bootstrap

| `GET` | `/api/bootstrap` | Initialisation / données de démarrage |
