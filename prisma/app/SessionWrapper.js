"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SessionWrapper;
const react_1 = require("next-auth/react");
function SessionWrapper({ children }) {
    return <react_1.SessionProvider>{children}</react_1.SessionProvider>;
}
