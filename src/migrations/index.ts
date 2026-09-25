import * as migration_20260925_130455_initial from './20260925_130455_initial';

export const migrations = [
  {
    up: migration_20260925_130455_initial.up,
    down: migration_20260925_130455_initial.down,
    name: '20260925_130455_initial'
  },
];
