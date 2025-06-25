module.exports = {
    name: 'filter-state',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/filter-state',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
