module.exports = {
    name: 'sub-category',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/sub-category',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
