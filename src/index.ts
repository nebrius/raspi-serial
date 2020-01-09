/*
The MIT License (MIT)

Copyright (c) 2014-2017 Bryan Hughes <bryan@nebri.us>

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
import * as SerialPort from 'serialport';
import { ISerial, ISerialModule, ISerialOptions } from 'j5-io-types';

export const PARITY_NONE = 'none';
export const PARITY_EVEN = 'even';
export const PARITY_ODD = 'odd';
export const PARITY_MARK = 'mark';
export const PARITY_SPACE = 'space';

export const DEFAULT_PORT = '/dev/ttyAMA0';

interface IParsedOptions {
  portId: string;
  baudRate: 115200|57600|38400|19200|9600|4800|2400|1800|1200|600|300|200|150|134|110|75|50|number;
  dataBits: 8|7|6|5;
  stopBits: 1|2;
  parity: 'none'|'even'|'mark'|'odd'|'space';
}

export type Callback = () => void;

export type ErrorCallback = (err: Error | string) => void;

function createEmptyCallback(cb?: Callback): Callback {
  return () => {
    if (cb) {
      cb();
    }
  };
}

function createErrorCallback(cb?: ErrorCallback): ErrorCallback {
  return (err: Error | string) => {
    if (cb) {
      cb(err);
    }
  };
}

export class Serial extends Peripheral implements ISerial {

  private _portId: string;
  private _options: IParsedOptions;
  private _portInstance: SerialPort | undefined;
  private _isOpen: boolean;

  constructor({
    portId = DEFAULT_PORT,
    baudRate = 9600,
    dataBits = 8,
    stopBits = 1,
    parity = PARITY_NONE
  }: ISerialOptions = {}) {
    const pins = [];
    if (portId === DEFAULT_PORT) {
      pins.push('TXD0', 'RXD0');
    }
    super(pins);
    this._portId = portId;
    this._options = {
      portId,
      baudRate,
      dataBits,
      stopBits,
      parity
    };
    this._isOpen = false;

    process.on('beforeExit', () => {
      this.destroy();
    });
  }

  public get port(): string {
    return this._portId;
  }

  public get baudRate(): number {
    return this._options.baudRate;
  }

  public get dataBits(): number {
    return this._options.dataBits;
  }

  public get stopBits(): number {
    return this._options.stopBits;
  }

  public get parity(): string {
    return this._options.parity;
  }

  public destroy(): void {
    this.close();
  }

  public open(cb?: Callback): void {
    this.validateAlive();
    if (this._isOpen) {
      if (cb) {
        setImmediate(cb);
      }
      return;
    }
    this._portInstance = new SerialPort(this._portId, {
      lock: false,
      baudRate: this._options.baudRate,
      dataBits: this._options.dataBits,
      stopBits: this._options.stopBits,
      parity: this._options.parity
    });
    this._portInstance.on('open', () => {
      if (!this._portInstance) {
        throw new Error('Internal error: _portInstance undefined in "open" callback. ' +
          'Please report this as a bug at https://github.com/nebrius/raspi-serial/issues.');
      }
      this._portInstance.on('data', (data) => {
        this.emit('data', data);
      });
      this._isOpen = true;
      if (cb) {
        cb();
      }
    });
  }

  public close(cb?: ErrorCallback): void {
    this.validateAlive();
    if (!this._isOpen) {
      if (cb) {
        setImmediate(cb);
      }
      return;
    }
    this._isOpen = false;
    if (!this._portInstance) {
      throw new Error('Internal error: _portInstance undefined in "open" callback. ' +
        'Please report this as a bug at https://github.com/nebrius/raspi-serial/issues.');
    }
    this._portInstance.close(createErrorCallback(cb) as any);
  }

  public write(data: Buffer | string, cb?: Callback): void {
    this.validateAlive();
    if (!this._isOpen) {
      throw new Error('Attempted to write to a closed serial port');
    }
    if (!this._portInstance) {
      throw new Error('Internal error: _portInstance undefined in "open" callback. ' +
        'Please report this as a bug at https://github.com/nebrius/raspi-serial/issues.');
    }
    this._portInstance.write(data, createEmptyCallback(cb));
  }

  public flush(cb?: ErrorCallback): void {
    this.validateAlive();
    if (!this._isOpen) {
      throw new Error('Attempted to flush a closed serial port');
    }
    if (!this._portInstance) {
      throw new Error('Internal error: _portInstance undefined in "open" callback. ' +
        'Please report this as a bug at https://github.com/nebrius/raspi-serial/issues.');
    }
    this._portInstance.flush(createErrorCallback(cb) as any);
  }

}

export const module: ISerialModule = {
  createSerial(options?: ISerialOptions) {
    return new Serial(options);
  }
};
