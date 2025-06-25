module.exports = {
    name: 'sheet-route',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/sheet-route',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
