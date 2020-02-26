
const throttlellino = () => {
  const queue = [];
  let timeoutID;
  const executeNext = () => {
    const func = queue.shift();
    if (typeof func === "function") {
      func();
    }
  };

  return (func) => {
    return new Promise((resolve, reject) => {
      queue.push(func);
      setTimeout(executeNext, 1000);

    // add to queue
    // create a timeout
    });
  };
};

const throttle = throttlellino();

const test = (num) => console.log("This is test", num);

Promise.all([
  throttle(() => test(1)),
  throttle(() => test(2)),
  throttle(() => test(3)),
])
.then(() => console.log("all done"));