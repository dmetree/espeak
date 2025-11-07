export function hasDecimals(num: number): boolean {
  return num % 1 !== 0;
}

export function localStorageKeyExists(key: string): boolean {
  const value = localStorage.getItem(key);
  return value !== null;
}

export default function classNames(
  cls: string,
  mods: { [s: string]: unknown } | ArrayLike<unknown>,
  additional: any[]
) {
  return [
    cls,
    ...additional.filter(Boolean),
    ...Object.entries(mods)
      .filter(([, value]) => Boolean(value))
      .map(([className]) => className),
  ].join(" ");
}
