export default function (args) {
  if (!Array.isArray(args)) {
    return args;
  }

  let retval = 0;
  args.forEach(num => {
    let step = parseFloat(num);
    if (!isNaN(step)) {
      retval += step;
    }
  });
  return retval;
}