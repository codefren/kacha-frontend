module.exports = {
    name: 'management-logistics',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/management-logistics',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
