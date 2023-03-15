import OpenAiBlockLauncher from './OpenAiBlockLauncher.vue'

export default function openAiPlugin() {
  return { slots: { BlockLauncher: OpenAiBlockLauncher } }
}