module.exports = {
    name: 'loading-dock',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/loading-dock',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
