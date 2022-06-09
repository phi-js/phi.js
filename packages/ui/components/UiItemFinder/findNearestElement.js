/*
findNearestElement(haystack, needle, position)

haystack:
a NodeList of elements (i.e. document.querySelectorAll('.SomeClass'))

needle:
The reference element (DOM node)

position:
up, down, left, right
*/

export default function findNearestElement(haystack, needle, position) {
  switch (position) {
  case 'up':
    return onUp(haystack, needle)
  case 'down':
    return onDown(haystack, needle)
  case 'left':
    return onLeft(haystack, needle)
  case 'right':
    return onRight(haystack, needle)
  }

  return null
}


function onDown(haystack, needle) {
  const curBounds = needle.getBoundingClientRect()
  if (!curBounds) {
    return null
  }

  const candidates = []
  for (let i = 0; i < haystack.length; i++) {
    const node = haystack[i]
    const nodeBounds = node.getBoundingClientRect()
    if (
      nodeBounds.top >= curBounds.bottom
      && nodeBounds.left < curBounds.right
      && nodeBounds.right > curBounds.left
    ) {
      const distance = nodeBounds.top - curBounds.bottom
      candidates.push({
        node,
        distance,
      })
    }
  }

  var minDistance = Infinity
  var closestNode = null
  candidates.forEach((candidate) => {
    if (candidate.distance < minDistance) {
      closestNode = candidate.node
      minDistance = candidate.distance
    }
  })

  return closestNode
}

function onUp(haystack, needle) {
  const curBounds = needle.getBoundingClientRect()
  if (!curBounds) {
    return null
  }

  const candidates = []
  for (let i = 0; i < haystack.length; i++) {
    const node = haystack[i]
    const nodeBounds = node.getBoundingClientRect()
    if (
      nodeBounds.bottom <= curBounds.top
      && nodeBounds.left < curBounds.right
      && nodeBounds.right > curBounds.left
    ) {
      const distance = curBounds.top - nodeBounds.bottom
      candidates.push({
        node,
        distance,
      })
    }
  }

  var minDistance = Infinity
  var closestNode = null
  candidates.forEach((candidate) => {
    if (candidate.distance < minDistance) {
      closestNode = candidate.node
      minDistance = candidate.distance
    }
  })

  return closestNode
}

function onLeft(haystack, needle) {
  const curBounds = needle.getBoundingClientRect()
  if (!curBounds) {
    return null
  }

  const candidates = []
  for (let i = 0; i < haystack.length; i++) {
    const node = haystack[i]
    const nodeBounds = node.getBoundingClientRect()
    if (
      nodeBounds.right <= curBounds.left
      && nodeBounds.top < curBounds.bottom
      && nodeBounds.bottom > curBounds.top
    ) {
      const distance = curBounds.left - nodeBounds.right
      candidates.push({
        node,
        distance,
      })
    }
  }

  var minDistance = Infinity
  var closestNode = null
  candidates.forEach((candidate) => {
    if (candidate.distance < minDistance) {
      closestNode = candidate.node
      minDistance = candidate.distance
    }
  })

  return closestNode
}

function onRight(haystack, needle) {
  const curBounds = needle.getBoundingClientRect()
  if (!curBounds) {
    return null
  }

  const candidates = []
  for (let i = 0; i < haystack.length; i++) {
    const node = haystack[i]
    const nodeBounds = node.getBoundingClientRect()
    if (
      nodeBounds.left >= curBounds.right
      && nodeBounds.top < curBounds.bottom
      && nodeBounds.bottom > curBounds.top
    ) {
      const distance = nodeBounds.right - curBounds.left
      candidates.push({
        node,
        distance,
      })
    }
  }

  var minDistance = Infinity
  var closestNode = null
  candidates.forEach((candidate) => {
    if (candidate.distance < minDistance) {
      closestNode = candidate.node
      minDistance = candidate.distance
    }
  })

  return closestNode
}