module.exports = {
    name: 'category',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/category',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
