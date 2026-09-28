import { getCurrentYear } from "@/shared/lib/dayjs";
import { Container } from "@/shared/ui/container";

export function Footer() {
  return (
    <footer className="py-4 bg-primary">
      <Container className="flex items-center justify-end ">
        <span className="text-sm text-primary-foreground">
          Copyright Tarih Education {getCurrentYear()}
        </span>
      </Container>
    </footer>
  );
}
