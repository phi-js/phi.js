import { provide } from 'vue'

export default function provideStorySettings(settings) {
  return provide('$_cms_story_settings', settings)
}