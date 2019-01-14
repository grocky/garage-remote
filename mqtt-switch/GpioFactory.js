class MockGPIO {
  constructor(pin, direction) {
    if (direction === 'high') {
      this._value = 1;
      this.direction = 'out';
    } else if (direction === 'low') {
      this._value = 0;
      this.direction = 'out';
    } else {
      this._direction = direction;
      this._value = 0;
    }
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
  /**
   * @returns {Gpio|MockGPIO}
   */
  create: () => {
    try {
      return require('onoff').Gpio;
    } catch (e) {
      console.error('Using mock Gpio');
      return MockGPIO;
    }
  }
};
