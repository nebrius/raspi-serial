/*
The MIT License (MIT)

Copyright (c) 2016 Bryan Hughes <bryan@nebri.us>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { Peripheral } from 'raspi-peripheral';
import SerialPort from 'serialport';

export const PARITY_NONE = 'none';
export const PARITY_EVEN = 'even';
export const PARITY_ODD = 'odd';
export const PARITY_MARK = 'mark';
export const PARITY_SPACE = 'space';

export const DEFAULT_PORT = '/dev/ttyAMA0';

const port = Symbol('port');
const options = Symbol('options');
const portInstance = Symbol('portInstance');
const isOpen = Symbol('isOpen');

export class Serial extends Peripheral {

  constructor({ portId = DEFAULT_PORT, baudRate = 9600, dataBits = 8, stopBits = 1, parity = PARITY_NONE } = {}) {
    const pins = [];
    if (port === DEFAULT_PORT) {
      pins.push('TXD0', 'RXD0');
    }
    super(pins);
    this[port] = portId;
    this[options] = {
      baudRate,
      dataBits,
      stopBits,
      parity
    }
    Object.defineProperties(this, {
      port: {
        get() {
          return portId
        },
        enumerable: true
      },
      baudRate: {
        get() {
          return baudRate
        },
        enumerable: true
      },
      dataBits: {
        get() {
          return dataBits
        },
        enumerable: true
      },
      stopBits: {
        get() {
          return stopBits
        },
        enumerable: true
      },
      parity: {
        get() {
          return parity
        },
        enumerable: true
      }
    });
  }

  destroy() {
    this.close();
  }

  open(cb) {
    this.validateAlive();
    if (this[isOpen]) {
      setImmediate(cb);
      return;
    }
    this[portInstance] = new SerialPort(this[port], this[options]);
    this[portInstance].on('open', () => {
      this[portInstance].on('data', (data) => {
        this.emit('data', data);
      });
      this[isOpen] = true;
      cb();
    });
  }

  close(cb) {
    this.validateAlive();
    if (!this[isOpen]) {
      setImmediate(cb);
      return;
    }
    this[isOpen] = false;
    this[portInstance].close(cb);
  }

  write(data, cb) {
    this.validateAlive();
    if (!this[isOpen]) {
      throw new Error('Attempted to write to a closed serial port');
    }
    this[portInstance].write(data, cb);
  }

  flush(cb) {
    this.validateAlive();
    if (!this[isOpen]) {
      throw new Error('Attempted to flush a closed serial port');
    }
    this[portInstance].flush(cb);
  }

}
