/**
 * @class Const
 * @property {RegExp} IPRegex
 * Holds core level constant
 * Shouldn't hold any app level constants
 */
export class Const {
    public static IPRegex: RegExp = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;     
}
