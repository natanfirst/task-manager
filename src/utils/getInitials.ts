export function getInitials(name: string) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part[0]);
  return initials.join("").toUpperCase();
}
