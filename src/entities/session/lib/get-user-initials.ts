export function getUserInitials(label: string) {
  const source = label.includes("@") ? (label.split("@")[0] ?? label) : label;
  const [first, second] = source
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (!first) return "?";
  if (!second) return first.slice(0, 2).toUpperCase();

  return `${first[0]}${second[0]}`.toUpperCase();
}
