import LyricsPlayer from '@/packages/ui/components/LyricsPlayer/LyricsPlayer.vue'

export default {
  tags: ['video'],

  name: 'LyricsPlayer',
  title: 'Subtitles',
  icon: 'mdi:subtitles',

  block: {
    component: LyricsPlayer,
    props: {
      lyrics: {
        lines: []
      }
    }
  },

  emits: [
    {
      event: 'wordEnter',
      text: 'A word is highlighted'
    }
  ]
}