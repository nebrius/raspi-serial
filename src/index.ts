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
import * as SerialPort from 'serialport';

export const PARITY_NONE = 'none';
export const PARITY_EVEN = 'even';
export const PARITY_ODD = 'odd';
export const PARITY_MARK = 'mark';
export const PARITY_SPACE = 'space';

export const DEFAULT_PORT = '/dev/ttyAMA0';

export interface IOptions {
  portId?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
}

export interface ICallback {
  (): void;
}

export interface IErrorCallback {
  (err: Error | string): void;
}

function createEmptyCallback(cb?: ICallback): ICallback {
  return function() {
    if (cb) {
      cb();
    }
  };
}

function createErrorCallback(cb?: IErrorCallback): IErrorCallback {
  return function(err: Error | string) {
    if (cb) {
      cb(err);
    }
  };
}

export class Serial extends Peripheral {

  private portId: string;
  private options: { baudRate: number, dataBits: number, stopBits: number, parity: string };
  private portInstance: SerialPort;
  private isOpen: boolean;

  constructor({ portId = DEFAULT_PORT, baudRate = 9600, dataBits = 8, stopBits = 1, parity = PARITY_NONE }: IOptions = {}) {
    const pins = [];
    if (portId === DEFAULT_PORT) {
      pins.push('TXD0', 'RXD0');
    }
    super(pins);
    this.portId = portId;
    this.options = {
      baudRate,
      dataBits,
      stopBits,
      parity
    };
  }

  public get port(): string {
    return this.portId;
  }

  public get baudRate(): number {
    return this.options.baudRate;
  }

  public get dataBits(): number {
    return this.options.dataBits;
  }

  public get stopBits(): number {
    return this.options.stopBits;
  }

  public get parity(): string {
    return this.options.parity;
  }

  public destroy(): void {
    this.close();
  }

  public open(cb?: ICallback): void {
    this.validateAlive();
    if (this.isOpen) {
      if (cb) {
        setImmediate(cb);
      }
      return;
    }
    this.portInstance = new SerialPort(this.portId, this.options);
    this.portInstance.on('open', () => {
      this.portInstance.on('data', (data) => {
        this.emit('data', data);
      });
      this.isOpen = true;
      if (cb) {
        cb();
      }
    });
  }

  public close(cb?: IErrorCallback): void {
    this.validateAlive();
    if (!this.isOpen) {
      if (cb) {
        setImmediate(cb);
      }
      return;
    }
    this.isOpen = false;
    this.portInstance.close(createErrorCallback(cb));
  }

  public write(data: Buffer | string, cb?: ICallback): void {
    this.validateAlive();
    if (!this.isOpen) {
      throw new Error('Attempted to write to a closed serial port');
    }
    this.portInstance.write(data, createEmptyCallback(cb));
  }

  public flush(cb?: IErrorCallback): void {
    this.validateAlive();
    if (!this.isOpen) {
      throw new Error('Attempted to flush a closed serial port');
    }
    this.portInstance.flush(createErrorCallback(cb));
  }

}
