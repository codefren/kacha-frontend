module.exports = {
    name: 'providers',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/providers',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
