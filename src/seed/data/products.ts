import { rt } from '../lexical'

/**
 * Catalogue from the live amritdairy.in (Doc 01 §3). Prices only where the
 * current store shows them; everything else stays "Coming soon" until the
 * owner sets a price in the admin (a ₹0 product can never be published).
 */
export type SeedVariant = { sku: string; label: { en: string; hi: string }; price?: number; weightGrams?: number; onDemand?: boolean; unit?: { en: string; hi: string } }
export type SeedProduct = {
  slug: string
  category: 'dairy' | 'ghee' | 'achar' | 'pantry'
  image: string
  status: 'active' | 'coming_soon'
  fulfilment: 'local' | 'ship'
  badge?: 'bestseller'
  featured?: boolean
  subscribable?: boolean
  order: number
  variants: SeedVariant[]
  en: LocalizedProduct
  hi: LocalizedProduct
}
type LocalizedProduct = {
  title: string
  secondaryName: string
  shortDescription: string
  description: ReturnType<typeof rt>
  highlights?: string[]
  process?: { title: string; text: string }[]
  ingredients?: string
  storage?: string
  faqs?: { question: string; answer: string }[]
}

const bilonaEn = [
  { title: 'Desi cow milk', text: 'Fresh milk from the Gir, Sahiwal, Tharparkar, Rathi and Kankrej cows on our farm.' },
  { title: 'Set into curd', text: 'The milk is boiled and set into dahi.' },
  { title: 'Hand-churned', text: 'The dahi is churned in a traditional bilona.' },
  { title: 'Makkhan', text: 'Butter (makkhan) is separated from the chaach.' },
  { title: 'Slow-cooked', text: 'The makkhan is heated slowly until it turns into golden ghee.' },
  { title: 'Filtered & packed', text: 'The ghee is filtered and packed in a glass jar.' },
]
const bilonaHi = [
  { title: 'देसी गाय का दूध', text: 'हमारे फार्म की गिर, साहीवाल, थारपारकर, राठी और कांकरेज गायों का ताज़ा दूध।' },
  { title: 'दही जमाना', text: 'दूध को उबालकर दही जमाया जाता है।' },
  { title: 'हाथ से मथना', text: 'दही को पारंपरिक बिलोने में मथा जाता है।' },
  { title: 'मक्खन', text: 'छाछ से मक्खन अलग किया जाता है।' },
  { title: 'धीमी आँच', text: 'मक्खन को धीमी आँच पर पकाकर सुनहरा घी बनाया जाता है।' },
  { title: 'छानकर पैकिंग', text: 'घी को छानकर काँच के जार में पैक किया जाता है।' },
]

const acharText = {
  en: {
    short: 'Rajasthan-special traditional achar, made in small batches and packed in a 500 g glass jar.',
    desc: rt([
      'A Rajasthan-special traditional achar from the Amrit Dairy kitchen, made in small batches the way it is made at home.',
      'Packed in a 500 g glass jar. Ships across India.',
    ]),
    storage: 'Keep the jar closed in a cool, dry place. Always use a clean, dry spoon.',
    faqs: [
      { question: 'Do you ship achar outside Sonipat?', answer: 'Yes. Achar ships across India by courier.' },
      { question: 'When will this achar be available?', answer: 'Tap "Notify me" and we will tell you as soon as it is back.' },
    ],
  },
  hi: {
    short: 'राजस्थानी पारंपरिक अचार, छोटे बैच में बना और 500 ग्राम काँच के जार में पैक।',
    desc: rt(['अमृत डेयरी की रसोई से राजस्थानी पारंपरिक अचार, घर जैसे तरीके से छोटे बैच में बना।', '500 ग्राम काँच के जार में पैक। पूरे भारत में भेजा जाता है।']),
    storage: 'जार को बंद करके ठंडी और सूखी जगह पर रखें। हमेशा साफ़ और सूखे चम्मच का इस्तेमाल करें।',
    faqs: [
      { question: 'क्या आप सोनीपत के बाहर अचार भेजते हैं?', answer: 'हाँ। अचार कूरियर से पूरे भारत में भेजा जाता है।' },
      { question: 'यह अचार कब उपलब्ध होगा?', answer: '"मुझे सूचित करें" दबाएँ, उपलब्ध होते ही हम आपको बताएँगे।' },
    ],
  },
}

const achar = (slug: string, order: number, image: string, en: string, hi: string): SeedProduct => ({
  slug,
  category: 'achar',
  image,
  status: 'coming_soon',
  fulfilment: 'ship',
  order,
  variants: [{ sku: `AD-${slug.toUpperCase()}-500G`.slice(0, 40), label: { en: '500 g Glass Jar', hi: '500 ग्राम काँच का जार' }, weightGrams: 500 }],
  en: { title: en, secondaryName: hi, shortDescription: acharText.en.short, description: acharText.en.desc, storage: acharText.en.storage, faqs: acharText.en.faqs },
  hi: { title: hi, secondaryName: en, shortDescription: acharText.hi.short, description: acharText.hi.desc, storage: acharText.hi.storage, faqs: acharText.hi.faqs },
})

const freshFaqEn = [
  { question: 'Where do you deliver this?', answer: 'Fresh products are delivered in our live Sonipat areas: Sector 23, Garhi Brahmnan, Mayur Vihar and Devilal Colony. Check your pincode on this page.' },
  { question: 'When will it be available?', answer: 'Tap "Notify me" and we will tell you the day it launches.' },
]
const freshFaqHi = [
  { question: 'यह कहाँ पहुँचाया जाता है?', answer: 'ताज़ा उत्पाद सोनीपत के हमारे चालू क्षेत्रों में पहुँचाए जाते हैं: सेक्टर 23, गढ़ी ब्राह्मणान, मयूर विहार और देवीलाल कॉलोनी। इस पेज पर अपना पिनकोड जाँचें।' },
  { question: 'यह कब उपलब्ध होगा?', answer: '"मुझे सूचित करें" दबाएँ, लॉन्च के दिन हम आपको बताएँगे।' },
]

const fresh = (
  slug: string,
  order: number,
  image: string,
  variant: SeedVariant,
  en: { title: string; sec: string; short: string; body: string[] },
  hi: { title: string; sec: string; short: string; body: string[] },
  opts: { subscribable?: boolean; featured?: boolean } = {},
): SeedProduct => ({
  slug,
  category: 'dairy',
  image,
  status: 'coming_soon',
  fulfilment: 'local',
  subscribable: opts.subscribable,
  featured: opts.featured,
  order,
  variants: [variant],
  en: { title: en.title, secondaryName: en.sec, shortDescription: en.short, description: rt(en.body), faqs: freshFaqEn },
  hi: { title: hi.title, secondaryName: hi.sec, shortDescription: hi.short, description: rt(hi.body), faqs: freshFaqHi },
})

export const products: SeedProduct[] = [
  {
    slug: 'desi-cow-golden-ghee',
    category: 'ghee',
    image: 'ghee.jpg',
    status: 'active',
    fulfilment: 'ship',
    badge: 'bestseller',
    featured: true,
    order: 1,
    variants: [
      { sku: 'AD-GHEE-1KG', label: { en: '1 kg Glass Jar', hi: '1 किलो काँच का जार' }, price: 3500, weightGrams: 1000, unit: { en: '₹350 / 100 g', hi: '₹350 / 100 ग्राम' } },
      { sku: 'AD-GHEE-5KG', label: { en: '5 kg Steel Kettle', hi: '5 किलो स्टील केतली' }, onDemand: true, weightGrams: 5000 },
      { sku: 'AD-GHEE-10KG', label: { en: '10 kg Steel Kettle', hi: '10 किलो स्टील केतली' }, onDemand: true, weightGrams: 10000 },
    ],
    en: {
      title: 'Amrit Desi Cow Golden Ghee',
      secondaryName: 'देसी गाय का बिलोना घी',
      shortDescription: 'Hand-made Bilona ghee from the milk of our own desi cows. 1 kg glass jar; 5 kg and 10 kg steel kettles on demand.',
      description: rt([
        'Amrit Golden Ghee is made on our farm near Garhi Brahmnan, Sonipat, from the milk of our own desi cows: Gir, Sahiwal, Tharparkar, Rathi and Kankrej.',
        'We make it the traditional Bilona way. The milk is set into curd, the curd is hand-churned into makkhan, and the makkhan is slowly heated until it turns into golden, aromatic ghee.',
        { h3: 'Packing' },
        { ul: ['1 kg glass jar', '5 kg and 10 kg steel kettles made on demand (weddings, festivals, temples, businesses)'] },
      ]),
      highlights: ['From our own ~250 desi cows', 'Traditional Bilona method (curd-churned)', 'Hand-made in small batches', 'Packed in glass, ships across India'],
      process: bilonaEn,
      ingredients: 'Desi cow milk fat (ghee)',
      storage: 'Store in a cool, dry place with the lid closed. Use a clean, dry spoon. No refrigeration needed.',
      faqs: [
        { question: 'What is Bilona ghee?', answer: 'Bilona ghee is made by setting milk into curd, hand-churning the curd to get makkhan, and slowly heating the makkhan into ghee. Many commercial ghees are made directly from cream instead.' },
        { question: 'Which cows is the milk from?', answer: 'From our own herd of about 250 desi cows (Gir, Sahiwal, Tharparkar, Rathi and Kankrej) on our farm in Sonipat.' },
        { question: 'Do you deliver ghee outside Sonipat?', answer: 'Yes. Ghee ships across India by courier. In our Sonipat areas it can also come with your local delivery.' },
        { question: 'Can I order 5 kg or 10 kg?', answer: 'Yes. Choose the 5 kg or 10 kg steel kettle and send a bulk request; we will confirm the price and date.' },
      ],
    },
    hi: {
      title: 'अमृत देसी गाय का गोल्डन घी',
      secondaryName: 'Desi Cow Bilona Ghee',
      shortDescription: 'हमारी अपनी देसी गायों के दूध से हाथ से बना बिलोना घी। 1 किलो काँच का जार; 5 और 10 किलो स्टील केतली ऑर्डर पर।',
      description: rt([
        'अमृत गोल्डन घी गढ़ी ब्राह्मणान, सोनीपत के पास हमारे फार्म पर, हमारी अपनी देसी गायों (गिर, साहीवाल, थारपारकर, राठी और कांकरेज) के दूध से बनता है।',
        'हम इसे पारंपरिक बिलोना विधि से बनाते हैं। दूध से दही जमाया जाता है, दही को हाथ से मथकर मक्खन निकाला जाता है, और मक्खन को धीमी आँच पर पकाकर सुनहरा, खुशबूदार घी बनता है।',
        { h3: 'पैकिंग' },
        { ul: ['1 किलो काँच का जार', '5 किलो और 10 किलो स्टील केतली ऑर्डर पर (शादी, त्योहार, मंदिर, व्यापार के लिए)'] },
      ]),
      highlights: ['हमारी अपनी ~250 देसी गायों से', 'पारंपरिक बिलोना विधि (दही मथकर)', 'छोटे बैच में हाथ से बना', 'काँच में पैक, पूरे भारत में डिलीवरी'],
      process: bilonaHi,
      ingredients: 'देसी गाय के दूध का घी',
      storage: 'ढक्कन बंद करके ठंडी और सूखी जगह पर रखें। साफ़ और सूखे चम्मच का इस्तेमाल करें। फ्रिज की ज़रूरत नहीं।',
      faqs: [
        { question: 'बिलोना घी क्या है?', answer: 'बिलोना घी में दूध से दही जमाया जाता है, दही को हाथ से मथकर मक्खन निकाला जाता है और मक्खन को धीमी आँच पर पकाकर घी बनाया जाता है। कई व्यावसायिक घी सीधे मलाई से बनाए जाते हैं।' },
        { question: 'दूध किन गायों का है?', answer: 'सोनीपत में हमारे फार्म पर लगभग 250 देसी गायों (गिर, साहीवाल, थारपारकर, राठी और कांकरेज) के अपने झुंड का।' },
        { question: 'क्या आप सोनीपत के बाहर घी भेजते हैं?', answer: 'हाँ। घी कूरियर से पूरे भारत में भेजा जाता है। सोनीपत के हमारे क्षेत्रों में यह आपकी स्थानीय डिलीवरी के साथ भी आ सकता है।' },
        { question: 'क्या मैं 5 या 10 किलो ऑर्डर कर सकता हूँ?', answer: 'हाँ। 5 या 10 किलो स्टील केतली चुनें और थोक अनुरोध भेजें; हम कीमत और तारीख़ की पुष्टि करेंगे।' },
      ],
    },
  },
  {
    slug: 'raw-forest-honey',
    category: 'pantry',
    image: 'honey.jpg',
    status: 'active',
    fulfilment: 'ship',
    badge: 'bestseller',
    featured: true,
    order: 2,
    variants: [{ sku: 'AD-HONEY-500G', label: { en: '500 g Glass Jar', hi: '500 ग्राम काँच का जार' }, price: 1500, weightGrams: 500 }],
    en: {
      title: 'Amrit Raw Forest Honey',
      secondaryName: 'शुद्ध जंगली शहद',
      shortDescription: 'Pure, natural, unprocessed raw forest honey in a glass jar.',
      description: rt(['Raw forest honey with a rich aroma and rich taste, packed in a glass jar by Amrit Dairy.', 'Ships across India.']),
      highlights: ['Raw and unprocessed', 'Rich aroma, rich taste', 'Packed in glass'],
      storage: 'Store at room temperature with the lid closed. Natural honey may crystallise; this is normal. Warm the jar gently in water to liquefy.',
      faqs: [{ question: 'Why has my honey crystallised?', answer: 'Crystallisation is natural in raw honey. Place the closed jar in warm (not boiling) water for a few minutes.' }],
    },
    hi: {
      title: 'अमृत कच्चा जंगली शहद',
      secondaryName: 'Raw Forest Honey',
      shortDescription: 'शुद्ध, प्राकृतिक, बिना प्रोसेस किया जंगली शहद, काँच के जार में।',
      description: rt(['भरपूर खुशबू और स्वाद वाला कच्चा जंगली शहद, अमृत डेयरी द्वारा काँच के जार में पैक।', 'पूरे भारत में भेजा जाता है।']),
      highlights: ['कच्चा और बिना प्रोसेस किया', 'भरपूर खुशबू और स्वाद', 'काँच में पैक'],
      storage: 'ढक्कन बंद करके कमरे के तापमान पर रखें। असली शहद जम सकता है, यह सामान्य है। जार को हल्के गर्म पानी में रखकर पिघलाएँ।',
      faqs: [{ question: 'मेरा शहद जम क्यों गया?', answer: 'कच्चे शहद का जमना प्राकृतिक है। बंद जार को कुछ मिनट हल्के गर्म (उबलते नहीं) पानी में रखें।' }],
    },
  },
  fresh(
    'desi-cow-milk',
    3,
    'milk.jpg',
    { sku: 'AD-MILK-1L', label: { en: '1 L Glass Bottle', hi: '1 लीटर काँच की बोतल' }, price: 100 },
    { title: 'Amrit Desi Cow Milk', sec: 'देसी गाय का ताज़ा दूध', short: 'Fresh desi cow milk from our farm in a 1 L glass bottle. Daily subscription in Sonipat.', body: ['Fresh milk from our own desi cows, delivered in a 1 litre glass bottle.', 'Set your quantity once and we deliver every morning in our Sonipat areas.'] },
    { title: 'अमृत देसी गाय का दूध', sec: 'Desi Cow Milk', short: 'हमारे फार्म से देसी गाय का ताज़ा दूध, 1 लीटर काँच की बोतल में। सोनीपत में रोज़ का सब्सक्रिप्शन।', body: ['हमारी अपनी देसी गायों का ताज़ा दूध, 1 लीटर काँच की बोतल में।', 'एक बार मात्रा तय करें, हम सोनीपत के हमारे क्षेत्रों में हर सुबह पहुँचाएँगे।'] },
    { subscribable: true, featured: true },
  ),
  fresh(
    'matka-dahi',
    4,
    'curd.jpg',
    { sku: 'AD-DAHI-500G', label: { en: '500 g Clay Matka', hi: '500 ग्राम मिट्टी का मटका' }, weightGrams: 500 },
    { title: 'Amrit Matka Dahi (Curd)', sec: 'मटका दही', short: 'Thick curd set in a traditional clay matka.', body: ['Curd set the traditional way in a clay matka, from the milk of our own desi cows.'] },
    { title: 'अमृत मटका दही', sec: 'Matka Dahi (Curd)', short: 'पारंपरिक मिट्टी के मटके में जमा गाढ़ा दही।', body: ['हमारी अपनी देसी गायों के दूध से, मिट्टी के मटके में पारंपरिक तरीके से जमाया दही।'] },
    { subscribable: true, featured: true },
  ),
  fresh(
    'buttermilk',
    5,
    'buttermilk.jpg',
    { sku: 'AD-CHAACH-1L', label: { en: '1 L Bottle', hi: '1 लीटर बोतल' } },
    { title: 'Amrit Buttermilk', sec: 'छाछ', short: 'Traditional chaach from our Bilona process.', body: ['Chaach (buttermilk) from our farm, the traditional drink of Haryana.'] },
    { title: 'अमृत छाछ', sec: 'Buttermilk', short: 'हमारी बिलोना प्रक्रिया से पारंपरिक छाछ।', body: ['हमारे फार्म की छाछ, हरियाणा का पारंपरिक पेय।'] },
    { subscribable: true },
  ),
  fresh(
    'paneer',
    6,
    'paneer.jpg',
    { sku: 'AD-PANEER-500G', label: { en: '500 g', hi: '500 ग्राम' }, weightGrams: 500 },
    { title: 'Amrit Paneer', sec: 'पनीर', short: 'Fresh paneer made from desi cow milk.', body: ['Soft, fresh paneer made from the milk of our own desi cows.'] },
    { title: 'अमृत पनीर', sec: 'Paneer', short: 'देसी गाय के दूध से बना ताज़ा पनीर।', body: ['हमारी अपनी देसी गायों के दूध से बना नरम, ताज़ा पनीर।'] },
  ),
  fresh(
    'butter',
    7,
    'placeholder-dairy.jpg',
    { sku: 'AD-BUTTER', label: { en: 'Pack', hi: 'पैक' } },
    { title: 'Amrit Butter', sec: 'मक्खन', short: 'White makkhan from our farm.', body: ['Fresh white makkhan from the milk of our desi cows.'] },
    { title: 'अमृत मक्खन', sec: 'Butter', short: 'हमारे फार्म का सफ़ेद मक्खन।', body: ['हमारी देसी गायों के दूध से ताज़ा सफ़ेद मक्खन।'] },
  ),
  fresh(
    'cream',
    8,
    'placeholder-dairy.jpg',
    { sku: 'AD-CREAM', label: { en: 'Pack', hi: 'पैक' } },
    { title: 'Amrit Cream (Malai)', sec: 'मलाई', short: 'Fresh malai from desi cow milk.', body: ['Fresh cream (malai) from the milk of our desi cows.'] },
    { title: 'अमृत मलाई', sec: 'Cream', short: 'देसी गाय के दूध की ताज़ा मलाई।', body: ['हमारी देसी गायों के दूध की ताज़ा मलाई।'] },
  ),
  {
    slug: 'pure-sarso-oil',
    category: 'pantry',
    image: 'mustard-oil.jpg',
    status: 'coming_soon',
    fulfilment: 'ship',
    order: 9,
    variants: [{ sku: 'AD-SARSO-1L', label: { en: '1 L Bottle', hi: '1 लीटर बोतल' } }],
    en: {
      title: 'Amrit Pure Sarso (Mustard) Oil',
      secondaryName: 'शुद्ध सरसों तेल',
      shortDescription: 'Pure mustard oil for everyday Indian cooking.',
      description: rt(['Pure mustard oil (sarso ka tel) from Amrit Dairy, for everyday cooking and achar.']),
      faqs: [{ question: 'When will mustard oil be available?', answer: 'Tap "Notify me" and we will tell you as soon as it launches.' }],
    },
    hi: {
      title: 'अमृत शुद्ध सरसों तेल',
      secondaryName: 'Pure Sarso (Mustard) Oil',
      shortDescription: 'रोज़ के भारतीय खाने के लिए शुद्ध सरसों का तेल।',
      description: rt(['अमृत डेयरी का शुद्ध सरसों तेल, रोज़ के खाने और अचार के लिए।']),
      faqs: [{ question: 'सरसों तेल कब उपलब्ध होगा?', answer: '"मुझे सूचित करें" दबाएँ, लॉन्च होते ही हम आपको बताएँगे।' }],
    },
  },
  achar('ker-sangri-achar', 10, 'placeholder-achar.jpg', 'Ker Sangri Achar', 'केर सांगरी का अचार'),
  achar('kaccha-mango-achar', 11, 'kaccha-mango-achar.jpg', 'Kaccha Mango Achar', 'कच्चे आम का अचार'),
  achar('marwadi-mix-veg-achar', 12, 'mix-veg-achar.jpg', 'Marwadi Mix Veg Achar', 'मारवाड़ी मिक्स वेज अचार'),
  achar('garlic-achar', 13, 'garlic-achar.jpg', 'Garlic Achar', 'लहसुन का अचार'),
  achar('green-chilli-achar', 14, 'green-chilli-achar.jpg', 'Green Chilli Achar', 'हरी मिर्च का अचार'),
  achar('sweet-lemon-achar', 15, 'lemon-achar.jpg', 'Sweet Lemon Achar', 'मीठा नींबू अचार'),
  achar('spicy-lemon-achar', 16, 'placeholder-achar.jpg', 'Spicy Lemon Achar', 'तीखा नींबू अचार'),
  achar('red-chilli-stuffed-achar', 17, 'placeholder-achar.jpg', 'Red Chilli Stuffed Achar', 'भरवां लाल मिर्च का अचार'),
  achar('karela-achar', 18, 'placeholder-achar.jpg', 'Karela Achar', 'करेले का अचार'),
  achar('ker-achar', 19, 'placeholder-achar.jpg', 'Ker Achar', 'केर का अचार'),
  achar('mango-sweet-chatni', 20, 'placeholder-achar.jpg', 'Mango Sweet Chatni', 'आम की मीठी चटनी'),
]

export const categories = [
  { slug: 'ghee', order: 1, image: 'hero-ghee.jpg', en: { title: 'Desi Ghee', secondaryTitle: 'देसी घी', intro: 'Hand-made Bilona ghee from the milk of our own desi cows. Ships across India.' }, hi: { title: 'देसी घी', secondaryTitle: 'Desi Ghee', intro: 'हमारी अपनी देसी गायों के दूध से हाथ से बना बिलोना घी। पूरे भारत में डिलीवरी।' } },
  { slug: 'dairy', order: 2, image: 'cat-dairy.jpg', en: { title: 'Dairy Products', secondaryTitle: 'डेयरी उत्पाद', intro: 'Fresh milk, matka dahi, chaach, paneer, butter and cream from our farm, delivered in Sonipat.' }, hi: { title: 'डेयरी उत्पाद', secondaryTitle: 'Dairy Products', intro: 'हमारे फार्म से ताज़ा दूध, मटका दही, छाछ, पनीर, मक्खन और मलाई, सोनीपत में डिलीवरी।' } },
  { slug: 'achar', order: 3, image: 'cat-achar.jpg', en: { title: 'Achar Collection', secondaryTitle: 'अचार संग्रह', intro: 'Rajasthan-special traditional achars in 500 g glass jars. Ships across India.' }, hi: { title: 'अचार संग्रह', secondaryTitle: 'Achar Collection', intro: '500 ग्राम काँच के जार में राजस्थानी पारंपरिक अचार। पूरे भारत में डिलीवरी।' } },
  { slug: 'pantry', order: 4, image: 'cat-pantry.jpg', en: { title: 'Honey & Oil', secondaryTitle: 'शहद और तेल', intro: 'Raw forest honey and pure mustard oil for your kitchen.' }, hi: { title: 'शहद और तेल', secondaryTitle: 'Honey & Oil', intro: 'आपकी रसोई के लिए कच्चा जंगली शहद और शुद्ध सरसों तेल।' } },
]
