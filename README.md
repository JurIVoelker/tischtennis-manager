# Dokumentation

Die Organisation der Tischtennisspiele in meinem Verein ist aktuell kompliziert und unübersichtlich. Abstimmungen erfolgen meist über WhatsApp, was aufwendig für die Mannschaftsführer ist und den Spielern oft unzureichende Informationen bietet.

Meine Lösung ist eine Web-App, die diese Probleme gezielt adressiert und den Planungsprozess vereinfacht.

# Wichtigste Features

**Nutzer-Verwaltung:** Neue Mitglieder können eingeladen, Rollen zugewiesen und bestehende Konten verwaltet werden

**Mannschaftsführer-Verwaltung:** Mannschaftsführer verwalten Aufstellungen, nominieren Ersatzspieler und organisieren ihr Team

**Spielverwaltung:** Spiele werden erstellt, geplant und verwaltet

**Abstimmungen der Nutzer:** Spieler können ihre Teilnahme an Spielen bestätigen oder absagen. Mannschaftsführer sehen die Ergebnisse und planen entsprechend

**Aufstellung auswählen:** Mannschaftsführer bestimmen die finale Teamaufstellung basierend auf den Abstimmungen

# Technologien

**Next.js 14 -** App Router, TypeScript

**Prisma -** ORM + SQLite

**shadcn -** UI-Komponenten

**HugeIcons -** Icon-Bibliothek

**NextAuth.js -** Authentifizierung

**Zod -** Validierung

**Bun -** Laufzeitumgebung und Paketmanager

# Architektur und Herausforderungen

## Verzeichnisstruktur

```markdown
tischtennis-manager
│── app/                      # Next.js App Router Pages
│ ├── [club]/[team]/          # Team-spezifische Seiten
│ ├── layout.tsx              # Hauptlayout
│ ├── page.tsx                # Startseite
│── prisma/                   # Prisma Schema & Migrationen
│── testing/                  # Testdaten für die Datenbank
│── components/               # Wiederverwendbare UI-Komponenten
│── middleware.ts             # Authentifizierung & Zugriffssteuerung
│── package.json              # Abhängigkeiten & Skripte
│── prisma/schema.prisma      # Datenbankmodell
│── next.config.mjs           # Next.js Konfiguration
│── tailwind.config.ts        # Tailwind-Konfiguration
│── tsconfig.json             # TypeScript Konfiguration
│── .github/workflows/        # CI/CD Workflows
```

## Sicherheit

Da viele Nutzer die App nur gelegentlich verwenden, ist ein einfacher Login-Prozess essenziell. Eine klassische Anmeldung mit Passwort könnte insbesondere für ältere, weniger technikaffine Nutzer eine Hürde darstellen. Daher setze ich auf Magic Links, sodass sich Nutzer ohne Passwort sicher und bequem anmelden können.

Mannschaftsführer können sich aktuell nur über Google Login authentifizieren.

Die Zugriffskontrolle auf verschiedene Seiten wird durch eine Middleware sichergestellt.

## Performance

Um eine hohe Performance zu gewährleisten, werden die meisten Komponenten serverseitig gerendert (SSR). Dies reduziert die Ladezeiten und verbessert die Nutzererfahrung.

# Installation und Setup


```bash
bun i
```
Abhängigkeiten installieren
> Weitere Informationen zur Installation von Bun: [Bun Docs](https://bun.sh/docs/installation)

```bash
touch prisma/db/database.db
```

Datenbankdatei erstellen, mit „touch“ oder manuell als Datei

```bash
bun db:migrate
```

Migration ausführen, um die Datenbankstruktur zu aktualisieren

```bash
bun db:setup-test-data
```

(Optional) Testdaten importieren

```bash
bun dev
```

Entwicklungsserver starten

# Deployment

```bash
### Build erstellen und starten
bun run build
bun start
```

Für das Deployment verwende ich self-hosted [Coolify](https://coolify.io/) auf einem VPS. Mit einem Webhook wird der Deploymentvorgang automatisch angestoßen.

# Umgebungsvariablen

```
# Required for setup
GOOGLE_APP_CLIENT_ID=yourId 
GOOGLE_APP_CLIENT_SECRET=yourSecret

# Optional for logging
TELEGRAM_BOT_TOKEN=yourToken
TELEGRAM_CHAT_ID=yourId

# Dev defaults
NEXTAUTH_SECRET=secret
SERVER_API_TOKEN=secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# App specific, required for deployment not relevant for local development
CLUB_SLUG=your-slug
CLUB_INITIAL_ADMIN_EMAIL=your-email
CLUB_NAME=Club Name
```

# Api

| Pfad                          | Methode | Berechtigungen       |
| ----------------------------- | ------- | -------------------- |
| /api/admin                    | POST    | admin                |
| /api/admin                    | PUT     | admin                |
| /api/admin                    | DELTE   | admin                |
| /api/invite-token             | GET     | leader:own           |
| /api/leader                   | PUT     | admin                |
| /api/leader                   | DELETE  | admin                |
| /api/leader                   | POST    | admin                |
| /api/lineup                   | PUT     | leader:own           |
| /api/match                    | PUT     | leader:own           |
| /api/match                    | POST    | leader:own           |
| /api/match                    | DELETE  | leader:own           |
| /api/player                   | POST    | leader:own           |
| /api/player                   | DELETE  | leader:own           |
| /api/player/position          | POST    | leader:own           |
| /api/protected/is-admin       | GET     | server               |
| /api/protected/is-team-leader | GET     | server               |
| /api/protected/team-auth      | GET     | server               |
| /api/team                     | POST    | admin                |
| /api/team                     | DELETE  | admin                |
| /api/teams/[clubSlug]         | GET     | -                    |
| /api/verify-auth              | GET     | leader:own           |
| /api/vote                     | POST    | user:own, leader:own |
