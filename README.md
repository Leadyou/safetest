# 🛡️ Panel Monitorowania Odporności Społecznej Gminy

System oceny gotowości mieszkańców na sytuacje kryzysowe (wojna, cyberatak, katastrofy naturalne).

## 🚀 Demo

**Live:** https://safetest-sable.vercel.app

## ✨ Funkcjonalności

- **Ankieta** - 5 pytań oceniających gotowość kryzysową mieszkańców (skala 1-5)
- **Dashboard** - Wykres radarowy 5 wymiarów odporności
- **Wskaźniki** - Procent ryzyka paniki vs. odporności
- **Prognozy** - Automatycznie generowane scenariusze zachowań
- **Symulacje** - Karty prognozujące reakcje na różne typy kryzysów
- **Baza w chmurze** - Odpowiedzi z wielu urządzeń agregowane w Supabase

## 🛠️ Konfiguracja

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/Leadyou/safetest.git
cd safetest
npm install
```

### 2. Konfiguracja Supabase

1. Utwórz konto na [supabase.com](https://supabase.com)
2. Stwórz nowy projekt
3. Przejdź do **SQL Editor** i wykonaj poniższy skrypt:

```sql
-- Tworzenie tabeli odpowiedzi ankiety
CREATE TABLE survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  municipality TEXT NOT NULL,
  communication INTEGER NOT NULL CHECK (communication >= 1 AND communication <= 5),
  resources INTEGER NOT NULL CHECK (resources >= 1 AND resources <= 5),
  knowledge INTEGER NOT NULL CHECK (knowledge >= 1 AND knowledge <= 5),
  social_capital INTEGER NOT NULL CHECK (social_capital >= 1 AND social_capital <= 5),
  competencies INTEGER NOT NULL CHECK (competencies >= 1 AND competencies <= 5)
);

-- Indeks na kolumnie municipality dla szybszego wyszukiwania
CREATE INDEX idx_survey_municipality ON survey_responses(municipality);

-- Włączenie Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Polityka: każdy może odczytywać
CREATE POLICY "Allow public read" ON survey_responses
  FOR SELECT USING (true);

-- Polityka: każdy może dodawać
CREATE POLICY "Allow public insert" ON survey_responses
  FOR INSERT WITH CHECK (true);
```

**Jeśli tabela już istnieje, dodaj kolumnę municipality:**

```sql
-- Dodanie kolumny municipality do istniejącej tabeli
ALTER TABLE survey_responses ADD COLUMN municipality TEXT;

-- Ustaw domyślną wartość dla istniejących rekordów
UPDATE survey_responses SET municipality = 'default' WHERE municipality IS NULL;

-- Ustaw kolumnę jako NOT NULL
ALTER TABLE survey_responses ALTER COLUMN municipality SET NOT NULL;

-- Dodaj indeks
CREATE INDEX idx_survey_municipality ON survey_responses(municipality);
```

4. Przejdź do **Settings > API** i skopiuj:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-klucz-anon
```

### 4. Uruchomienie lokalnie

```bash
npm run dev
```

Aplikacja będzie dostępna na http://localhost:3000

## 🌐 Deploy na Vercel

1. Zaimportuj repozytorium na [vercel.com](https://vercel.com)
2. Dodaj zmienne środowiskowe w **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

## 📊 Struktura danych

### Pytania ankiety (skala 1-5)

| # | Wymiar | Opis |
|---|--------|------|
| 1 | Komunikacja | Czy mieszkańcy wiedzą, gdzie szukać informacji bez internetu? |
| 2 | Zasoby | Jaki % mieszkańców posiada zapasy na 72h? |
| 3 | Wiedza | Czy znają lokalizację schronów i sygnały alarmowe? |
| 4 | Kapitał społeczny | Czy sąsiedzi będą współpracować? |
| 5 | Kompetencje | Poziom znajomości pierwszej pomocy |

### Obliczenia

- **Wskaźnik Odporności** = (średnia z 5 wymiarów / 5) × 100%
- **Ryzyko Paniki** = 100% - Wskaźnik Odporności

## 🔧 Technologie

- [Next.js 16](https://nextjs.org/) - Framework React
- [Tailwind CSS 4](https://tailwindcss.com/) - Stylowanie
- [Recharts](https://recharts.org/) - Wykresy (Spider/Radar)
- [Supabase](https://supabase.com/) - Baza danych PostgreSQL
- [Shadcn/ui](https://ui.shadcn.com/) - Komponenty UI

## 📄 Licencja

MIT
