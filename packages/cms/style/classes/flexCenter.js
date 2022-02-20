export default {
  name: 'flexCenter',
  text: 'Centered flex',
  subtext: 'Content will be centered horizontally and vertically',
  css: `
    .flexCenter {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,

  // If present, only blocks of this type will be allowed to use it
  allow: ['LayoutRow'],
}