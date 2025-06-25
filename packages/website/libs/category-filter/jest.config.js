module.exports = {
    name: 'category-filter',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/category-filter',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
