import next from 'eslint-config-next';

/**
 * Flat config. eslint-config-next 16 default-exports an array of flat configs,
 * so it is spread directly. The FlatCompat shim the scaffold generated throws
 * a circular-structure error against this version.
 */
const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
  ...next,
];

export default config;
