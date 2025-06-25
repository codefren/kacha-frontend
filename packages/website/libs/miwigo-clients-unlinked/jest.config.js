module.exports = {
    name: 'miwigo-clients-unlinked',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/miwigo-clients-unlinked',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
