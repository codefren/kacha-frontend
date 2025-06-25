module.exports = {
    name: 'cost',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/cost',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
