export default function (text) {
  if (!text.match(/^.*(vimeo|youtube|youtu).*/)) {
    return;
  }

  return {
    component: "CmsMediaVideo",
    title: "Video",
    props: {
      url: text
    }
  };
}