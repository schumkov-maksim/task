# Task Manager

Eine Nuxt 4 Webanwendung zur Verwaltung von Aufgaben mit PostgreSQL-Datenbank über Prisma ORM.

---

## Tech Stack

| Schicht | Technologie |
|---|---|
| Frontend | Nuxt 4, Vue 3, Pinia, Tailwind CSS |
| Backend | Nitro (Nuxt Server Engine) |
| Datenbank | PostgreSQL 16 (Docker) |
| ORM | Prisma 7 mit `@prisma/adapter-pg` |

---

## Projektstruktur

```
task/
├── app/
│   ├── components/
│   │   ├── Drawer.vue        # Seitenleiste zum Erstellen einer neuen Aufgabe
│   │   ├── header.vue        # Navigationsleiste mit "Add Task"-Button
│   │   └── TaskList.vue      # Liste aller Aufgaben
│   ├── store/
│   │   └── store.ts          # Pinia Store – Zustand & API-Aufrufe
│   ├── types/
│   │   ├── Task.ts           # TypeScript-Typ für Aufgaben
│   │   └── User.ts           # TypeScript-Typ für Benutzer
│   └── app.vue               # Einstiegspunkt – lädt Users & Tasks beim Start
├── server/
│   ├── api/
│   │   ├── users.ts          # GET  /api/users  – alle Benutzer aus der DB
│   │   ├── tasks.get.ts      # GET  /api/tasks  – alle Aufgaben aus der DB
│   │   └── tasks.post.ts     # POST /api/tasks  – neue Aufgabe in DB speichern
│   └── utils/
│       └── prisma.ts         # Prisma Client Singleton (wird von allen APIs genutzt)
├── prisma/
│   ├── schema.prisma         # Datenbankschema (User, Task)
│   ├── seed.ts               # Seed-Script – legt Beispiel-Benutzer an
│   └── migrations/           # SQL-Migrationsdateien (automatisch generiert)
├── lib/
│   └── generated/prisma/     # Generierter Prisma Client (nicht manuell bearbeiten)
├── docker-compose.yml        # PostgreSQL-Datenbankcontainer
├── prisma.config.ts          # Prisma-Konfiguration (Datenbankverbindung)
└── .env                      # Umgebungsvariablen (DATABASE_URL)
```

---

## Datenbankschema

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  tasks Task[]
}

model Task {
  id          String  @id @default(uuid())
  title       String
  description String
  userId      String?
  user        User?   @relation(fields: [userId], references: [id])
}
```

Ein **User** kann mehrere **Tasks** haben. Die Verbindung erfolgt über `userId` (optional – eine Aufgabe kann auch ohne Benutzer erstellt werden).

---

## Datenfluss

### Aufgabe erstellen

```
Benutzer füllt Drawer aus
  → "Add Task" geklickt
  → store.addTask(description, userName)
  → POST /api/tasks  { title, description, userName }
  → Server sucht User anhand des Namens in der DB
  → prisma.task.create(...)
  → store.fetchTasks() aktualisiert die Liste
  → TaskList zeigt neue Aufgabe
```

### Daten laden (beim Seitenstart)

```
app.vue wird geladen
  → store.fetchUsers()  →  GET /api/users  →  prisma.user.findMany()
  → store.fetchTasks()  →  GET /api/tasks  →  prisma.task.findMany({ include: { user: true } })
  → Pinia Store speichert die Daten reaktiv
  → Komponenten rendern automatisch
```

---

## Erster Start

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Datenbank starten

```bash
docker compose up -d
```

### 3. Datenbank initialisieren (nur beim ersten Mal)

```bash
# Tabellen erstellen
npx prisma migrate dev

# Beispiel-Benutzer anlegen (John Doe, Jane Smith)
npm run db:seed
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die App ist erreichbar unter **http://localhost:3000**

---

## Nützliche Befehle

| Befehl | Beschreibung |
|---|---|
| `docker compose up -d` | PostgreSQL starten |
| `docker compose down` | PostgreSQL stoppen |
| `npm run dev` | Nuxt Entwicklungsserver starten |
| `npx prisma studio` | Datenbank-Browser öffnen (http://localhost:5555) |
| `npx prisma migrate dev` | Schema-Änderungen in die DB übernehmen |
| `npx prisma generate` | Prisma Client neu generieren |
| `npm run db:seed` | Beispiel-Benutzer in die DB eintragen |

---

## API-Endpunkte

### `GET /api/users`
Gibt alle Benutzer aus der Datenbank zurück.

```json
[
  { "id": "seed-user-1", "name": "John Doe" },
  { "id": "seed-user-2", "name": "Jane Smith" }
]
```

### `GET /api/tasks`
Gibt alle Aufgaben inkl. zugewiesenem Benutzer zurück.

```json
[
  {
    "id": "abc123",
    "title": "Design überarbeiten",
    "description": "Neue Farbpalette einbauen",
    "userId": "seed-user-1",
    "user": { "id": "seed-user-1", "name": "John Doe" }
  }
]
```

### `POST /api/tasks`
Erstellt eine neue Aufgabe in der Datenbank.

**Request Body:**
```json
{
  "title": "Neue Aufgabe",
  "description": "Beschreibung der Aufgabe",
  "userName": "John Doe"
}
```

---

## Umgebungsvariablen (`.env`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
```

| Variable | Beschreibung |
|---|---|
| `DATABASE_URL` | Verbindungs-URL zur PostgreSQL-Datenbank |
