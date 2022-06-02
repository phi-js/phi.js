import { inject } from 'vue'

export default function useStorySettings() {
  const injectedSettings = inject('$_cms_story_settings', {})

  const defaultSettings = {
    uploads: {
      assets: undefined, // File uploader target URL.
      user: undefined, // File uploader target URL
    },
  }

  const settings = Object.assign({}, defaultSettings, injectedSettings)

  return settings
}