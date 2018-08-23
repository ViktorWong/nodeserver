module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "soucreType": "script"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "no-console": [
            "error",
            {
                "allow":["warn","info"]
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        'semi-spacing': [2, {
            'before': false,
            'after': true
        }],
    }
};
