module.exports = {
    name: 'report',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/report',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
