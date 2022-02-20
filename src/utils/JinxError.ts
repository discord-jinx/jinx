export const JinxErrorKeys: JinxErrorKeysType = {
    "NO_MODULE_NAME": "Module name cannot be empty.",
    "NOT_AN_INSTANCE": (type) => `Module isn't an instance of the ${type}.`
};

export type JinxErrorKeysType = {
    [index in JinxErrorKeysTypeKeys]: string | Function;
};

export type JinxErrorKeysTypeKeys = 
"NO_MODULE_NAME" |
"NOT_AN_INSTANCE";

export class JinxError extends Error {
    constructor (key: keyof (typeof JinxErrorKeys), ...args) {
        var message = JinxErrorKeys[key];
        
        if (typeof (message) === "function") {
            message = message(...args);
        };

        super(message as string);
    };
};