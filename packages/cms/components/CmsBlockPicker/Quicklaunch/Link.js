// import store from '@/app/store';
// import cmsApi from '@/modules/cms/api';

export default function (text) {
  if (!text.match(/^https?:\/\//)) {
    return
  }

  // Fetch the title (?)
  // let response = await cmsApi(store.state.httpClient).getUrlDetails(text);

  return {
    name: 'MediaLink',
    title: 'Link',
    icon: 'mdi:open-in-new',
    block: {
      props: {
        href: text,
        text: '',
        secondary: text,
      },
    },
  }
}