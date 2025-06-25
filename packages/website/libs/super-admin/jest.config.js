module.exports = {
    name: 'super-admin',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/super-admin',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
