function debounce(callback, delay = 1000) {
  let timer = null;
  return function () {
    let self = this;
    let args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(self, args);
    }, delay);
  };
}

export { debounce };
