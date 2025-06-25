module.exports = {
    name: 'bills',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/bills',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
