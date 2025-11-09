export default function classNames(
  cls: string,
  mods?: Record<string, unknown> | string | (string | false | undefined | null)[],
  additional: (string | false | undefined | null)[] = []
): string {
  const modClasses =
    mods && typeof mods === 'object' && !Array.isArray(mods)
      ? Object.entries(mods)
          .filter(([, value]) => Boolean(value))
          .map(([className]) => className)
      : typeof mods === 'string'
      ? [mods]
      : Array.isArray(mods)
      ? mods.filter(Boolean)
      : [];

  const additionalClasses = Array.isArray(additional)
    ? additional.filter(Boolean)
    : [];

  return [cls, ...modClasses, ...additionalClasses].join(' ');
}
