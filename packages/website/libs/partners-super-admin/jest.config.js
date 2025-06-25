module.exports = {
    name: 'partners-super-admin',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/partners-super-admin',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
