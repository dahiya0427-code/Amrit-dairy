import path from 'path'
import type { Payload, PayloadRequest } from 'payload'

/**
 * Starter content added after the first launch: the "Combos & Gifts" category
 * with a Ghee + Honey Gift Box, and the Adopt-a-Cow plans. Safe to run on any
 * database: each item is only created if it is missing, so live edits are kept.
 * Runs from the seed (new databases) and from a migration (the live site).
 */
export async function addStarterAdditions(payload: Payload, req?: PayloadRequest) {
  const mediaDir = path.resolve(process.cwd(), 'seed-media')
  const find = async (collection: 'categories' | 'products', slug: string) =>
    (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, req, overrideAccess: true })).docs[0]
  const media = async (file: string, alt: { en: string; hi: string }) => {
    const doc = await payload.create({ collection: 'media', data: { alt: alt.en }, filePath: path.join(mediaDir, file), locale: 'en', req, overrideAccess: true })
    await payload.update({ collection: 'media', id: doc.id, data: { alt: alt.hi }, locale: 'hi', req, overrideAccess: true })
    return doc.id
  }

  // ── Combos & Gifts ──
  const ghee = await find('products', 'desi-cow-golden-ghee')
  const honey = await find('products', 'raw-forest-honey')
  if (ghee && honey && !(await find('products', 'ghee-honey-gift-box'))) {
    const alt = { en: 'Amrit Bilona ghee and raw forest honey gift box', hi: 'अमृत बिलोना घी और जंगली शहद गिफ़्ट बॉक्स' }
    const image = await media('combo-ghee-honey.jpg', alt)
    const cutout = await media('cutouts/combo-ghee-honey.png', alt)
    let category = await find('categories', 'combos')
    if (!category) {
      category = await payload.create({
        collection: 'categories',
        locale: 'en',
        req,
        overrideAccess: true,
        data: { slug: 'combos', order: 5, image, bannerImage: cutout, title: 'Combos & Gifts', tagline: 'Our favourites, packed together at a better price.', pills: [{ text: 'Save more' }, { text: 'Gift ready' }] },
      })
      await payload.update({ collection: 'categories', id: category.id, locale: 'hi', req, overrideAccess: true, data: { title: 'कॉम्बो और गिफ़्ट', tagline: 'हमारी पसंदीदा चीज़ें एक साथ, कम दाम में।', pills: [{ text: 'ज़्यादा बचत' }, { text: 'गिफ़्ट के लिए तैयार' }] } })
    }
    const combo = await payload.create({
      collection: 'products',
      locale: 'en',
      req,
      overrideAccess: true,
      data: {
        slug: 'ghee-honey-gift-box',
        title: 'Ghee & Honey Gift Box',
        secondaryName: 'घी और शहद गिफ़्ट बॉक्स',
        shortDescription: 'Our 1 kg Bilona ghee and 500 g raw forest honey together, at a better price than buying them separately.',
        category: category.id,
        images: [image],
        cutout,
        status: 'active',
        fulfilment: 'ship',
        badge: 'new',
        featured: true,
        order: 0,
        badges: ['bilona', 'glass', 'ships'],
        cardPoints: [{ text: '1 kg Bilona ghee' }, { text: '500 g raw forest honey' }, { text: 'Ready to gift' }],
        highlights: [{ text: '1 kg A2 Bilona ghee in a glass jar' }, { text: '500 g raw forest honey' }, { text: 'Packed together, ready to gift' }],
        variants: [{ sku: 'AD-COMBO-GH', label: '1 kg ghee + 500 g honey', price: 4600, weightGrams: 1500, inStock: true, onDemand: false }],
        bundle: [
          { product: ghee.id, quantity: 1, note: '1 kg jar' },
          { product: honey.id, quantity: 1, note: '500 g jar' },
        ],
      },
    })
    await payload.update({
      collection: 'products',
      id: combo.id,
      locale: 'hi',
      req,
      overrideAccess: true,
      data: {
        title: 'घी और शहद गिफ़्ट बॉक्स',
        secondaryName: 'Ghee & Honey Gift Box',
        shortDescription: 'हमारा 1 किलो बिलोना घी और 500 ग्राम जंगली शहद एक साथ, अलग-अलग ख़रीदने से कम दाम में।',
        cardPoints: [{ text: '1 किलो बिलोना घी' }, { text: '500 ग्राम जंगली शहद' }, { text: 'गिफ़्ट के लिए तैयार' }],
        highlights: [{ text: 'काँच के जार में 1 किलो A2 बिलोना घी' }, { text: '500 ग्राम जंगली शहद' }, { text: 'साथ में पैक, गिफ़्ट के लिए तैयार' }],
        variants: (combo.variants ?? []).map((v) => ({ ...v, label: '1 किलो घी + 500 ग्राम शहद' })),
        bundle: (combo.bundle ?? []).map((b, i) => ({ ...b, note: ['1 किलो जार', '500 ग्राम जार'][i] })),
      },
    })
    payload.logger.info('[additions] Added Combos & Gifts with the Ghee & Honey Gift Box')
  }

  // ── Adopt-a-Cow plans ──
  const plans = await payload.count({ collection: 'adoption-plans', req, overrideAccess: true })
  if (plans.totalDocs === 0) {
    const defaults = [
      {
        price: 1100, period: 'month' as const, highlight: false, order: 1,
        en: { name: 'Gau Sevak', tagline: 'Feed a cow every month', perks: ['Green fodder for your cow every month', 'A photo of your cow on WhatsApp every month', 'Your name on our Gau Seva board'] },
        hi: { name: 'गौ सेवक', tagline: 'हर महीने एक गाय को चारा', perks: ['हर महीने आपकी गाय के लिए हरा चारा', 'हर महीने WhatsApp पर आपकी गाय की फ़ोटो', 'हमारे गौ सेवा बोर्ड पर आपका नाम'] },
      },
      {
        price: 2100, period: 'month' as const, highlight: true, order: 2,
        en: { name: 'Gau Palak', tagline: 'Care for her fully', perks: ['Her full monthly feed and care', 'Photo and video of your cow every month', 'Adoption certificate with her photo', 'Visit her at the farm any time'] },
        hi: { name: 'गौ पालक', tagline: 'पूरी देखभाल आपकी ओर से', perks: ['उसका पूरे महीने का चारा और देखभाल', 'हर महीने आपकी गाय की फ़ोटो और वीडियो', 'उसकी फ़ोटो के साथ गोद लेने का प्रमाण-पत्र', 'कभी भी फ़ार्म पर आकर उससे मिलें'] },
      },
      {
        price: 21000, period: 'year' as const, highlight: false, order: 3,
        en: { name: 'Gau Rakshak', tagline: 'A whole year of seva', perks: ['A full year of feed and care', 'Photo and video updates every month', 'Framed adoption certificate', 'A family visit and photo with your cow'] },
        hi: { name: 'गौ रक्षक', tagline: 'पूरे साल की सेवा', perks: ['पूरे साल का चारा और देखभाल', 'हर महीने फ़ोटो और वीडियो', 'फ़्रेम किया हुआ प्रमाण-पत्र', 'परिवार के साथ फ़ार्म विज़िट और गाय के साथ फ़ोटो'] },
      },
    ]
    for (const p of defaults) {
      const doc = await payload.create({
        collection: 'adoption-plans',
        locale: 'en',
        req,
        overrideAccess: true,
        data: { name: p.en.name, tagline: p.en.tagline, perks: p.en.perks.map((text) => ({ text })), price: p.price, period: p.period, highlight: p.highlight, order: p.order, active: true },
      })
      await payload.update({ collection: 'adoption-plans', id: doc.id, locale: 'hi', req, overrideAccess: true, data: { name: p.hi.name, tagline: p.hi.tagline, perks: p.hi.perks.map((text) => ({ text })) } })
    }
    payload.logger.info('[additions] Added the Adopt-a-Cow plans')
  }
}
