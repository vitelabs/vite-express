// How to fix error TS7016: Could not find a declaration file for module ‘XYZ’. ‘file.js’ implicitly has an ‘any’ type
// https://pjausovec.medium.com/how-to-fix-error-ts7016-could-not-find-a-declaration-file-for-module-xyz-has-an-any-type-ecab588800a8

declare module '@vite/connector';
declare module '@vite/vitejs-ws';
declare module 'qrcode.es';
