import * as migration_20260925_130455_initial from './20260925_130455_initial';
import * as migration_20260926_081836_product_story_fields from './20260926_081836_product_story_fields';
import * as migration_20260928_072304_offers_coupons from './20260928_072304_offers_coupons';

export const migrations = [
  {
    up: migration_20260925_130455_initial.up,
    down: migration_20260925_130455_initial.down,
    name: '20260925_130455_initial',
  },
  {
    up: migration_20260926_081836_product_story_fields.up,
    down: migration_20260926_081836_product_story_fields.down,
    name: '20260926_081836_product_story_fields',
  },
  {
    up: migration_20260928_072304_offers_coupons.up,
    down: migration_20260928_072304_offers_coupons.down,
    name: '20260928_072304_offers_coupons'
  },
];
