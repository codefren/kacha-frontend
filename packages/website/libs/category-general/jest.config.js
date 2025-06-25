module.exports = {
    name: 'category-general',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/category-general',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
