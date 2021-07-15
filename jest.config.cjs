export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            packageJson: 'package.json',
        },
    },
}
