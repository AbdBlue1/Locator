import { Coffee } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 border-b bg-background flex items-center px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Coffee className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground" data-testid="text-app-title">
            Pret A Manger
          </h1>
          <p className="text-xs text-muted-foreground">UK Branch Finder</p>
        </div>
      </div>
    </header>
  );
}
