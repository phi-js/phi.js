const pageFiles = import.meta.glob('../pages/**/*.vue');
const pages = [];
for (const path in pageFiles) {
  let name = path.slice(9, -4) // remove .vue
  pages.push({
    href: name,
    name,
    import: pageFiles[path]
  });
}

const modules = import.meta.glob('../packages/**/*.docs.vue');
const componentDocs = [];
for (const path in modules) {
  let parts = path.split('/');
  let name = parts[parts.length - 1].slice(0, -9) // remove .docs.vue
  componentDocs.push({
    href: 'component/' + name,
    name,
    path,
    dir: path.replace('../packages', '').split('/').slice(0,-1).join('/'),
    import: modules[path]
  });
}

export default [
  ...pages,
  ...componentDocs
]