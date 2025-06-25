module.exports = {
    name: 'my-orders',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/my-orders',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
