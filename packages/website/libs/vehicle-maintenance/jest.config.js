module.exports = {
    name: 'vehicle-maintenance',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/vehicle-maintenance',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
