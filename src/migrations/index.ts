import * as migration_20260925_130455_initial from './20260925_130455_initial';
import * as migration_20260926_081836_product_story_fields from './20260926_081836_product_story_fields';
import * as migration_20260928_072304_offers_coupons from './20260928_072304_offers_coupons';
import * as migration_20260929_042514_media_files from './20260929_042514_media_files';
import * as migration_20261007_145144_cow_offers from './20261007_145144_cow_offers';
import * as migration_20261007_153703_reviews_stock_combos_adoption from './20261007_153703_reviews_stock_combos_adoption';

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
    name: '20260928_072304_offers_coupons',
  },
  {
    up: migration_20260929_042514_media_files.up,
    down: migration_20260929_042514_media_files.down,
    name: '20260929_042514_media_files',
  },
  {
    up: migration_20261007_145144_cow_offers.up,
    down: migration_20261007_145144_cow_offers.down,
    name: '20261007_145144_cow_offers',
  },
  {
    up: migration_20261007_153703_reviews_stock_combos_adoption.up,
    down: migration_20261007_153703_reviews_stock_combos_adoption.down,
    name: '20261007_153703_reviews_stock_combos_adoption'
  },
];
