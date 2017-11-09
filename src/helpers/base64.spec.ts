import { Base64, InvalidCharacterError } from './base64';

describe('Helper: Base64', () => {
    it('#btoa can encode ASCII input', () => {
        expect(Base64.btoa('')).toEqual('');
        expect(Base64.btoa('f')).toEqual('Zg==');
        expect(Base64.btoa('fo')).toEqual('Zm8=');
        expect(Base64.btoa('foo')).toEqual('Zm9v');
        expect(Base64.btoa('quux')).toEqual('cXV1eA==');
        expect(Base64.btoa('!"#$%')).toEqual('ISIjJCU=');
        expect(Base64.btoa("&'()*+")).toEqual('JicoKSor');
        expect(Base64.btoa(',-./012')).toEqual('LC0uLzAxMg==');
        expect(Base64.btoa('3456789:')).toEqual('MzQ1Njc4OTo=');
        expect(Base64.btoa(';<=>?@ABC')).toEqual('Ozw9Pj9AQUJD');
        expect(Base64.btoa('DEFGHIJKLM')).toEqual('REVGR0hJSktMTQ==');
        expect(Base64.btoa('NOPQRSTUVWX')).toEqual('Tk9QUVJTVFVWV1g=');
        expect(Base64.btoa('YZ[\\]^_`abc')).toEqual('WVpbXF1eX2BhYmM=');
        expect(Base64.btoa('defghijklmnop')).toEqual('ZGVmZ2hpamtsbW5vcA==');
        expect(Base64.btoa('qrstuvwxyz{|}~')).toEqual('cXJzdHV2d3h5ent8fX4=');
    });

    it('#btoa cannot encode non-ASCII input', () => {
        expect(() => Base64.btoa('✈'))
            .toThrow(new InvalidCharacterError(
                "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
            ));
    });

    it('#btoa coerces input', () => {
        expect(Base64.btoa(42)).toEqual(Base64.btoa('42'));
        expect(Base64.btoa(null)).toEqual(Base64.btoa('null'));
        expect(Base64.btoa({x: 1})).toEqual(Base64.btoa('[object Object]'));
    });

    it('#atob can decode Base64-encoded input', () => {
        expect(Base64.atob('')).toEqual('');
        expect(Base64.atob('Zg==')).toEqual('f');
        expect(Base64.atob('Zm8=')).toEqual('fo');
        expect(Base64.atob('Zm9v')).toEqual('foo');
        expect(Base64.atob('cXV1eA==')).toEqual('quux');
        expect(Base64.atob('ISIjJCU=')).toEqual('!"#$%');
        expect(Base64.atob('JicoKSor')).toEqual("&'()*+");
        expect(Base64.atob('LC0uLzAxMg==')).toEqual(',-./012');
        expect(Base64.atob('MzQ1Njc4OTo=')).toEqual('3456789:');
        expect(Base64.atob('Ozw9Pj9AQUJD')).toEqual(';<=>?@ABC');
        expect(Base64.atob('REVGR0hJSktMTQ==')).toEqual('DEFGHIJKLM');
        expect(Base64.atob('Tk9QUVJTVFVWV1g=')).toEqual('NOPQRSTUVWX');
        expect(Base64.atob('WVpbXF1eX2BhYmM=')).toEqual('YZ[\\]^_`abc');
        expect(Base64.atob('ZGVmZ2hpamtsbW5vcA==')).toEqual('defghijklmnop');
        expect(Base64.atob('cXJzdHV2d3h5ent8fX4=')).toEqual('qrstuvwxyz{|}~');
    });

    it('#atob cannot decode invalid input', () => {
        expect(() => Base64.atob('a'))
            .toThrow(new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded."));
    });

    it('#atob coerces input', () => {
        expect(Base64.atob(42)).toEqual(Base64.atob('42'));
        expect(Base64.atob(null)).toEqual(Base64.atob('null'));
    });
});
