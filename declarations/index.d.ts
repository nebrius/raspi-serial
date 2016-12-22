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
export declare class Serial extends Peripheral {
    private portId;
    private options;
    private portInstance;
    private isOpen;
    constructor({portId, baudRate, dataBits, stopBits, parity}?: IOptions);
    readonly port: string;
    readonly baudRate: number;
    readonly dataBits: number;
    readonly stopBits: number;
    readonly parity: string;
    destroy(): void;
    open(cb?: ICallback): void;
    close(cb?: IErrorCallback): void;
    write(data: Buffer | string, cb?: ICallback): void;
    flush(cb?: IErrorCallback): void;
}
