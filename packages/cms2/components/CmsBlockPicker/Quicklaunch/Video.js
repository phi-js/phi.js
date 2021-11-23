export default function (text) {
  if (!text.match(/^.*(vimeo|youtube|youtu).*/)) {
    return
  }

  return {
    component: 'MediaVideo',
    title: 'Video',
    props: { url: text },
  }
}