// Avoid TS error "cannot find name escape"
declare var escape: any;

export function InvalidCharacterError(message) {
    this.message = message;
}
InvalidCharacterError.prototype = new Error;
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export class Base64 {
    public static btoa(input: string | number | object): string {
        let str = String(input);

        let output = '';

        for (
            // initialise result and counter
            let block, charCode, idx = 0, map = chars;
            // if the next str index does not exist:
            //   change the mapping table to '='
            //   check if d has no fractional digits
            str.charAt(idx | 0) || (map = '=', idx % 1);
            // '8 - idx % 1 * 8' generates the sequence 2, 4, 6, 8
            output += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
            charCode = str.charCodeAt(idx += 3 / 4);
            if (charCode > 0xFF) {
                throw new InvalidCharacterError(
                    "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
                );
            }
            block = block << 8 | charCode;
        }

        return output;
    }

    public static atob(input: string | number | object): string {
        let str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
        if (str.length % 4 == 1) {
            throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
        }

        let output = '';

        for (
            // Initiailise result and counters
            let bc = 0, bs, buffer, idx = 0;

            // Get next character
            buffer = str.charAt(idx++);

            // Character found in table? initialise bit storage and add its ascii value;
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
              // and if not first of each 4 characters,
              // convert the first 8 bits to one ascii character)
              bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }

        return output;
    }
}
