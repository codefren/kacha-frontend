module.exports = {
    name: 'state-geolocation',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/state-geolocation',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
