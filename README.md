# PODOBESTIES

Strona internetowa oraz prywatny panel administracyjny gabinetu
PODOBESTIES – Podologia i Fizjoterapia w Krakowie.

## Uruchomienie lokalne

Wymagany jest Node.js.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Kontrola jakości

```bash
npm run lint
npm run build
```

Konfiguracja środowiska produkcyjnego, bazy danych i uwierzytelniania jest
przechowywana poza repozytorium w zmiennych środowiskowych hostingu.
