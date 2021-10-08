const Graph = {

  sanitize(graph) {
    let retval = Object.assign({
      nodes: [],
      paths: []
    }, graph);

    retval.nodes = retval.nodes.map(Graph.sanitizeNode).filter(n => n != null);
    retval.paths = retval.paths.map(path => Graph.sanitizePath(path, retval.nodes)).filter(p => p != null);

    return retval;
  },

  sanitizeNode(node) {
    if (!node || typeof node != 'object' || typeof node.id == 'undefined') {
      console.warn("Graph> 'node' must be an object with 'id' property");
      return null;
    }

    return {
      page: null,
      ...node,
      card: {
        text: node.id,
        secondary: null,
        icon: null,
        color: null,
        cover: null,
        ...node.card
      }
    };
  },

  sanitizePath(path, allNodes) {
    if (!path || typeof path != 'object' || typeof path.to == 'undefined') {
      console.warn('Graph> Invalid path', path);
      return null;
    }

    let fromNode = allNodes.find(n => n.id == path.from);
    if (!fromNode) {
      console.warn(`Graph> "from" node '${path.from}' not found`, path);
      return null;
    }

    let toNode = allNodes.find(n => n.id == path.to);
    if (!toNode) {
      console.warn(`Graph> target node '${path.to}' not found`, path);
      return null;
    }

    return {
      from: null,
      to: null,
      ...path,
      card: {
        ...toNode.card,
        ...path.card
      },
    };
  },

  getInitialNode(graph) {
    let candidates = graph.nodes.filter(node => {
      let entrances = graph.paths.filter(path => path.to == node.id);
      return entrances.length == 0;
    });

    if (!candidates.length) {
      return null;
    }

    return candidates[candidates.length - 1];
  }
}

export default Graph;