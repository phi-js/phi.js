import { getClient } from '@/packages/api'

export default class {
  constructor() {
    this.http = getClient('phi')
  }

  getBlocks(description, apiKey, temperature = 0.7) {
    return this.http.post('/api/1/openai/blocks', {
      apiKey,
      description,
      temperature,
    })
  }


  /*
  Generate text, via text-davinci-003

  POST http://phi.local/api/1/openai/text

  postData: {
    "apiKey": "please",
    "prompt": "2 paragraphs explaining the reason cats purr",
    "temperature": 0.7
  }
  */
  async generateText(postData) {
    const response = await this.http.post('/api/1/openai/text', postData)

    if (response?.choices?.[0]?.text) {
      return response.choices[0].text
    }

    if (response?.choices?.[0]?.message?.content) {
      return response.choices[0].message.content
    }

    return null
  }


  /*
  Generate an image via DALLE-2
  postData: {
    "apiKey": "please",
    "prompt": "a black kitten wrapped in a yellow blanket",
    "n": 1,
    "size": "512x512"
  }
  */
  async generateImage(postData) {
    const response = await this.http.post('/api/1/openai/image', postData)
    if (response?.data?.[0]?.url) {
      return response.data[0].url
    }
    return null
  }

  /*
  postData:
  {
    "apiKey": "please",
    "prompt": "5px black rounded border, this image as background: https://es.rollingstone.com/wp-content/uploads/2023/02/Los-planes-de-Foo-Fighters-para-este-2023.jpg (fit contents)"
  }
  */
  generateCss(postData) {
    return this.http.post('/api/1/openai/css', postData)
  }
}