module.exports = {
    name: 'parcel',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/parcel',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
