module.exports = {
    name: 'chat',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/chat',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js',
    ],
};
