module.exports = {
    name: 'company-profile',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/company-profile',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
