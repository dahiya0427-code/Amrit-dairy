/**
 * Flip-card points, icon badges, story slides, comparison, kitchen uses and
 * benefits for each product (EN + HI). Wording stays factual: process, taste,
 * packing and traditional use, with no medical claims.
 */
type Loc = { cardPoints: string[]; usage?: string[]; benefits?: string[]; comparison?: [string, string][] }
export type Extra = { cutout?: string; badges: string[]; storySlides: string[]; en: Loc; hi: Loc }

const achar: Extra = {
  badges: ['rajasthani', 'small-batch', 'glass', 'ships'],
  storySlides: ['source', 'uses'],
  en: {
    cardPoints: ['Rajasthan-special recipe', 'Made in small batches', '500 g glass jar'],
    usage: ['With parathas and puris', 'Dal-chawal and khichdi', 'Tiffin and travel', 'With curd rice'],
    benefits: ['Traditional home-style recipe', 'Small batches from our kitchen', 'Packed in glass, ships across India'],
  },
  hi: {
    cardPoints: ['राजस्थानी विशेष विधि', 'छोटे बैच में बना', '500 ग्राम काँच का जार'],
    usage: ['पराठे और पूरी के साथ', 'दाल-चावल और खिचड़ी', 'टिफ़िन और सफ़र', 'दही-चावल के साथ'],
    benefits: ['घर जैसी पारंपरिक विधि', 'हमारी रसोई में छोटे बैच', 'काँच में पैक, पूरे भारत में डिलीवरी'],
  },
}

const acharCutouts: Record<string, string> = {
  'marwadi-mix-veg-achar': 'mix-veg-achar.png',
  'garlic-achar': 'garlic-achar.png',
  'green-chilli-achar': 'green-chilli-achar.png',
  'kaccha-mango-achar': 'kaccha-mango-achar.png',
  'sweet-lemon-achar': 'lemon-achar.png',
}

export const extras: Record<string, Extra> = {
  'desi-cow-golden-ghee': {
    cutout: 'ghee.png',
    badges: ['bilona', 'desi-cow', 'makkhan', 'glass'],
    storySlides: ['bilona', 'process', 'compare', 'uses', 'source'],
    en: {
      cardPoints: ['Hand-churned Bilona', 'From our own desi cows', '1 kg glass jar'],
      usage: ['On hot rotis and parathas', 'Tadka for dal and sabzi', 'Halwa, laddoo and sweets', 'Khichdi and rice', 'Festive puja and diya'],
      benefits: ['Rich aroma and grainy (danedar) texture', 'High smoke point, good for Indian cooking', 'Made only from our own desi cow milk', 'A little goes a long way'],
      comparison: [
        ['Made from curd (dahi)', 'Made directly from cream'],
        ['Hand-churned in a bilona', 'Machine-processed'],
        ['Small batches on our farm', 'Mass produced'],
        ['Milk from our own desi cows', 'Milk from many unknown sources'],
        ['Packed in glass', 'Often packed in plastic'],
      ],
    },
    hi: {
      cardPoints: ['हाथ से मथा बिलोना', 'हमारी अपनी देसी गायों से', '1 किलो काँच का जार'],
      usage: ['गरम रोटी और पराठे पर', 'दाल और सब्ज़ी का तड़का', 'हलवा, लड्डू और मिठाई', 'खिचड़ी और चावल', 'पूजा और दीया'],
      benefits: ['भरपूर खुशबू और दानेदार बनावट', 'ऊँचा स्मोक पॉइंट, भारतीय खाने के लिए अच्छा', 'सिर्फ़ हमारी देसी गायों के दूध से', 'थोड़ा ही काफ़ी है'],
      comparison: [
        ['दही से बना', 'सीधे मलाई से बना'],
        ['बिलोने में हाथ से मथा', 'मशीन से प्रोसेस'],
        ['हमारे फार्म पर छोटे बैच', 'बड़े पैमाने पर उत्पादन'],
        ['हमारी अपनी देसी गायों का दूध', 'कई अनजान स्रोतों का दूध'],
        ['काँच में पैक', 'अक्सर प्लास्टिक में पैक'],
      ],
    },
  },
  'raw-forest-honey': {
    cutout: 'honey.png',
    badges: ['glass', 'no-additives', 'ships'],
    storySlides: ['uses', 'source'],
    en: {
      cardPoints: ['Raw and unprocessed', 'Rich aroma, rich taste', '500 g glass jar'],
      usage: ['With warm water in the morning', 'On toast and parathas', 'In tea and kadha', 'Over fruit and dahi'],
      benefits: ['Raw forest honey, not processed', 'Natural crystallisation is a good sign', 'Packed in glass'],
    },
    hi: {
      cardPoints: ['कच्चा, बिना प्रोसेस', 'भरपूर खुशबू और स्वाद', '500 ग्राम काँच का जार'],
      usage: ['सुबह गुनगुने पानी के साथ', 'टोस्ट और पराठे पर', 'चाय और काढ़े में', 'फल और दही पर'],
      benefits: ['कच्चा जंगली शहद, प्रोसेस नहीं', 'प्राकृतिक रूप से जमना अच्छा संकेत है', 'काँच में पैक'],
    },
  },
  'desi-cow-milk': {
    cutout: 'milk.png',
    badges: ['desi-cow', 'glass', 'fresh'],
    storySlides: ['uses', 'source'],
    en: {
      cardPoints: ['Desi cow milk', '1 L glass bottle', 'Delivered every morning'],
      usage: ['Morning chai and coffee', 'Kheer and sweets', 'Set your own dahi', 'Haldi doodh at night'],
      benefits: ['From our own desi cows', 'Glass bottle, no plastic pouch', 'Daily subscription in Sonipat'],
    },
    hi: {
      cardPoints: ['देसी गाय का दूध', '1 लीटर काँच की बोतल', 'हर सुबह डिलीवरी'],
      usage: ['सुबह की चाय और कॉफ़ी', 'खीर और मिठाई', 'घर पर दही जमाएँ', 'रात में हल्दी दूध'],
      benefits: ['हमारी अपनी देसी गायों से', 'काँच की बोतल, प्लास्टिक की थैली नहीं', 'सोनीपत में रोज़ का सब्सक्रिप्शन'],
    },
  },
  'matka-dahi': {
    cutout: 'curd.png',
    badges: ['clay', 'desi-cow', 'fresh'],
    storySlides: ['uses', 'source'],
    en: { cardPoints: ['Set in a clay matka', 'Thick and creamy', 'From our desi cows'], usage: ['With parathas', 'Raita and kadhi', 'Lassi and chaach'] },
    hi: { cardPoints: ['मिट्टी के मटके में जमा', 'गाढ़ा और मलाईदार', 'हमारी देसी गायों से'], usage: ['पराठों के साथ', 'रायता और कढ़ी', 'लस्सी और छाछ'] },
  },
  buttermilk: {
    cutout: 'buttermilk.png',
    badges: ['bilona', 'fresh'],
    storySlides: ['source'],
    en: { cardPoints: ['Traditional chaach', 'From our Bilona process', '1 L bottle'], usage: ['With lunch', 'Masala chaach', 'Summer cooler'] },
    hi: { cardPoints: ['पारंपरिक छाछ', 'हमारी बिलोना प्रक्रिया से', '1 लीटर बोतल'], usage: ['दोपहर के खाने के साथ', 'मसाला छाछ', 'गर्मी में ठंडक'] },
  },
  paneer: {
    cutout: 'paneer.png',
    badges: ['desi-cow', 'fresh'],
    storySlides: ['source'],
    en: { cardPoints: ['Fresh, soft paneer', 'Desi cow milk', '500 g pack'], usage: ['Paneer bhurji', 'Shahi paneer', 'Paneer paratha'] },
    hi: { cardPoints: ['ताज़ा, नरम पनीर', 'देसी गाय का दूध', '500 ग्राम पैक'], usage: ['पनीर भुर्जी', 'शाही पनीर', 'पनीर पराठा'] },
  },
  butter: {
    badges: ['desi-cow', 'fresh'],
    storySlides: ['source'],
    en: { cardPoints: ['White makkhan', 'Desi cow milk', 'Fresh from the farm'] },
    hi: { cardPoints: ['सफ़ेद मक्खन', 'देसी गाय का दूध', 'फार्म से ताज़ा'] },
  },
  cream: {
    badges: ['desi-cow', 'fresh'],
    storySlides: ['source'],
    en: { cardPoints: ['Fresh malai', 'Desi cow milk', 'For sweets and gravies'] },
    hi: { cardPoints: ['ताज़ा मलाई', 'देसी गाय का दूध', 'मिठाई और ग्रेवी के लिए'] },
  },
  'pure-sarso-oil': {
    cutout: 'mustard-oil.png',
    badges: ['ships'],
    storySlides: ['uses'],
    en: { cardPoints: ['Pure sarso oil', 'For cooking and achar', '1 L bottle'], usage: ['Everyday cooking', 'Achar making', 'Sarson ka saag tadka'] },
    hi: { cardPoints: ['शुद्ध सरसों तेल', 'खाना बनाने और अचार के लिए', '1 लीटर बोतल'], usage: ['रोज़ का खाना', 'अचार बनाना', 'सरसों के साग का तड़का'] },
  },
}

export function extraFor(slug: string, category: string): Extra | undefined {
  if (extras[slug]) return extras[slug]
  if (category === 'achar') return { ...achar, cutout: acharCutouts[slug] }
  return undefined
}

export const categoryExtras: Record<string, { banner: string; en: { tagline: string; pills: string[] }; hi: { tagline: string; pills: string[] } }> = {
  ghee: { banner: 'ghee.png', en: { tagline: 'Churned from curd. Cooked slow.', pills: ['Our own desi cows', 'Dahi-based Bilona', 'Glass jar'] }, hi: { tagline: 'दही से मथा, धीमी आँच पर पका।', pills: ['हमारी अपनी देसी गायें', 'दही से बिलोना', 'काँच का जार'] } },
  dairy: { banner: 'milk.png', en: { tagline: 'Fresh from our cows, every morning.', pills: ['Glass bottles', 'Clay matka dahi', 'Delivered in Sonipat'] }, hi: { tagline: 'हर सुबह हमारी गायों से ताज़ा।', pills: ['काँच की बोतल', 'मटका दही', 'सोनीपत में डिलीवरी'] } },
  achar: { banner: 'mix-veg-achar.png', en: { tagline: 'Rajasthan’s flavours, in small batches.', pills: ['Traditional recipes', '500 g glass jars', 'Ships across India'] }, hi: { tagline: 'राजस्थान का स्वाद, छोटे बैच में।', pills: ['पारंपरिक विधि', '500 ग्राम काँच के जार', 'पूरे भारत में डिलीवरी'] } },
  pantry: { banner: 'honey.png', en: { tagline: 'Pure honey and oil for your kitchen.', pills: ['Raw forest honey', 'Pure sarso oil', 'Ships across India'] }, hi: { tagline: 'आपकी रसोई के लिए शुद्ध शहद और तेल।', pills: ['कच्चा जंगली शहद', 'शुद्ध सरसों तेल', 'पूरे भारत में डिलीवरी'] } },
}
