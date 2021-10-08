export default function (args) {
  if (!Array.isArray(args)) {
    return args;
  }

  if (args.length == 1) {
    return args[0];
  }

  let retval = args[0];
  for (let k = 1; k < args.length; k++) {
    let step = parseFloat(args[k]);
    if (!isNaN(step)) {
      retval -= step;
    }
  }
  return retval;
}