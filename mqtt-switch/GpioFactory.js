class MockGPIO {
  constructor(pin, direction) {
    this._value = 0;
    this._direction = direction;
  }

  readSync() { return this._value; }
  read(cb) { cb(null, this._value) }
  writeSync(value) { this._value = value }
  write(value, cb) {
    this._value = value;
    cb(null, value);
  }
  watch(cb) {}
  unwatch(cb) {}
  unwatchAll() {}
  direction() { return this._direction }
  setDirection(direction) { this._direction = direction}
  edge() { return 0; }
  setEdge(edge) {}
  activeLow() { return true; }
  setActiveLow(invert) {}
  unexport() {}
}

MockGPIO.accessible = false;
MockGPIO.HIGH = 1;
MockGPIO.LOW = 0;

module.exports = {
  create: () => {
    try {
      return require('onoff').Gpio;
    } catch (e) {
      console.error('Using mock Gpio');
      return MockGPIO;
    }
  }
};