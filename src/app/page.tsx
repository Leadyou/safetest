import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            SafeTest v0.1
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            SafeTest
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nowa aplikacja w trakcie budowy
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Witaj w SafeTest</CardTitle>
              <CardDescription>
                Aplikacja zostala pomyslnie wdrozona
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ten projekt jest gotowy do rozwoju. Mozesz teraz:
              </p>
              <ul className="text-sm space-y-2">
                <li>• Edytowac <code className="bg-muted px-1 rounded">src/app/page.tsx</code></li>
                <li>• Dodawac komponenty Shadcn UI</li>
                <li>• Budowac funkcjonalnosci</li>
              </ul>
              <Button className="w-full">
                Rozpocznij
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
