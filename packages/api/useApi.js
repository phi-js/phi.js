export default function useApi(apiClasses) {
  let retval = {}
  if (typeof apiClasses == 'object') {
    Object.keys(apiClasses).forEach((key) => {
      retval[key] = new apiClasses[key]
    })

    return retval
  }

  if (typeof apiClasses == 'function') {
    return new apiClasses()
  }

  console.error('invalid arguments for \'%cuseApi\'', 'color: cyan')
  throw 'Could not initialize http client'
}