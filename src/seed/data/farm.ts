import { rt } from '../lexical'

/**
 * Starter content for Departments and Facilities (Doc 05 §5.11–5.12).
 * Written from what the live site states (own ~250-cow herd, Bilona ghee,
 * quality check, packaging, local delivery). No invented numbers: the owner
 * should add verified facts (team heads, capacities) in the admin.
 */
type Loc = { title: string; summary: string; body: string[]; list: string[]; standards?: { title: string; text: string }[] }
type Dept = { slug: string; icon: string; order: number; products?: string[]; en: Loc; hi: Loc }

export const departments: Dept[] = [
  {
    slug: 'gaushala-herd-care', icon: 'cow', order: 1,
    en: { title: 'Gaushala & Herd Care', summary: 'Looks after our herd of about 250 desi cows every day.', body: ['Everything starts with our cows. The herd-care team looks after the Gir, Sahiwal, Tharparkar, Rathi and Kankrej cows that live on our farm.'], list: ['Feeding and fresh drinking water', 'Clean, shaded shelters', 'Daily health observation and veterinary care', 'Care of calves'], standards: [{ title: 'Our own cows', text: 'Milk comes only from cows we raise ourselves, not from outside suppliers.' }, { title: 'Daily attention', text: 'Every cow is observed daily, and a vet is called whenever needed.' }] },
    hi: { title: 'गौशाला और पशु देखभाल', summary: 'हमारी लगभग 250 देसी गायों की रोज़ देखभाल करता है।', body: ['सब कुछ हमारी गायों से शुरू होता है। पशु देखभाल टीम हमारे फार्म पर रहने वाली गिर, साहीवाल, थारपारकर, राठी और कांकरेज गायों की देखभाल करती है।'], list: ['चारा और साफ़ पीने का पानी', 'साफ़, छायादार आश्रय', 'रोज़ स्वास्थ्य निगरानी और पशु-चिकित्सा', 'बछड़ों की देखभाल'], standards: [{ title: 'हमारी अपनी गायें', text: 'दूध सिर्फ़ हमारी पाली हुई गायों से आता है, किसी बाहरी सप्लायर से नहीं।' }, { title: 'रोज़ ध्यान', text: 'हर गाय को रोज़ देखा जाता है, और ज़रूरत पड़ने पर पशु-चिकित्सक बुलाया जाता है।' }] },
  },
  {
    slug: 'milking-collection', icon: 'milk', order: 2,
    en: { title: 'Milking & Collection', summary: 'Milks the cows and handles the fresh milk with care.', body: ['This team milks our cows and makes sure the fresh milk is handled cleanly from the first minute.'], list: ['Milking the herd', 'Handling fresh milk in clean steel vessels', 'Sending milk on for quality check'] },
    hi: { title: 'दुहाई और संग्रह', summary: 'गायों को दुहता है और ताज़ा दूध को सावधानी से संभालता है।', body: ['यह टीम हमारी गायों को दुहती है और यह सुनिश्चित करती है कि ताज़ा दूध पहले मिनट से साफ़-सुथरे तरीके से संभाला जाए।'], list: ['झुंड की दुहाई', 'साफ़ स्टील के बर्तनों में ताज़ा दूध संभालना', 'दूध को गुणवत्ता जाँच के लिए भेजना'] },
  },
  {
    slug: 'bilona-ghee-unit', icon: 'ghee', order: 3, products: ['desi-cow-golden-ghee'],
    en: { title: 'Bilona Ghee Unit', summary: 'Makes Amrit Golden Ghee by the traditional Bilona method.', body: ['Our ghee is made the traditional Bilona way: milk is set into curd, the curd is churned into makkhan, and the makkhan is slowly heated into golden ghee.'], list: ['Setting curd from our own milk', 'Hand-churning curd in a bilona', 'Slow-cooking makkhan into ghee', 'Filtering and filling glass jars and steel kettles'] },
    hi: { title: 'बिलोना घी इकाई', summary: 'पारंपरिक बिलोना विधि से अमृत गोल्डन घी बनाती है।', body: ['हमारा घी पारंपरिक बिलोना विधि से बनता है: दूध से दही जमाया जाता है, दही को मथकर मक्खन निकाला जाता है, और मक्खन को धीमी आँच पर पकाकर सुनहरा घी बनता है।'], list: ['अपने दूध से दही जमाना', 'बिलोने में दही को हाथ से मथना', 'मक्खन को धीमी आँच पर पकाना', 'छानकर काँच के जार और स्टील केतली में भरना'] },
  },
  {
    slug: 'achar-kitchen', icon: 'jar', order: 4,
    en: { title: 'Achar Kitchen', summary: 'Makes our Rajasthan-special traditional achars in small batches.', body: ['The achar kitchen prepares our Rajasthan-special achars, such as Ker Sangri, Kaccha Mango and Garlic, in small batches.'], list: ['Preparing vegetables and spices', 'Making achar in small batches', 'Filling 500 g glass jars'] },
    hi: { title: 'अचार रसोई', summary: 'हमारे राजस्थानी पारंपरिक अचार छोटे बैच में बनाती है।', body: ['अचार रसोई हमारे राजस्थानी अचार, जैसे केर सांगरी, कच्चा आम और लहसुन, छोटे बैच में तैयार करती है।'], list: ['सब्ज़ियाँ और मसाले तैयार करना', 'छोटे बैच में अचार बनाना', '500 ग्राम काँच के जार भरना'] },
  },
  {
    slug: 'quality-check', icon: 'lab', order: 5,
    en: { title: 'Quality Check', summary: 'Checks milk and products before they are packed.', body: ['Quality check is a fixed step in our journey: Farm → Cows → Milking → Quality Check → Packaging → Your Home.'], list: ['Checking fresh milk', 'Checking each batch of ghee and products', 'Keeping batch records'] },
    hi: { title: 'गुणवत्ता जाँच', summary: 'पैकिंग से पहले दूध और उत्पादों की जाँच करता है।', body: ['गुणवत्ता जाँच हमारे सफ़र का तय कदम है: फार्म → गायें → दुहाई → गुणवत्ता जाँच → पैकिंग → आपका घर।'], list: ['ताज़ा दूध की जाँच', 'घी और उत्पादों के हर बैच की जाँच', 'बैच का रिकॉर्ड रखना'] },
  },
  {
    slug: 'packaging-dispatch', icon: 'box', order: 6,
    en: { title: 'Packaging & Dispatch', summary: 'Packs orders in glass and clay and sends them out safely.', body: ['We pack in glass bottles, glass jars and clay matkas, and prepare every order for local delivery or courier shipping.'], list: ['Packing glass jars and bottles safely', 'Preparing online and WhatsApp orders', 'Handing parcels to couriers for shipping across India'] },
    hi: { title: 'पैकिंग और डिस्पैच', summary: 'ऑर्डर को काँच और मिट्टी में पैक करके सुरक्षित भेजता है।', body: ['हम काँच की बोतलों, काँच के जार और मिट्टी के मटकों में पैक करते हैं, और हर ऑर्डर को स्थानीय डिलीवरी या कूरियर के लिए तैयार करते हैं।'], list: ['काँच के जार और बोतलें सुरक्षित पैक करना', 'ऑनलाइन और WhatsApp ऑर्डर तैयार करना', 'पूरे भारत के लिए पार्सल कूरियर को सौंपना'] },
  },
  {
    slug: 'delivery-logistics', icon: 'truck', order: 7,
    en: { title: 'Delivery & Logistics', summary: 'Brings fresh products from our farm to homes in Sonipat.', body: ['Our delivery team brings fresh products directly from the farm to homes in our live Sonipat areas.'], list: ['Daily local delivery routes', 'Subscription deliveries', 'Opening new areas based on customer demand'] },
    hi: { title: 'डिलीवरी और लॉजिस्टिक्स', summary: 'हमारे फार्म से सोनीपत के घरों तक ताज़ा उत्पाद पहुँचाता है।', body: ['हमारी डिलीवरी टीम ताज़ा उत्पाद सीधे फार्म से सोनीपत के हमारे चालू क्षेत्रों के घरों तक पहुँचाती है।'], list: ['रोज़ के स्थानीय डिलीवरी रूट', 'सब्सक्रिप्शन डिलीवरी', 'ग्राहकों की माँग के आधार पर नए क्षेत्र शुरू करना'] },
  },
  {
    slug: 'customer-care', icon: 'support', order: 8,
    en: { title: 'Customer Care', summary: 'Answers your calls and WhatsApp messages about orders and cows.', body: ['Our customer-care team takes orders and answers questions on WhatsApp and phone, including cow buy/sell enquiries.'], list: ['Orders and general enquiries: +91 77000 04877', 'Cow buy/sell enquiries: +91 80595 93666', 'Order updates and support'] },
    hi: { title: 'ग्राहक सेवा', summary: 'ऑर्डर और गायों के बारे में आपके कॉल और WhatsApp संदेशों का जवाब देता है।', body: ['हमारी ग्राहक सेवा टीम WhatsApp और फ़ोन पर ऑर्डर लेती है और सवालों के जवाब देती है, गाय खरीद/बिक्री पूछताछ सहित।'], list: ['ऑर्डर और सामान्य पूछताछ: +91 77000 04877', 'गाय खरीद/बिक्री पूछताछ: +91 80595 93666', 'ऑर्डर अपडेट और सहायता'] },
  },
]

type FLoc = { title: string; summary: string; body: string[]; steps?: { title: string; text: string }[]; hygiene?: string[]; specs?: { label: string; value: string }[] }
type Fac = { slug: string; icon: string; order: number; department: string; products?: string[]; image?: string; en: FLoc; hi: FLoc }

export const facilities: Fac[] = [
  {
    slug: 'desi-cow-farm', icon: 'leaf', order: 1, department: 'gaushala-herd-care', image: 'cat-cow.jpg',
    en: { title: 'Our Desi Cow Farm', summary: 'Our farm near Anup Sports Village, Rajhbhaya, Garhi Brahmnan, Sonipat.', body: ['Our cows live with us on our own farm near Rajhbhaya, Garhi Brahmnan, Sonipat, Haryana - 131001. This is where every product begins.'], specs: [{ label: 'Desi cows', value: '~250' }, { label: 'Breeds', value: 'Gir, Sahiwal, Tharparkar, Rathi, Kankrej' }, { label: 'Location', value: 'Garhi Brahmnan, Sonipat' }] },
    hi: { title: 'हमारा देसी गाय फार्म', summary: 'अनूप स्पोर्ट्स विलेज के पास, राजभाया, गढ़ी ब्राह्मणान, सोनीपत में हमारा फार्म।', body: ['हमारी गायें राजभाया, गढ़ी ब्राह्मणान, सोनीपत, हरियाणा - 131001 के पास हमारे अपने फार्म पर हमारे साथ रहती हैं। हर उत्पाद यहीं से शुरू होता है।'], specs: [{ label: 'देसी गायें', value: '~250' }, { label: 'नस्लें', value: 'गिर, साहीवाल, थारपारकर, राठी, कांकरेज' }, { label: 'स्थान', value: 'गढ़ी ब्राह्मणान, सोनीपत' }] },
  },
  {
    slug: 'cow-shelters', icon: 'cow', order: 2, department: 'gaushala-herd-care',
    en: { title: 'Cow Shelters', summary: 'Where our herd rests, eats and is cared for.', body: ['The shelters give our cows shade, rest, feed and fresh water, and make daily care easy for our team.'], hygiene: ['Regular cleaning of sheds', 'Fresh drinking water', 'Separate care for calves'] },
    hi: { title: 'गौशाला', summary: 'जहाँ हमारा झुंड आराम करता है, खाता है और जिसकी देखभाल होती है।', body: ['गौशाला हमारी गायों को छाया, आराम, चारा और साफ़ पानी देती है, और हमारी टीम के लिए रोज़ की देखभाल आसान बनाती है।'], hygiene: ['शेड की नियमित सफ़ाई', 'साफ़ पीने का पानी', 'बछड़ों की अलग देखभाल'] },
  },
  {
    slug: 'milking-area', icon: 'milk', order: 3, department: 'milking-collection',
    en: { title: 'Milking Area', summary: 'Where our cows are milked and fresh milk is collected.', body: ['Fresh milk is collected here and moved on for quality check and processing.'], steps: [{ title: 'Milking', text: 'The cows are milked.' }, { title: 'Collection', text: 'Milk is collected in clean steel vessels.' }, { title: 'Quality check', text: 'Milk moves on to be checked.' }], hygiene: ['Clean steel vessels', 'Clean hands and udders before milking'] },
    hi: { title: 'दुहाई क्षेत्र', summary: 'जहाँ हमारी गायों को दुहा जाता है और ताज़ा दूध इकट्ठा होता है।', body: ['ताज़ा दूध यहाँ इकट्ठा होता है और गुणवत्ता जाँच व प्रोसेसिंग के लिए आगे भेजा जाता है।'], steps: [{ title: 'दुहाई', text: 'गायों को दुहा जाता है।' }, { title: 'संग्रह', text: 'दूध साफ़ स्टील के बर्तनों में इकट्ठा होता है।' }, { title: 'गुणवत्ता जाँच', text: 'दूध जाँच के लिए आगे जाता है।' }], hygiene: ['साफ़ स्टील के बर्तन', 'दुहाई से पहले हाथ और थन साफ़'] },
  },
  {
    slug: 'bilona-ghee-kitchen', icon: 'ghee', order: 4, department: 'bilona-ghee-unit', products: ['desi-cow-golden-ghee'], image: 'hero-ghee.jpg',
    en: { title: 'Bilona Ghee Kitchen', summary: 'Where curd is hand-churned and slow-cooked into Amrit Golden Ghee.', body: ['This is where Amrit Golden Ghee is made, the traditional Bilona way.'], steps: [{ title: 'Curd', text: 'Milk is set into dahi.' }, { title: 'Churning', text: 'Dahi is churned in a bilona.' }, { title: 'Makkhan', text: 'Makkhan is separated from chaach.' }, { title: 'Ghee', text: 'Makkhan is slow-cooked, filtered and packed in glass.' }], hygiene: ['Steel utensils', 'Small batches', 'Clean, dry packing'] },
    hi: { title: 'बिलोना घी रसोई', summary: 'जहाँ दही को हाथ से मथकर और धीमी आँच पर पकाकर अमृत गोल्डन घी बनता है।', body: ['यहीं पारंपरिक बिलोना विधि से अमृत गोल्डन घी बनता है।'], steps: [{ title: 'दही', text: 'दूध से दही जमाया जाता है।' }, { title: 'मथना', text: 'दही को बिलोने में मथा जाता है।' }, { title: 'मक्खन', text: 'छाछ से मक्खन अलग होता है।' }, { title: 'घी', text: 'मक्खन को धीमी आँच पर पकाकर, छानकर काँच में पैक किया जाता है।' }], hygiene: ['स्टील के बर्तन', 'छोटे बैच', 'साफ़ और सूखी पैकिंग'] },
  },
  {
    slug: 'achar-kitchen', icon: 'jar', order: 5, department: 'achar-kitchen', image: 'cat-achar.jpg',
    en: { title: 'Achar Kitchen', summary: 'Where our Rajasthan-special achars are made in small batches.', body: ['Our achars are prepared here in small batches and packed in 500 g glass jars.'], hygiene: ['Clean, dry jars', 'Small batches'] },
    hi: { title: 'अचार रसोई', summary: 'जहाँ हमारे राजस्थानी अचार छोटे बैच में बनते हैं।', body: ['हमारे अचार यहाँ छोटे बैच में तैयार होकर 500 ग्राम काँच के जार में पैक होते हैं।'], hygiene: ['साफ़ और सूखे जार', 'छोटे बैच'] },
  },
  {
    slug: 'packing-dispatch-centre', icon: 'box', order: 6, department: 'packaging-dispatch',
    en: { title: 'Packing & Dispatch Centre', summary: 'Where orders are packed for local delivery and courier shipping.', body: ['Every online and WhatsApp order is packed here, whether it goes to a Sonipat home or across India.'], steps: [{ title: 'Order received', text: 'Online or WhatsApp.' }, { title: 'Packed', text: 'Glass and clay are packed safely.' }, { title: 'Dispatched', text: 'Local delivery or courier.' }] },
    hi: { title: 'पैकिंग और डिस्पैच केंद्र', summary: 'जहाँ ऑर्डर स्थानीय डिलीवरी और कूरियर के लिए पैक होते हैं।', body: ['हर ऑनलाइन और WhatsApp ऑर्डर यहीं पैक होता है, चाहे वह सोनीपत के घर जाए या पूरे भारत में।'], steps: [{ title: 'ऑर्डर मिला', text: 'ऑनलाइन या WhatsApp पर।' }, { title: 'पैक किया', text: 'काँच और मिट्टी के बर्तन सुरक्षित पैक।' }, { title: 'भेजा गया', text: 'स्थानीय डिलीवरी या कूरियर।' }] },
  },
]

export const deptBody = (l: Loc) => rt(l.body)
export const facBody = (l: FLoc) => rt(l.body)
