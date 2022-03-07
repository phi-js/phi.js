import CMS from '../singleton'

export default function registerPlugin(plugin) {
  return CMS.plugin(plugin)
}