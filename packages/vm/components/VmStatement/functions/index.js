import fetch from './fetch'
import fnsWindow from './window'
import fnsStory from '../../../../cms/plugins/navigation/functions/story'

export default {
  fetch,
  ...fnsWindow,
  ...fnsStory,
}