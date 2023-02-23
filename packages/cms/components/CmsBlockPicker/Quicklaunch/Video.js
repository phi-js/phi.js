export default function (text) {
  if (!text.match(/^.*(vimeo|youtube|youtu).*/)) {
    return
  }

  return {
    name: 'MediaVideo',
    title: 'Video',
    icon: 'mdi:youtube',
    block: { props: { url: text } },
  }
}