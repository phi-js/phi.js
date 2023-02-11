import call from './functions/call'
import emit from './functions/emit'

export default {
  functions: [
    {
      name: 'story',
      title: 'Story',
      children: [
        call,
        emit,
      ],
    },
  ],
}