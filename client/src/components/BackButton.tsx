import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to = "/dashboard", label = "Back" }: BackButtonProps) {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLocation(to)}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}