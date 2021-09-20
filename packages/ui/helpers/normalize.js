export default function (string) {
  if (!string.trim()) {
    return ''
  }

  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
