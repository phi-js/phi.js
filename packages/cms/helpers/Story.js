import helperGraph from './Graph.js';
import helperPage from './Page.js';

const Story = {
  sanitize(story) {

    // Si es una PAGINA (nueva), convertir en story
    if (Array.isArray(story?.sections)) {
      story = {
        nodes: [
          {
            id: 'migrated-page',
            page: story,
            card: {
              text: 'Pagina (migrada)'
            }
          }
        ]
      };
    }

    // Si es una PAGINA (vieja), convertir en story
    if (Array.isArray(story?.blocks)) {
      story = {
        nodes: [
          {
            id: 'migrated-page',
            page: helperPage.sanitizePage(story),
            card: {
              text: 'Pagina (migrada)'
            }
          }
        ]
      };
    }

    if (!story) {
      story = {
        nodes: [
          {
            id: 'default-node',
            page: null,
            card: {
              text: 'Blank'
            }
          }
        ]
      };
    }

    return helperGraph.sanitize(story);
  },

  getInitialNode(story) {
    return helperGraph.getInitialNode(story);
  },

  getSchema(story) {
    let retval = {
      type: 'object',
      properties: {}
    };

    for (let node of story.nodes) {
      if (!node.page) {
        continue;
      }

      let schema = helperPage.getModelSchema(node.page);

      retval.properties = {
        ...retval.properties,
        ...schema?.properties
      };
    }

    return retval;
  }
}

export default Story;