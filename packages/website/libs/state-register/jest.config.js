module.exports = {
    name: 'state-register',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/state-register',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
