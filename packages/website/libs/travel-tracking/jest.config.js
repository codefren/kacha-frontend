module.exports = {
    name: 'travel-tracking',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/travel-tracking',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
