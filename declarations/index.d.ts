/// <reference types="node" />
import { Peripheral } from 'raspi-peripheral';
export declare const PARITY_NONE = "none";
export declare const PARITY_EVEN = "even";
export declare const PARITY_ODD = "odd";
export declare const PARITY_MARK = "mark";
export declare const PARITY_SPACE = "space";
export declare const DEFAULT_PORT = "/dev/ttyAMA0";
export interface IOptions {
    portId?: string;
    baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number;
    dataBits?: 8 | 7 | 6 | 5;
    stopBits?: 1 | 2;
    parity?: 'none' | 'even' | 'mark' | 'odd' | 'space';
}
export declare type Callback = () => void;
export declare type ErrorCallback = (err: Error | string) => void;
export declare class Serial extends Peripheral {
    private _portId;
    private _options;
    private _portInstance;
    private _isOpen;
    constructor({portId, baudRate, dataBits, stopBits, parity}?: IOptions);
    readonly port: string;
    readonly baudRate: number;
    readonly dataBits: number;
    readonly stopBits: number;
    readonly parity: string;
    destroy(): void;
    open(cb?: Callback): void;
    close(cb?: ErrorCallback): void;
    write(data: Buffer | string, cb?: Callback): void;
    flush(cb?: ErrorCallback): void;
}
