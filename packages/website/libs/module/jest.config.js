module.exports = {
    name: 'module',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/module',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
