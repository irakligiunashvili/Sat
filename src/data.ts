import { uid } from './format'
import type { CategoryId, Destination, Order, Place, Product, User } from './types'

export const photo = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

export const countries = [
  {
    id: 'ge',
    name: 'Georgia',
    currency: '₾',
    zoom: 8,
    start: { lat: 41.7151, lng: 44.8271, label: 'Tbilisi' },
  },
  {
    id: 'it',
    name: 'Italy',
    currency: '€',
    zoom: 9,
    start: { lat: 43.7696, lng: 11.2558, label: 'Florence' },
  },
  {
    id: 'fr',
    name: 'France',
    currency: '€',
    zoom: 9,
    start: { lat: 43.5297, lng: 5.4474, label: 'Aix-en-Provence' },
  },
  {
    id: 'es',
    name: 'Spain',
    currency: '€',
    zoom: 10,
    start: { lat: 42.465, lng: -2.445, label: 'Logroño' },
  },
  {
    id: 'gr',
    name: 'Greece',
    currency: '€',
    zoom: 9,
    start: { lat: 37.5679, lng: 22.8074, label: 'Nafplio' },
  },
  {
    id: 'pt',
    name: 'Portugal',
    currency: '€',
    zoom: 10,
    start: { lat: 41.163, lng: -7.789, label: 'Peso da Régua' },
  },
  {
    id: 'am',
    name: 'Armenia',
    currency: '֏',
    zoom: 8,
    start: { lat: 40.1772, lng: 44.5035, label: 'Yerevan' },
  },
  {
    id: 'tr',
    name: 'Turkey',
    currency: '₺',
    zoom: 9,
    start: { lat: 38.4237, lng: 27.1428, label: 'Izmir' },
  },
  {
    id: 'md',
    name: 'Moldova',
    currency: 'MDL',
    zoom: 8,
    start: { lat: 47.0105, lng: 28.8638, label: 'Chișinău' },
  },
] as const

export type CountryId = (typeof countries)[number]['id']

export function countryById(id: string) {
  return countries.find((c) => c.id === id) ?? countries[0]
}

export const areas: Record<string, { id: string; name: string; lat: number; lng: number }[]> = {
  ge: [
    { id: 'kakheti', name: 'Kakheti', lat: 41.9, lng: 45.45 },
    { id: 'kartli', name: 'Kartli', lat: 41.98, lng: 44.2 },
    { id: 'imereti', name: 'Imereti', lat: 42.27, lng: 42.7 },
    { id: 'racha', name: 'Racha', lat: 42.52, lng: 43.15 },
    { id: 'svaneti', name: 'Svaneti', lat: 43.04, lng: 42.73 },
    { id: 'adjara', name: 'Adjara', lat: 41.64, lng: 41.67 },
    { id: 'samtskhe', name: 'Samtskhe', lat: 41.84, lng: 43.39 },
    { id: 'kazbegi', name: 'Kazbegi', lat: 42.66, lng: 44.64 },
  ],
  it: [
    { id: 'tuscany', name: 'Tuscany', lat: 43.55, lng: 11.3 },
    { id: 'piedmont', name: 'Piedmont', lat: 44.7, lng: 8.03 },
    { id: 'emilia', name: 'Emilia', lat: 44.49, lng: 11.34 },
    { id: 'sicily', name: 'Sicily', lat: 37.6, lng: 14.02 },
  ],
  fr: [
    { id: 'provence', name: 'Provence', lat: 43.6, lng: 5.4 },
    { id: 'loire', name: 'Loire', lat: 47.39, lng: 0.68 },
    { id: 'bourgogne', name: 'Burgundy', lat: 47.02, lng: 4.83 },
    { id: 'alsace', name: 'Alsace', lat: 48.3, lng: 7.4 },
  ],
  es: [
    { id: 'rioja', name: 'Rioja', lat: 42.5, lng: -2.6 },
    { id: 'valencia', name: 'Valencia', lat: 39.47, lng: -0.38 },
    { id: 'andalucia', name: 'Andalucía', lat: 37.39, lng: -5.99 },
    { id: 'galicia', name: 'Galicia', lat: 42.88, lng: -8.54 },
  ],
  gr: [
    { id: 'peloponnese', name: 'Peloponnese', lat: 37.6, lng: 22.4 },
    { id: 'crete', name: 'Crete', lat: 35.24, lng: 24.81 },
    { id: 'macedonia', name: 'Macedonia', lat: 40.64, lng: 22.94 },
  ],
  pt: [
    { id: 'douro', name: 'Douro', lat: 41.16, lng: -7.7 },
    { id: 'alentejo', name: 'Alentejo', lat: 38.57, lng: -7.91 },
    { id: 'minho', name: 'Minho', lat: 41.55, lng: -8.42 },
  ],
  am: [
    { id: 'vayots', name: 'Vayots Dzor', lat: 39.76, lng: 45.33 },
    { id: 'aragatsotn', name: 'Aragatsotn', lat: 40.4, lng: 44.37 },
    { id: 'tavush', name: 'Tavush', lat: 40.88, lng: 45.14 },
  ],
  tr: [
    { id: 'aegean', name: 'Aegean', lat: 38.4, lng: 27.1 },
    { id: 'cappadocia', name: 'Cappadocia', lat: 38.64, lng: 34.83 },
    { id: 'blacksea', name: 'Black Sea', lat: 41.0, lng: 39.72 },
  ],
  md: [
    { id: 'chisinau', name: 'Chișinău', lat: 47.01, lng: 28.86 },
    { id: 'orhei', name: 'Orhei', lat: 47.33, lng: 28.93 },
    { id: 'causeni', name: 'Căușeni', lat: 46.64, lng: 29.41 },
    { id: 'stefan', name: 'Ștefan Vodă', lat: 46.52, lng: 29.8 },
    { id: 'codru', name: 'Codru', lat: 46.98, lng: 28.78 },
    { id: 'balti', name: 'Bălți', lat: 47.76, lng: 27.93 },
  ],
}

export const journeys: (Destination & { country: string })[] = [
{"country": "md", "label": "Far north village road", "detail": "Cheese, meadow honey and warm bread · 3 stops", "lat": 48.267, "lng": 26.724, "stopIds": ["country-edinet", "country-briceni", "country-lipcani"]},
{"country": "md", "label": "Western orchard escape", "detail": "Fruit, forest honey and village pastries · 3 stops", "lat": 47.208, "lng": 27.8, "stopIds": ["country-calarasi", "country-cornesti", "country-ungheni"]},
{"country": "md", "label": "Prut valley picnic", "detail": "Bread, honey and cheese · 3 stops", "lat": 47.688, "lng": 27.319, "stopIds": ["country-falesti", "country-glodeni", "country-balatina"]},
{"country": "md", "label": "Deep south village road", "detail": "Cheese, preserves, fresh bread and garden tea · 4 stops", "lat": 45.641, "lng": 28.175, "stopIds": ["country-leova", "country-cantemir", "country-cahul", "country-valeni"]},
{"country": "md", "label": "Southern pantry trail", "detail": "Bread, village cheese and cellar bottles · 3 stops", "lat": 45.597, "lng": 28.311, "stopIds": ["country-ceadir", "country-taraclia", "country-slobozia-mare"]},
{"country": "md", "label": "Dniester garden road", "detail": "Riverside fruit, gardens, bread and tea · 4 stops", "lat": 47.692, "lng": 28.973, "stopIds": ["country-vadul", "country-cosnita", "country-tipova", "country-saharna"]},
{"country": "md", "label": "Northern orchard loop", "detail": "Fruit, preserves and cheese · 4 stops", "lat": 48.243, "lng": 27.61, "stopIds": ["country-singerei", "country-balti", "country-drochia", "country-donduseni"]},
{"country": "md", "label": "Valley picnic trail", "detail": "Bread, village cheese and garden produce · 3 stops", "lat": 47.304, "lng": 28.968, "stopIds": ["place-petru", "place-elena", "place-vera"]},
{"country": "md", "label": "Codri forest flavours", "detail": "Orchard fruit, honey and herbs · 3 stops", "lat": 47.132, "lng": 28.38, "stopIds": ["place-mihai", "place-maria", "place-ana"]},
{"country": "md", "label": "Southern cellar road", "detail": "Fruit preserves and wine to take home · 3 stops", "lat": 46.515, "lng": 29.872, "stopIds": ["place-doina", "place-stefan", "place-radu"]},
{"country": "md", "label": "The northern village day", "detail": "Honey, cheese and a river-town afternoon · 2 stops", "lat": 48.158, "lng": 28.297, "stopIds": ["place-irina", "place-dumitru"]},
{"country": "md", "label": "Gagauzia pantry road", "detail": "Preserves, walnut bread and garden produce · 3 stops", "lat": 46.3, "lng": 28.657, "stopIds": ["place-lidia", "place-viorica", "place-olga"]},
{"country": "md", "label": "Orhei to river country", "detail": "Village bread, cheese and orchard fruit · 3 stops", "lat": 47.747, "lng": 28.961, "stopIds": ["place-petru", "place-elena", "place-tatiana"]},
  { country: 'ge', label: 'Wine road', detail: 'Telavi, Kakheti', lat: 41.9186, lng: 45.4731 },
  { country: 'ge', label: 'Sighnaghi', detail: 'Gardens above the valley', lat: 41.6206, lng: 45.9216 },
  { country: 'ge', label: 'Black Sea', detail: 'Batumi', lat: 41.6168, lng: 41.6367 },
  { country: 'ge', label: 'High Caucasus', detail: 'Stepantsminda', lat: 42.6579, lng: 44.643 },
  { country: 'ge', label: 'Borjomi', detail: 'The pine road', lat: 41.839, lng: 43.391 },
  { country: 'ge', label: 'Svaneti', detail: 'Mestia', lat: 43.045, lng: 42.727 },
  { country: 'it', label: 'Chianti', detail: 'Greve in Chianti', lat: 43.583, lng: 11.317 },
  { country: 'it', label: 'Toward Siena', detail: 'Through the hills', lat: 43.3188, lng: 11.3308 },
  { country: 'fr', label: 'Luberon', detail: 'Lourmarin', lat: 43.763, lng: 5.362 },
  { country: 'fr', label: 'Cadenet', detail: 'A farm on the way', lat: 43.741, lng: 5.371 },
  { country: 'es', label: 'Haro', detail: 'The wine road west', lat: 42.576, lng: -2.862 },
  { country: 'es', label: 'Laguardia', detail: 'Hill town in Rioja', lat: 42.553, lng: -2.585 },
  { country: 'gr', label: 'Nemea', detail: 'Vineyards north', lat: 37.809, lng: 22.661 },
  { country: 'gr', label: 'Epidaurus', detail: 'Olive hills', lat: 37.596, lng: 23.079 },
  { country: 'pt', label: 'Pinhão', detail: 'Up the Douro', lat: 41.19, lng: -7.546 },
  { country: 'pt', label: 'Vila Real', detail: 'North of the river', lat: 41.3, lng: -7.744 },
  { country: 'am', label: 'Areni', detail: 'The wine village', lat: 39.721, lng: 45.188 },
  { country: 'am', label: 'Garni', detail: 'East of the city', lat: 40.112, lng: 44.729 },
  { country: 'tr', label: 'Urla', detail: 'Olive coast', lat: 38.323, lng: 26.764 },
  { country: 'tr', label: 'Alaçatı', detail: 'Wind and herbs', lat: 38.28, lng: 26.374 },
  { country: 'md', label: 'Cricova', detail: 'The cellars north of the city', lat: 47.138, lng: 28.863 },
  { country: 'md', label: 'Orheiul Vechi', detail: 'The limestone valley', lat: 47.306, lng: 28.97 },
  { country: 'md', label: 'Purcari', detail: 'South toward the river', lat: 46.512, lng: 29.876 },
]

const hoursAgo = (h: number) => Date.now() - h * 3600 * 1000

function product(
  id: string,
  name: string,
  detail: string,
  price: number,
  unit: string,
  category: CategoryId,
  image: string,
): Product {
  return { id, name, detail, price, unit, category, image: photo(image, 800) }
}

export const categoryCover: Record<CategoryId, string> = {
  wine: photo('photo-1506377247377-2a5b3b417ebb'),
  vegetables: photo('photo-1464226184884-fa280b87c399'),
  fruit: photo('photo-1560806887-1e4cd0b6cbd6'),
  cheese: photo('photo-1452195100486-9cc805987862'),
  bread: photo('photo-1509440159596-0249088772ff'),
  honey: photo('photo-1587049352846-4a222e784d38'),
  preserves: photo('photo-1471943311424-646960669fbc'),
  herbs: photo('photo-1466692476866-aef0b6d0c6d1'),
}

export const starters: Record<CategoryId, { name: string; detail: string; price: number; unit: string }> = {
  wine: { name: 'House bottle', detail: "This year's vintage", price: 16, unit: 'bottle' },
  vegetables: { name: 'Garden basket', detail: 'Whatever is ripe today', price: 12, unit: 'basket' },
  fruit: { name: 'Orchard box', detail: 'Picked this morning', price: 10, unit: 'box' },
  cheese: { name: 'Fresh round', detail: 'Salted, still soft', price: 9, unit: 'round' },
  bread: { name: 'Hearth loaf', detail: 'Baked at dawn', price: 4, unit: 'loaf' },
  honey: { name: 'Jar of honey', detail: 'From the near hives', price: 11, unit: 'jar' },
  preserves: { name: 'Pantry jar', detail: 'Fruit, cooked slowly', price: 8, unit: 'jar' },
  herbs: { name: 'Herb bunch', detail: 'Tied this morning', price: 4, unit: 'bunch' },
}

export const places: Place[] = [
{"id": "country-briceni", "hostId": "host-country-briceni", "hostName": "Emilia", "name": "Emilia’s honey garden", "village": "Briceni", "region": "North", "country": "md", "lat": 48.36, "lng": 27.08, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A garden apiary and a quiet picnic table. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{"id": "country-briceni-1", "name": "Meadow honey", "detail": "Made locally", "price": 110, "unit": "jar", "category": "honey", "image": categoryCover.honey}], "comments": []},
{"id": "country-lipcani", "hostId": "host-country-lipcani", "hostName": "Roman", "name": "Roman’s village oven", "village": "Lipcani", "region": "North", "country": "md", "lat": 48.267, "lng": 26.724, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "Warm loaves for a slow day beside the Prut. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-lipcani-1", "name": "Seeded hearth loaf", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-criva", "hostId": "host-country-criva", "hostName": "Nina", "name": "Nina’s pantry", "village": "Criva", "region": "North", "country": "md", "lat": 48.271, "lng": 26.668, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "A small pantry with jars of late-summer fruit. Fictional host and approximate location.", "cover": categoryCover.preserves, "products": [{"id": "country-criva-1", "name": "Plum preserve", "detail": "Made locally", "price": 65, "unit": "jar", "category": "preserves", "image": categoryCover.preserves}], "comments": []},
{"id": "country-edinet", "hostId": "host-country-edinet", "hostName": "Adrian", "name": "Adrian’s cheese table", "village": "Edineț", "region": "North", "country": "md", "lat": 48.172, "lng": 27.305, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A family cheese counter with picnic portions. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{"id": "country-edinet-1", "name": "Fresh village cheese", "detail": "Made locally", "price": 85, "unit": "portion", "category": "cheese", "image": categoryCover.cheese}], "comments": []},
{"id": "country-donduseni", "hostId": "host-country-donduseni", "hostName": "Raisa", "name": "Raisa’s orchard stop", "village": "Dondușeni", "region": "North", "country": "md", "lat": 48.243, "lng": 27.61, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "An orchard gate with fresh fruit and shade. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{"id": "country-donduseni-1", "name": "Orchard apple basket", "detail": "Made locally", "price": 60, "unit": "basket", "category": "fruit", "image": categoryCover.fruit}], "comments": []},
{"id": "country-otaci", "hostId": "host-country-otaci", "hostName": "Dorin", "name": "Dorin’s village oven", "village": "Otaci", "region": "North", "country": "md", "lat": 48.433, "lng": 27.799, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A village-style oven for a riverside lunch. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-otaci-1", "name": "Walnut loaf", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-ocnita", "hostId": "host-country-ocnita", "hostName": "Lilia", "name": "Lilia’s tea garden", "village": "Ocnița", "region": "North", "country": "md", "lat": 48.385, "lng": 27.439, "rating": 0, "reviews": 0, "categories": ["herbs"], "story": "Garden herbs dried in a summer kitchen. Fictional host and approximate location.", "cover": categoryCover.herbs, "products": [{"id": "country-ocnita-1", "name": "Mint and lemon balm", "detail": "Made locally", "price": 40, "unit": "bag", "category": "herbs", "image": categoryCover.herbs}], "comments": []},
{"id": "country-riscani", "hostId": "host-country-riscani", "hostName": "Silvia", "name": "Silvia’s garden gate", "village": "Rîșcani", "region": "North", "country": "md", "lat": 47.957, "lng": 27.553, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "Seasonal vegetables from a family garden. Fictional host and approximate location.", "cover": categoryCover.vegetables, "products": [{"id": "country-riscani-1", "name": "Garden basket", "detail": "Made locally", "price": 70, "unit": "basket", "category": "vegetables", "image": categoryCover.vegetables}], "comments": []},
{"id": "country-glodeni", "hostId": "host-country-glodeni", "hostName": "Mircea", "name": "Mircea’s honey garden", "village": "Glodeni", "region": "West", "country": "md", "lat": 47.775, "lng": 27.514, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "Honey jars and a shaded bench for travelers. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{"id": "country-glodeni-1", "name": "Wildflower honey", "detail": "Made locally", "price": 110, "unit": "jar", "category": "honey", "image": categoryCover.honey}], "comments": []},
{"id": "country-balatina", "hostId": "host-country-balatina", "hostName": "Doina", "name": "Doina’s cheese table", "village": "Balatina", "region": "West", "country": "md", "lat": 47.688, "lng": 27.319, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A countryside cheese table near the Prut valley. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{"id": "country-balatina-1", "name": "Sheep cheese", "detail": "Made locally", "price": 85, "unit": "portion", "category": "cheese", "image": categoryCover.cheese}], "comments": []},
{"id": "country-falesti", "hostId": "host-country-falesti", "hostName": "Tudor", "name": "Tudor’s village oven", "village": "Fălești", "region": "West", "country": "md", "lat": 47.576, "lng": 27.712, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "Savoury pastries wrapped for a picnic. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-falesti-1", "name": "Village plăcinte", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-balti", "hostId": "host-country-balti", "hostName": "Corina", "name": "Corina’s pantry", "village": "Bălți", "region": "North", "country": "md", "lat": 47.759, "lng": 27.918, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "A little pantry stall with family recipes. Fictional host and approximate location.", "cover": categoryCover.preserves, "products": [{"id": "country-balti-1", "name": "Cherry preserve", "detail": "Made locally", "price": 65, "unit": "jar", "category": "preserves", "image": categoryCover.preserves}], "comments": []},
{"id": "country-singerei", "hostId": "host-country-singerei", "hostName": "Vera", "name": "Vera’s orchard stop", "village": "Sîngerei", "region": "North", "country": "md", "lat": 47.636, "lng": 28.142, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A seasonal fruit stop on the northern road. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{"id": "country-singerei-1", "name": "Pear basket", "detail": "Made locally", "price": 60, "unit": "basket", "category": "fruit", "image": categoryCover.fruit}], "comments": []},
{"id": "country-drochia", "hostId": "host-country-drochia", "hostName": "Anatol", "name": "Anatol’s cheese table", "village": "Drochia", "region": "North", "country": "md", "lat": 48.035, "lng": 27.817, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "Fresh dairy and a small courtyard table. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{"id": "country-drochia-1", "name": "Fresh curd", "detail": "Made locally", "price": 85, "unit": "portion", "category": "cheese", "image": categoryCover.cheese}], "comments": []},
{"id": "country-soldanesti", "hostId": "host-country-soldanesti", "hostName": "Galina", "name": "Galina’s honey garden", "village": "Șoldănești", "region": "Dniester", "country": "md", "lat": 47.816, "lng": 28.796, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A honey porch with jars to take home. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{"id": "country-soldanesti-1", "name": "Acacia honey", "detail": "Made locally", "price": 110, "unit": "jar", "category": "honey", "image": categoryCover.honey}], "comments": []},
{"id": "country-saharna", "hostId": "host-country-saharna", "hostName": "Valeriu", "name": "Valeriu’s tea garden", "village": "Saharna", "region": "Dniester", "country": "md", "lat": 47.692, "lng": 28.973, "rating": 0, "reviews": 0, "categories": ["herbs"], "story": "A tea garden for a pause between village walks. Fictional host and approximate location.", "cover": categoryCover.herbs, "products": [{"id": "country-saharna-1", "name": "Country tea blend", "detail": "Made locally", "price": 40, "unit": "bag", "category": "herbs", "image": categoryCover.herbs}], "comments": []},
{"id": "country-tipova", "hostId": "host-country-tipova", "hostName": "Olesea", "name": "Olesea’s village oven", "village": "Țîpova", "region": "Dniester", "country": "md", "lat": 47.602, "lng": 28.983, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A small oven and picnic bread beside river country. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-tipova-1", "name": "Cornmeal loaf", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-vadul", "hostId": "host-country-vadul", "hostName": "Ina", "name": "Ina’s orchard stop", "village": "Vadul lui Vodă", "region": "Dniester", "country": "md", "lat": 47.09, "lng": 29.078, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A fruit stand for a leisurely riverside afternoon. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{"id": "country-vadul-1", "name": "Seasonal fruit bowl", "detail": "Made locally", "price": 60, "unit": "basket", "category": "fruit", "image": categoryCover.fruit}], "comments": []},
{"id": "country-cosnita", "hostId": "host-country-cosnita", "hostName": "Victor", "name": "Victor’s garden gate", "village": "Coșnița", "region": "Dniester", "country": "md", "lat": 47.166, "lng": 29.134, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "A garden gate with vegetables for a picnic. Fictional host and approximate location.", "cover": categoryCover.vegetables, "products": [{"id": "country-cosnita-1", "name": "Tomato basket", "detail": "Made locally", "price": 70, "unit": "basket", "category": "vegetables", "image": categoryCover.vegetables}], "comments": []},
{"id": "country-ungheni", "hostId": "host-country-ungheni", "hostName": "Natalia", "name": "Natalia’s village oven", "village": "Ungheni", "region": "West", "country": "md", "lat": 47.208, "lng": 27.8, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A family oven with pastries for the westward road. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-ungheni-1", "name": "Pumpkin plăcinte", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-nisporeni", "hostId": "host-country-nisporeni", "hostName": "Vlad", "name": "Vlad’s cellar", "village": "Nisporeni", "region": "West", "country": "md", "lat": 47.081, "lng": 28.178, "rating": 0, "reviews": 0, "categories": ["wine"], "story": "A tiny cellar with bottles to take home. Fictional host and approximate location.", "cover": categoryCover.wine, "products": [{"id": "country-nisporeni-1", "name": "Village red", "detail": "Made locally", "price": 180, "unit": "bottle", "category": "wine", "image": categoryCover.wine}], "comments": []},
{"id": "country-calarasi", "hostId": "host-country-calarasi", "hostName": "Angela", "name": "Angela’s orchard stop", "village": "Călărași", "region": "West", "country": "md", "lat": 47.255, "lng": 28.31, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "An orchard picnic stop in the rolling countryside. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{"id": "country-calarasi-1", "name": "Apple and pear box", "detail": "Made locally", "price": 60, "unit": "basket", "category": "fruit", "image": categoryCover.fruit}], "comments": []},
{"id": "country-cornesti", "hostId": "host-country-cornesti", "hostName": "Boris", "name": "Boris’s honey garden", "village": "Cornești", "region": "West", "country": "md", "lat": 47.363, "lng": 28.004, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A quiet honey stall at a garden fence. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{"id": "country-cornesti-1", "name": "Forest honey", "detail": "Made locally", "price": 110, "unit": "jar", "category": "honey", "image": categoryCover.honey}], "comments": []},
{"id": "country-leova", "hostId": "host-country-leova", "hostName": "Stela", "name": "Stela’s cheese table", "village": "Leova", "region": "South", "country": "md", "lat": 46.481, "lng": 28.255, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A family kitchen preparing cheese for the road. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{"id": "country-leova-1", "name": "Picnic cheese", "detail": "Made locally", "price": 85, "unit": "portion", "category": "cheese", "image": categoryCover.cheese}], "comments": []},
{"id": "country-cantemir", "hostId": "host-country-cantemir", "hostName": "Pavel", "name": "Pavel’s pantry", "village": "Cantemir", "region": "South", "country": "md", "lat": 46.277, "lng": 28.202, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "Summer fruit saved in small pantry jars. Fictional host and approximate location.", "cover": categoryCover.preserves, "products": [{"id": "country-cantemir-1", "name": "Apricot jam", "detail": "Made locally", "price": 65, "unit": "jar", "category": "preserves", "image": categoryCover.preserves}], "comments": []},
{"id": "country-cahul", "hostId": "host-country-cahul", "hostName": "Daniela", "name": "Daniela’s village oven", "village": "Cahul", "region": "South", "country": "md", "lat": 45.904, "lng": 28.194, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A neighborhood bakery with picnic-ready bread. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-cahul-1", "name": "Braided loaf", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-valeni", "hostId": "host-country-valeni", "hostName": "Zinaida", "name": "Zinaida’s tea garden", "village": "Văleni", "region": "South", "country": "md", "lat": 45.641, "lng": 28.175, "rating": 0, "reviews": 0, "categories": ["herbs"], "story": "A village garden and a shaded tea table. Fictional host and approximate location.", "cover": categoryCover.herbs, "products": [{"id": "country-valeni-1", "name": "Garden mint tea", "detail": "Made locally", "price": 40, "unit": "bag", "category": "herbs", "image": categoryCover.herbs}], "comments": []},
{"id": "country-slobozia-mare", "hostId": "host-country-slobozia-mare", "hostName": "Ilie", "name": "Ilie’s cellar", "village": "Slobozia Mare", "region": "South", "country": "md", "lat": 45.597, "lng": 28.311, "rating": 0, "reviews": 0, "categories": ["wine"], "story": "A southern cellar selling bottles for later. Fictional host and approximate location.", "cover": categoryCover.wine, "products": [{"id": "country-slobozia-mare-1", "name": "Family white", "detail": "Made locally", "price": 180, "unit": "bottle", "category": "wine", "image": categoryCover.wine}], "comments": []},
{"id": "country-giurgiulesti", "hostId": "host-country-giurgiulesti", "hostName": "Marta", "name": "Marta’s orchard stop", "village": "Giurgiulești", "region": "South", "country": "md", "lat": 45.482, "lng": 28.2, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A final fruit stop in the far south. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{"id": "country-giurgiulesti-1", "name": "Summer fruit basket", "detail": "Made locally", "price": 60, "unit": "basket", "category": "fruit", "image": categoryCover.fruit}], "comments": []},
{"id": "country-taraclia", "hostId": "host-country-taraclia", "hostName": "Elena", "name": "Elena’s cheese table", "village": "Taraclia", "region": "South", "country": "md", "lat": 45.902, "lng": 28.668, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A courtyard table with cheese and simple picnic fare. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{"id": "country-taraclia-1", "name": "Village brined cheese", "detail": "Made locally", "price": 85, "unit": "portion", "category": "cheese", "image": categoryCover.cheese}], "comments": []},
{"id": "country-ceadir", "hostId": "host-country-ceadir", "hostName": "Fiodor", "name": "Fiodor’s village oven", "village": "Ceadîr-Lunga", "region": "Gagauzia", "country": "md", "lat": 46.062, "lng": 28.831, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A family bakery with warm bread and a friendly courtyard. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-ceadir-1", "name": "Sesame loaf", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-basarabeasca", "hostId": "host-country-basarabeasca", "hostName": "Svetlana", "name": "Svetlana’s pantry", "village": "Basarabeasca", "region": "South", "country": "md", "lat": 46.332, "lng": 28.963, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "A small home pantry full of seasonal preserves. Fictional host and approximate location.", "cover": categoryCover.preserves, "products": [{"id": "country-basarabeasca-1", "name": "Sour cherry jam", "detail": "Made locally", "price": 65, "unit": "jar", "category": "preserves", "image": categoryCover.preserves}], "comments": []},
{"id": "country-causeni", "hostId": "host-country-causeni", "hostName": "Marin", "name": "Marin’s garden gate", "village": "Căușeni", "region": "Southeast", "country": "md", "lat": 46.636, "lng": 29.411, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "A garden stall with a basket for an afternoon outdoors. Fictional host and approximate location.", "cover": categoryCover.vegetables, "products": [{"id": "country-causeni-1", "name": "Seasonal vegetable box", "detail": "Made locally", "price": 70, "unit": "basket", "category": "vegetables", "image": categoryCover.vegetables}], "comments": []},
{"id": "country-palanca", "hostId": "host-country-palanca", "hostName": "Ludmila", "name": "Ludmila’s honey garden", "village": "Palanca", "region": "Southeast", "country": "md", "lat": 46.407, "lng": 30.095, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A honey gate in the far southeast. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{"id": "country-palanca-1", "name": "Meadow honey", "detail": "Made locally", "price": 110, "unit": "jar", "category": "honey", "image": categoryCover.honey}], "comments": []},
{"id": "country-tiraspol", "hostId": "host-country-tiraspol", "hostName": "Alexandra", "name": "Alexandra’s village oven", "village": "Tiraspol", "region": "Dniester", "country": "md", "lat": 46.84, "lng": 29.644, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A fictional neighborhood oven for exploring the map. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{"id": "country-tiraspol-1", "name": "Country loaf", "detail": "Made locally", "price": 35, "unit": "loaf", "category": "bread", "image": categoryCover.bread}], "comments": []},
{"id": "country-ribnita", "hostId": "host-country-ribnita", "hostName": "Nicolai", "name": "Nicolai’s orchard stop", "village": "Rîbnița", "region": "Dniester", "country": "md", "lat": 47.768, "lng": 29.008, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A fictional orchard stall beside river country. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{"id": "country-ribnita-1", "name": "Orchard fruit box", "detail": "Made locally", "price": 60, "unit": "basket", "category": "fruit", "image": categoryCover.fruit}], "comments": []},

  {
    id: 'place-nino',
    hostId: 'host-nino',
    hostName: 'Nino',
    name: "Nino's Marani",
    village: 'Telavi',
    region: 'Kakheti',
    country: 'ge',
    lat: 41.907,
    lng: 45.428,
    cover: photo('photo-1506377247377-2a5b3b417ebb'),
    rating: 4.9,
    reviews: 128,
    categories: ['wine', 'preserves'],
    story:
      'The cellar sits under a walnut tree at the edge of Telavi. Nino pours Rkatsiteli cold from the qvevri and sends travelers on with churchkhela still dusty with flour.',
    products: [
      product('n1', 'Rkatsiteli', 'Amber, from the home qvevri', 18, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
      product('n2', 'Saperavi', 'A darker bottle, kept two years', 26, 'bottle', 'wine', 'photo-1474722883778-792e7990302f'),
      product('n3', 'Churchkhela', 'Grape must and walnuts', 7, 'string', 'preserves', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c1', author: 'Levan', text: 'We stopped for twenty minutes and left with two bottles. The yard smells like grapes.', stars: 5 },
      { id: 'c2', author: 'Marta', text: 'She let us see the qvevri. The Saperavi is the one to take to dinner.', stars: 5 },
    ],
  },
  {
    id: 'place-taso',
    hostId: 'host-taso',
    hostName: 'Taso',
    name: "Taso's Cellar",
    village: 'Sagarejo',
    region: 'Kakheti',
    country: 'ge',
    lat: 41.748,
    lng: 45.372,
    cover: photo('photo-1474722883778-792e7990302f'),
    rating: 4.7,
    reviews: 64,
    categories: ['wine', 'preserves'],
    story:
      'Halfway to Telavi, Taso keeps a small cellar beside the highway. The sign is a painted bunch of grapes. Honk once and someone comes out with a glass.',
    products: [
      product('t1', 'Family white', 'Light, for the rest of the drive', 14, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
      product('t2', 'Fig jam', 'A jar for the passenger seat', 8, 'jar', 'preserves', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c3', author: 'Ana', text: 'Easy to miss, worth the stop. The jam tasted of last summer.', stars: 5 },
    ],
  },
  {
    id: 'place-giorgi',
    hostId: 'host-giorgi',
    hostName: 'Giorgi',
    name: "Giorgi's Garden",
    village: 'Sighnaghi',
    region: 'Kakheti',
    country: 'ge',
    lat: 41.618,
    lng: 45.908,
    cover: photo('photo-1464226184884-fa280b87c399'),
    rating: 4.8,
    reviews: 86,
    categories: ['vegetables', 'herbs'],
    story:
      'The rows face the Alazani valley. Giorgi cuts tomatoes only when a car actually stops, so they are still warm from the bed.',
    products: [
      product('g1', 'Tomato basket', 'Pink ones, still on the vine', 11, 'basket', 'vegetables', 'photo-1540420773420-3366772f4999'),
      product('g2', 'Herb bunch', 'Coriander, basil, tarragon', 4, 'bunch', 'herbs', 'photo-1466692476866-aef0b6d0c6d1'),
      product('g3', 'Cucumbers', 'A kilo, cold from the shade', 5, 'kg', 'vegetables', 'photo-1488459716781-31db52582fe9'),
    ],
    comments: [
      { id: 'c4', author: 'Nia', text: 'He cut one open before we paid. We ate it standing by the car.', stars: 5 },
    ],
  },
  {
    id: 'place-mariam',
    hostId: 'host-mariam',
    hostName: 'Mariam',
    name: "Mariam's Hives",
    village: 'Stepantsminda',
    region: 'Kazbegi',
    country: 'ge',
    lat: 42.649,
    lng: 44.632,
    cover: photo('photo-1464822759023-fed622ff2c3b'),
    rating: 4.9,
    reviews: 73,
    categories: ['honey'],
    story:
      'The hives face Kazbek. Mariam sells honey that tastes like wild thyme, and she will tell you which week the bees found it.',
    products: [
      product('m1', 'Mountain honey', 'Thyme and high pasture', 16, 'jar', 'honey', 'photo-1587049352846-4a222e784d38'),
      product('m2', 'Comb piece', 'A square, wrapped in paper', 12, 'piece', 'honey', 'photo-1587049352846-4a222e784d38'),
    ],
    comments: [
      { id: 'c5', author: 'Irakli', text: 'Bought a jar in the wind. It crystallized on the way back down and was even better.', stars: 5 },
    ],
  },
  {
    id: 'place-vano',
    hostId: 'host-vano',
    hostName: 'Vano',
    name: "Vano's Orchard",
    village: 'Ananuri',
    region: 'Mtskheta',
    country: 'ge',
    lat: 42.166,
    lng: 44.702,
    cover: photo('photo-1500530855697-b586d89ba3ee'),
    rating: 4.6,
    reviews: 41,
    categories: ['fruit'],
    story:
      'Just past the fortress, Vano keeps apples in crates under a tin roof. The military highway is loud; the orchard is not.',
    products: [
      product('v1', 'Apple crate', 'Sharp, late variety', 9, 'crate', 'fruit', 'photo-1560806887-1e4cd0b6cbd6'),
      product('v2', 'Apple juice', 'Pressed this week', 6, 'bottle', 'fruit', 'photo-1560806887-1e4cd0b6cbd6'),
    ],
    comments: [
      { id: 'c6', author: 'Sofia', text: 'A good pause before the climb to Gudauri.', stars: 4 },
    ],
  },
  {
    id: 'place-lela',
    hostId: 'host-lela',
    hostName: 'Lela',
    name: "Lela's Dairy",
    village: 'Mestia',
    region: 'Svaneti',
    country: 'ge',
    lat: 43.043,
    lng: 42.724,
    cover: photo('photo-1452195100486-9cc805987862'),
    rating: 4.8,
    reviews: 57,
    categories: ['cheese'],
    story:
      'Lela makes sulguni in a wooden house above Mestia. If the road has been long, she puts the kettle on before she talks about cheese.',
    products: [
      product('l1', 'Sulguni', 'Smoked lightly over beech', 14, 'round', 'cheese', 'photo-1486297678162-eb2a19b0a32d'),
      product('l2', 'Matsoni', 'A cold jar for the morning', 5, 'jar', 'cheese', 'photo-1452195100486-9cc805987862'),
    ],
    comments: [
      { id: 'c7', author: 'Gio', text: 'The smoked sulguni survived the drive back to Kutaisi. Barely.', stars: 5 },
    ],
  },
  {
    id: 'place-tamari',
    hostId: 'host-tamari',
    hostName: 'Tamari',
    name: "Tamari's Tone",
    village: 'Kutaisi',
    region: 'Imereti',
    country: 'ge',
    lat: 42.246,
    lng: 42.694,
    cover: photo('photo-1509440159596-0249088772ff'),
    rating: 4.8,
    reviews: 102,
    categories: ['bread', 'cheese'],
    story:
      'The tone oven is lit before sunrise. Tamari sells shotis puri still snapping, and a cheese bread if you are willing to wait twelve minutes.',
    products: [
      product('tm1', 'Shotis puri', 'From the clay oven', 2, 'loaf', 'bread', 'photo-1549931319-a545dcf3bc73'),
      product('tm2', 'Cheese bread', 'Imeretian, hot if you wait', 7, 'piece', 'bread', 'photo-1509440159596-0249088772ff'),
    ],
    comments: [
      { id: 'c8', author: 'Nino', text: 'We ate the first loaf in the car and went back for the cheese one.', stars: 5 },
    ],
  },
  {
    id: 'place-dato',
    hostId: 'host-dato',
    hostName: 'Dato',
    name: "Dato's Peaches",
    village: 'Gori',
    region: 'Kartli',
    country: 'ge',
    lat: 41.968,
    lng: 44.142,
    cover: photo('photo-1500382017468-9049fed747ef'),
    rating: 4.7,
    reviews: 49,
    categories: ['fruit'],
    story:
      'The stall is a table and a blue umbrella on the west road. In season the peaches are the whole conversation.',
    products: [
      product('d1', 'Peach box', 'Ripe enough for today', 8, 'box', 'fruit', 'photo-1560806887-1e4cd0b6cbd6'),
      product('d2', 'Peach jam', 'For when the season ends', 7, 'jar', 'fruit', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c9', author: 'Elene', text: 'Juice down to the elbow. He laughed and gave us a napkin.', stars: 5 },
    ],
  },
  {
    id: 'place-ana',
    hostId: 'host-ana',
    hostName: 'Ana',
    name: "Ana's Pantry",
    village: 'Batumi',
    region: 'Adjara',
    country: 'ge',
    lat: 41.638,
    lng: 41.668,
    cover: photo('photo-1507525428034-b723cf961d3e'),
    rating: 4.6,
    reviews: 77,
    categories: ['preserves', 'herbs'],
    story:
      'Before the sea, Ana keeps a pantry of ajika, green walnut preserve, and tea from the hills behind the city.',
    products: [
      product('a1', 'Ajika', 'Hot, Adjarian style', 6, 'jar', 'preserves', 'photo-1471943311424-646960669fbc'),
      product('a2', 'Walnut preserve', 'Young walnuts in syrup', 9, 'jar', 'preserves', 'photo-1471943311424-646960669fbc'),
      product('a3', 'Hill tea', 'A paper bag, dried this week', 5, 'bag', 'herbs', 'photo-1466692476866-aef0b6d0c6d1'),
    ],
    comments: [
      { id: 'c10', author: 'Luka', text: 'The ajika is serious. Buy bread before you open it.', stars: 4 },
    ],
  },
  {
    id: 'place-rezo',
    hostId: 'host-rezo',
    hostName: 'Rezo',
    name: "Rezo's Slopes",
    village: 'Borjomi',
    region: 'Samtskhe',
    country: 'ge',
    lat: 41.836,
    lng: 43.396,
    cover: photo('photo-1441974231531-c6227db76b6e'),
    rating: 4.7,
    reviews: 38,
    categories: ['herbs', 'honey'],
    story:
      'Rezo walks the pine slopes in the morning and comes down with bunches of herbs and a few jars. The stall is beside the mineral water spring.',
    products: [
      product('r1', 'Pine honey', 'Dark, from the park edge', 13, 'jar', 'honey', 'photo-1587049352846-4a222e784d38'),
      product('r2', 'Herb tea', 'Mint, thyme, something unnamed', 5, 'bag', 'herbs', 'photo-1466692476866-aef0b6d0c6d1'),
    ],
    comments: [
      { id: 'c11', author: 'Tamar', text: 'A quiet man and a very good jar. We drank the tea that night.', stars: 5 },
    ],
  },
  {
    id: 'place-lucia',
    hostId: 'host-lucia',
    hostName: 'Lucia',
    name: 'Casa Lucia',
    village: 'Greve in Chianti',
    region: 'Tuscany',
    country: 'it',
    lat: 43.579,
    lng: 11.312,
    cover: photo('photo-1516483638261-f4dbaf036963'),
    rating: 4.8,
    reviews: 91,
    categories: ['wine', 'preserves'],
    story:
      'A stone gate, a dog, and a table of bottles. Lucia sells the family Chianti and oil from the trees you can see from the road.',
    products: [
      product('lu1', 'Chianti', 'The house vintage', 18, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
      product('lu2', 'Olive oil', 'Pressed in November', 14, 'bottle', 'preserves', 'photo-1474979266404-7eaacbcd87c5'),
    ],
    comments: [
      { id: 'c12', author: 'Paolo', text: 'We tasted standing up. Left with oil and a bottle for the evening.', stars: 5 },
    ],
  },
  {
    id: 'place-marco',
    hostId: 'host-marco',
    hostName: 'Marco',
    name: 'Orto di Marco',
    village: 'Impruneta',
    region: 'Tuscany',
    country: 'it',
    lat: 43.692,
    lng: 11.248,
    cover: photo('photo-1488459716781-31db52582fe9'),
    rating: 4.6,
    reviews: 44,
    categories: ['vegetables', 'bread'],
    story:
      'South of Florence, before the Chianti hills steepen, Marco puts out a crate of whatever the garden gave him and a few loaves from his sister.',
    products: [
      product('ma1', 'Garden crate', 'Zucchini, tomatoes, beans', 12, 'crate', 'vegetables', 'photo-1540420773420-3366772f4999'),
      product('ma2', 'Country loaf', 'Baked before the market', 4, 'loaf', 'bread', 'photo-1509440159596-0249088772ff'),
    ],
    comments: [
      { id: 'c13', author: 'Giulia', text: 'The beans were still dusty. That is how you know.', stars: 5 },
    ],
  },
  {
    id: 'place-elise',
    hostId: 'host-elise',
    hostName: 'Élise',
    name: 'Domaine Élise',
    village: 'Lourmarin',
    region: 'Provence',
    country: 'fr',
    lat: 43.762,
    lng: 5.359,
    cover: photo('photo-1500530855697-b586d89ba3ee'),
    rating: 4.8,
    reviews: 70,
    categories: ['wine', 'herbs'],
    story:
      'At the last bend into Lourmarin, Élise sells a pale rosé and bunches of herbs cut from the terrace behind the house.',
    products: [
      product('e1', 'Rosé', 'Cold, if you ask', 15, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
      product('e2', 'Herb bunch', 'Thyme, rosemary, savory', 4, 'bunch', 'herbs', 'photo-1466692476866-aef0b6d0c6d1'),
    ],
    comments: [
      { id: 'c14', author: 'Camille', text: 'The rosé was the right temperature for a hot car. A small miracle.', stars: 5 },
    ],
  },
  {
    id: 'place-claire',
    hostId: 'host-claire',
    hostName: 'Claire',
    name: 'Ferme Claire',
    village: 'Cadenet',
    region: 'Provence',
    country: 'fr',
    lat: 43.736,
    lng: 5.373,
    cover: photo('photo-1500382017468-9049fed747ef'),
    rating: 4.7,
    reviews: 36,
    categories: ['cheese', 'fruit'],
    story:
      'Claire keeps goats and a few apricot trees on the road up to the Luberon. The cheese is fresh; the fruit depends on the month.',
    products: [
      product('cl1', 'Goat round', 'Soft, a day old', 8, 'round', 'cheese', 'photo-1486297678162-eb2a19b0a32d'),
      product('cl2', 'Apricot bag', 'When the tree allows', 6, 'bag', 'fruit', 'photo-1560806887-1e4cd0b6cbd6'),
    ],
    comments: [
      { id: 'c15', author: 'Hugo', text: 'We ate the cheese with bread on the wall outside. She pointed us toward Lourmarin.', stars: 5 },
    ],
  },
  {
    id: 'place-alba',
    hostId: 'host-alba',
    hostName: 'Alba',
    name: 'Bodega Alba',
    village: 'Cenicero',
    region: 'Rioja',
    country: 'es',
    lat: 42.481,
    lng: -2.641,
    cover: photo('photo-1474722883778-792e7990302f'),
    rating: 4.8,
    reviews: 83,
    categories: ['wine'],
    story:
      'Between Logroño and Haro, Alba opens the side door of the bodega for anyone who slows down. The crianza is the one she is proud of.',
    products: [
      product('al1', 'Crianza', 'Two years, quiet oak', 17, 'bottle', 'wine', 'photo-1474722883778-792e7990302f'),
      product('al2', 'Joven', 'Young, for tonight', 9, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
    ],
    comments: [
      { id: 'c16', author: 'Mateo', text: 'A proper pour, not a tourist sip. We bought the crianza.', stars: 5 },
    ],
  },
  {
    id: 'place-sol',
    hostId: 'host-sol',
    hostName: 'Sol',
    name: 'Huerta Sol',
    village: 'Laguardia',
    region: 'Rioja',
    country: 'es',
    lat: 42.55,
    lng: -2.59,
    cover: photo('photo-1464226184884-fa280b87c399'),
    rating: 4.6,
    reviews: 29,
    categories: ['vegetables', 'preserves'],
    story:
      'Under the walls of Laguardia, Sol sells peppers, tomatoes, and a pimentón she grinds herself.',
    products: [
      product('s1', 'Pepper basket', 'Red and green, mixed', 8, 'basket', 'vegetables', 'photo-1540420773420-3366772f4999'),
      product('s2', 'Pimentón', 'A small tin', 5, 'tin', 'preserves', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c17', author: 'Inés', text: 'The peppers were sweet enough to eat raw on the drive.', stars: 4 },
    ],
  },
  {
    id: 'place-nikos',
    hostId: 'host-nikos',
    hostName: 'Nikos',
    name: 'Ktima Nikos',
    village: 'Nemea',
    region: 'Peloponnese',
    country: 'gr',
    lat: 37.804,
    lng: 22.664,
    cover: photo('photo-1506377247377-2a5b3b417ebb'),
    rating: 4.7,
    reviews: 52,
    categories: ['wine', 'herbs'],
    story:
      'Agiorgitiko country. Nikos sells from a shaded table at the edge of the vines, with oregano drying on a rack behind him.',
    products: [
      product('ni1', 'Agiorgitiko', 'The house red', 13, 'bottle', 'wine', 'photo-1474722883778-792e7990302f'),
      product('ni2', 'Dried oregano', 'From the terrace', 3, 'bag', 'herbs', 'photo-1466692476866-aef0b6d0c6d1'),
    ],
    comments: [
      { id: 'c18', author: 'Eleni', text: 'He walked us ten meters into the vines and then poured. That was the sale.', stars: 5 },
    ],
  },
  {
    id: 'place-elaia',
    hostId: 'host-elaia',
    hostName: 'Eleni',
    name: 'Elaia',
    village: 'Lygourio',
    region: 'Argolid',
    country: 'gr',
    lat: 37.61,
    lng: 23.04,
    cover: photo('photo-1474979266404-7eaacbcd87c5'),
    rating: 4.8,
    reviews: 33,
    categories: ['preserves', 'honey'],
    story:
      'On the road toward Epidaurus, Eleni presses a little oil and keeps bees in the olives. Both end up in the same small shop.',
    products: [
      product('el1', 'Olive oil', 'Early harvest, peppery', 16, 'bottle', 'preserves', 'photo-1474979266404-7eaacbcd87c5'),
      product('el2', 'Orange honey', 'Light, from the grove', 9, 'jar', 'honey', 'photo-1587049352846-4a222e784d38'),
    ],
    comments: [
      { id: 'c19', author: 'Andreas', text: 'The oil caught in the throat in the best way.', stars: 5 },
    ],
  },
  {
    id: 'place-rosa',
    hostId: 'host-rosa',
    hostName: 'Rosa',
    name: 'Quinta Rosa',
    village: 'Pinhão',
    region: 'Douro',
    country: 'pt',
    lat: 41.188,
    lng: -7.55,
    cover: photo('photo-1501785888041-af3ef285b470'),
    rating: 4.9,
    reviews: 61,
    categories: ['wine', 'preserves'],
    story:
      'The quinta steps down to the river. Rosa sells a bottle of port and jars of grape jam to people who have been watching terraces for an hour.',
    products: [
      product('ro1', 'Ruby port', 'A half bottle for the car', 15, 'bottle', 'wine', 'photo-1474722883778-792e7990302f'),
      product('ro2', 'Grape jam', 'From the same terraces', 6, 'jar', 'preserves', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c20', author: 'Tiago', text: 'The view did half the work. The port did the rest.', stars: 5 },
    ],
  },
  {
    id: 'place-arpi',
    hostId: 'host-arpi',
    hostName: 'Arpi',
    name: "Arpi's Areni",
    village: 'Areni',
    region: 'Vayots Dzor',
    country: 'am',
    lat: 39.724,
    lng: 45.182,
    cover: photo('photo-1470071459604-3b5ec3a7fe05'),
    rating: 4.8,
    reviews: 40,
    categories: ['wine', 'fruit'],
    story:
      'Areni is a short gorge away from Yerevan and a long way in feeling. Arpi pours the local red and sells apricots when the trees agree.',
    products: [
      product('ar1', 'Areni red', 'Dry, from the village', 11, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
      product('ar2', 'Dried apricots', 'A paper bag', 5, 'bag', 'fruit', 'photo-1560806887-1e4cd0b6cbd6'),
    ],
    comments: [
      { id: 'c21', author: 'Mariam', text: 'We tasted three and understood why the road is famous.', stars: 5 },
    ],
  },
  {
    id: 'place-deniz',
    hostId: 'host-deniz',
    hostName: 'Deniz',
    name: "Deniz's Grove",
    village: 'Urla',
    region: 'Aegean',
    country: 'tr',
    lat: 38.33,
    lng: 26.77,
    cover: photo('photo-1507525428034-b723cf961d3e'),
    rating: 4.7,
    reviews: 46,
    categories: ['preserves', 'vegetables'],
    story:
      'Between Izmir and the peninsula, Deniz sells oil, olives, and a basket of whatever the field is doing. The sea is close enough to smell.',
    products: [
      product('de1', 'Olive oil', 'Aegean, green and sharp', 12, 'bottle', 'preserves', 'photo-1474979266404-7eaacbcd87c5'),
      product('de2', 'Olive bowl', 'Mixed, still bitter', 7, 'bowl', 'vegetables', 'photo-1488459716781-31db52582fe9'),
    ],
    comments: [
      { id: 'c22', author: 'Selin', text: 'We bought oil and ate the olives before Urla. No regrets.', stars: 5 },
    ],
  },
  {
    id: 'place-ion',
    hostId: 'host-ion',
    hostName: 'Ion',
    name: "Ion's Cellar",
    village: 'Cricova',
    region: 'Chișinău',
    country: 'md',
    lat: 47.13,
    lng: 28.858,
    cover: photo('photo-1506377247377-2a5b3b417ebb'),
    rating: 4.8,
    reviews: 64,
    categories: ['wine'],
    story:
      'A short climb north of Chișinău, Ion keeps a door into the limestone galleries. He pours a cold white and a darker bottle if you are willing to sit for a minute.',
    products: [
      product('io1', 'Cricova white', 'Light, for the drive back', 150, 'bottle', 'wine', 'photo-1510812431401-41d2bd2722f3'),
      product('io2', 'House red', 'Kept in the gallery', 220, 'bottle', 'wine', 'photo-1474722883778-792e7990302f'),
    ],
    comments: [
      { id: 'c23', author: 'Andrei', text: 'We tasted standing in the cool of the tunnel. Left with the red.', stars: 5 },
    ],
  },
  {
    id: 'place-vera',
    hostId: 'host-vera',
    hostName: 'Vera',
    name: "Vera's Garden",
    village: 'Butuceni',
    region: 'Orhei',
    country: 'md',
    lat: 47.304,
    lng: 28.968,
    cover: photo('photo-1464226184884-fa280b87c399'),
    rating: 4.7,
    reviews: 31,
    categories: ['vegetables', 'honey'],
    story:
      'Below the cave monastery at Orheiul Vechi, Vera sells whatever the garden gave that morning, and a jar of honey from the hives on the ridge.',
    products: [
      product('ve1', 'Garden basket', 'Tomatoes, peppers, herbs', 80, 'basket', 'vegetables', 'photo-1540420773420-3366772f4999'),
      product('ve2', 'Valley honey', 'From the limestone hills', 120, 'jar', 'honey', 'photo-1587049352846-4a222e784d38'),
    ],
    comments: [
      { id: 'c24', author: 'Mila', text: 'The tomatoes were still warm. She pointed us to the view before we paid.', stars: 5 },
    ],
  },
  {
    id: 'place-doina',
    hostId: 'host-doina',
    hostName: 'Doina',
    name: "Doina's Stall",
    village: 'Căușeni',
    region: 'Căușeni',
    country: 'md',
    lat: 46.64,
    lng: 29.408,
    cover: photo('photo-1560806887-1e4cd0b6cbd6'),
    rating: 4.6,
    reviews: 22,
    categories: ['fruit', 'preserves'],
    story:
      'On the south road, before the vineyards of Purcari, Doina sets a table of apples, late plums, and a few jars under a canvas shade.',
    products: [
      product('do1', 'Orchard box', 'Apples and plums, mixed', 70, 'box', 'fruit', 'photo-1560806887-1e4cd0b6cbd6'),
      product('do2', 'Plum jam', 'Cooked in a copper pot', 65, 'jar', 'preserves', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c25', author: 'Petru', text: 'A good stop halfway. The jam tasted of smoke and fruit.', stars: 4 },
    ],
  },
  {
    id: 'place-radu',
    hostId: 'host-radu',
    hostName: 'Radu',
    name: "Radu's House",
    village: 'Purcari',
    region: 'Ștefan Vodă',
    country: 'md',
    lat: 46.515,
    lng: 29.872,
    cover: photo('photo-1474722883778-792e7990302f'),
    rating: 4.9,
    reviews: 48,
    categories: ['wine', 'preserves'],
    story:
      'The rows run down toward the river. Radu sells the house Negru and a bottle of ice wine when the season has been kind.',
    products: [
      product('ra1', 'Purcari red', 'The house Negru', 260, 'bottle', 'wine', 'photo-1474722883778-792e7990302f'),
      product('ra2', 'Grape jam', 'From the same rows', 75, 'jar', 'preserves', 'photo-1471943311424-646960669fbc'),
    ],
    comments: [
      { id: 'c26', author: 'Irina', text: 'We watched the river and bought the red. The drive south was worth it.', stars: 5 },
    ],
  },{"id": "place-elena", "hostId": "host-elena", "hostName": "Elena", "name": "Elena’s cheese table", "village": "Trebujeni", "region": "Orhei", "country": "md", "lat": 47.316, "lng": 28.979, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A shady courtyard, fresh cheese and a picnic basket to take into the valley. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{id:"elena-1",name:"Fresh sheep cheese",detail:"Made locally",price:85,unit:"round",category:"cheese",image:categoryCover.cheese}], "comments": []},
{"id": "place-petru", "hostId": "host-petru", "hostName": "Petru", "name": "Petru’s village oven", "village": "Butuceni", "region": "Orhei", "country": "md", "lat": 47.299, "lng": 28.973, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "Warm bread and potato plăcinte from a little village oven. A slow lunch stop before a walk. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{id:"petru-1",name:"Hearth loaf",detail:"Made locally",price:35,unit:"loaf",category:"bread",image:categoryCover.bread}], "comments": []},
{"id": "place-maria", "hostId": "host-maria", "hostName": "Maria", "name": "Maria’s forest honey", "village": "Căpriana", "region": "Strășeni", "country": "md", "lat": 47.118, "lng": 28.506, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A garden at the edge of the Codri, with honey and a quiet bench in the shade. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{id:"maria-1",name:"Linden honey",detail:"Made locally",price:110,unit:"jar",category:"honey",image:categoryCover.honey}], "comments": []},
{"id": "place-ana", "hostId": "host-ana", "hostName": "Ana", "name": "Ana’s herb garden", "village": "Lozova", "region": "Strășeni", "country": "md", "lat": 47.132, "lng": 28.38, "rating": 0, "reviews": 0, "categories": ["herbs"], "story": "Mint, lemon balm and thyme, dried in the summer kitchen. Pick up a blend for your picnic. Fictional host and approximate location.", "cover": categoryCover.herbs, "products": [{id:"ana-1",name:"Garden tea blend",detail:"Made locally",price:45,unit:"bag",category:"herbs",image:categoryCover.herbs}], "comments": []},
{"id": "place-mihai", "hostId": "host-mihai", "hostName": "Mihai", "name": "Mihai’s orchard", "village": "Cojușna", "region": "Strășeni", "country": "md", "lat": 47.095, "lng": 28.618, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "Apples, pears and a patch of grass beneath the trees. A simple family stop on the forest road. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{id:"mihai-1",name:"Seasonal fruit box",detail:"Made locally",price:65,unit:"box",category:"fruit",image:categoryCover.fruit}], "comments": []},
{"id": "place-lidia", "hostId": "host-lidia", "hostName": "Lidia", "name": "Lidia’s pantry", "village": "Hîncești", "region": "Hîncești", "country": "md", "lat": 46.83, "lng": 28.593, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "Shelves of bright preserves and handwritten recipes. Take something home from the countryside. Fictional host and approximate location.", "cover": categoryCover.preserves, "products": [{id:"lidia-1",name:"Apricot preserve",detail:"Made locally",price:70,unit:"jar",category:"preserves",image:categoryCover.preserves}], "comments": []},
{"id": "place-viorica", "hostId": "host-viorica", "hostName": "Viorica", "name": "Viorica’s bread house", "village": "Cimișlia", "region": "Cimișlia", "country": "md", "lat": 46.525, "lng": 28.774, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A village-style bakery with walnut loaves and savoury pastries for a long afternoon on the road. Fictional host and approximate location.", "cover": categoryCover.bread, "products": [{id:"viorica-1",name:"Walnut cozonac",detail:"Made locally",price:90,unit:"loaf",category:"bread",image:categoryCover.bread}], "comments": []},
{"id": "place-stefan", "hostId": "host-stefan", "hostName": "Ștefan", "name": "Ștefan’s vineyard gate", "village": "Ștefan Vodă", "region": "Ștefan Vodă", "country": "md", "lat": 46.512, "lng": 29.658, "rating": 0, "reviews": 0, "categories": ["wine"], "story": "A small vineyard courtyard and bottles to take home. Let a designated driver handle the road. Fictional host and approximate location.", "cover": categoryCover.wine, "products": [{id:"stefan-1",name:"Family red",detail:"Made locally",price:180,unit:"bottle",category:"wine",image:categoryCover.wine}], "comments": []},
{"id": "place-olga", "hostId": "host-olga", "hostName": "Olga", "name": "Olga’s garden table", "village": "Comrat", "region": "Gagauzia", "country": "md", "lat": 46.3, "lng": 28.657, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "Seasonal vegetables, homemade pickles and a little table to assemble a countryside lunch. Fictional host and approximate location.", "cover": categoryCover.vegetables, "products": [{id:"olga-1",name:"Picnic vegetable basket",detail:"Made locally",price:80,unit:"basket",category:"vegetables",image:categoryCover.vegetables}], "comments": []},
{"id": "place-dumitru", "hostId": "host-dumitru", "hostName": "Dumitru", "name": "Dumitru’s cheese room", "village": "Soroca", "region": "Soroca", "country": "md", "lat": 48.158, "lng": 28.297, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "Cheese, bread and a shaded courtyard for a break during a day beside the river. Fictional host and approximate location.", "cover": categoryCover.cheese, "products": [{id:"dumitru-1",name:"Village cheese basket",detail:"Made locally",price:95,unit:"basket",category:"cheese",image:categoryCover.cheese}], "comments": []},
{"id": "place-irina", "hostId": "host-irina", "hostName": "Irina", "name": "Irina’s northern hives", "village": "Florești", "region": "Florești", "country": "md", "lat": 47.887, "lng": 28.303, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A family garden and honey from nearby fields. Pair a jar with a loaf from the village shop. Fictional host and approximate location.", "cover": categoryCover.honey, "products": [{id:"irina-1",name:"Wildflower honey",detail:"Made locally",price:105,unit:"jar",category:"honey",image:categoryCover.honey}], "comments": []},
{"id": "place-tatiana", "hostId": "host-tatiana", "hostName": "Tatiana", "name": "Tatiana’s orchard gate", "village": "Rezina", "region": "Rezina", "country": "md", "lat": 47.747, "lng": 28.961, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A fruit stand with a river-country picnic in mind. Bring a bag and take your time choosing. Fictional host and approximate location.", "cover": categoryCover.fruit, "products": [{id:"tatiana-1",name:"Apple and pear basket",detail:"Made locally",price:60,unit:"basket",category:"fruit",image:categoryCover.fruit}], "comments": []},

  // Fictional roadside discoveries between the main demo destinations.
{"id": "roadside-stauceni", "hostId": "host-roadside-stauceni", "hostName": "Sofia", "name": "Sofia’s morning oven", "village": "Stăuceni", "region": "Moldova countryside", "country": "md", "lat": 47.091, "lng": 28.869, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A small stop near Stăuceni for warm rolls, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.bread, products:[{id:"roadside-stauceni-1",name:"Warm rolls",detail:"Take along for the day",price:30,unit:"bag",category:"bread",image:categoryCover.bread}]},
{"id": "roadside-magdacesti", "hostId": "host-roadside-magdacesti", "hostName": "Victor", "name": "Victor’s orchard cart", "village": "Măgdăcești", "region": "Moldova countryside", "country": "md", "lat": 47.181, "lng": 28.861, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A small stop near Măgdăcești for apple basket, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.fruit, products:[{id:"roadside-magdacesti-1",name:"Apple basket",detail:"Take along for the day",price:55,unit:"basket",category:"fruit",image:categoryCover.fruit}]},
{"id": "roadside-peresecina", "hostId": "host-roadside-peresecina", "hostName": "Valentina", "name": "Valentina’s cheese stop", "village": "Peresecina", "region": "Moldova countryside", "country": "md", "lat": 47.252, "lng": 28.772, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A small stop near Peresecina for fresh village cheese, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.cheese, products:[{id:"roadside-peresecina-1",name:"Fresh village cheese",detail:"Take along for the day",price:80,unit:"round",category:"cheese",image:categoryCover.cheese}]},
{"id": "roadside-ivancea", "hostId": "host-roadside-ivancea", "hostName": "Grigore", "name": "Grigore’s honey gate", "village": "Ivancea", "region": "Moldova countryside", "country": "md", "lat": 47.285, "lng": 28.852, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A small stop near Ivancea for meadow honey, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.honey, products:[{id:"roadside-ivancea-1",name:"Meadow honey",detail:"Take along for the day",price:100,unit:"jar",category:"honey",image:categoryCover.honey}]},
{"id": "roadside-branesti", "hostId": "host-roadside-branesti", "hostName": "Alina", "name": "Alina’s cellar courtyard", "village": "Brănești", "region": "Moldova countryside", "country": "md", "lat": 47.273, "lng": 28.924, "rating": 0, "reviews": 0, "categories": ["wine"], "story": "A small stop near Brănești for village white, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.wine, products:[{id:"roadside-branesti-1",name:"Village white",detail:"Take along for the day",price:140,unit:"bottle",category:"wine",image:categoryCover.wine}]},
{"id": "roadside-orhei", "hostId": "host-roadside-orhei", "hostName": "Nadejda", "name": "Nadejda’s pantry shelf", "village": "Orhei", "region": "Moldova countryside", "country": "md", "lat": 47.383, "lng": 28.823, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "A small stop near Orhei for cherry preserve, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.preserves, products:[{id:"roadside-orhei-1",name:"Cherry preserve",detail:"Take along for the day",price:65,unit:"jar",category:"preserves",image:categoryCover.preserves}]},
{"id": "roadside-vatici", "hostId": "host-roadside-vatici", "hostName": "Pavel", "name": "Pavel’s garden tea", "village": "Vatici", "region": "Moldova countryside", "country": "md", "lat": 47.396, "lng": 28.647, "rating": 0, "reviews": 0, "categories": ["herbs"], "story": "A small stop near Vatici for mint and thyme, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.herbs, products:[{id:"roadside-vatici-1",name:"Mint and thyme",detail:"Take along for the day",price:40,unit:"bag",category:"herbs",image:categoryCover.herbs}]},
{"id": "roadside-ratus", "hostId": "host-roadside-ratus", "hostName": "Daria", "name": "Daria’s roadside garden", "village": "Ratuș", "region": "Moldova countryside", "country": "md", "lat": 47.478, "lng": 28.53, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "A small stop near Ratuș for seasonal garden box, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.vegetables, products:[{id:"roadside-ratus-1",name:"Seasonal garden box",detail:"Take along for the day",price:70,unit:"box",category:"vegetables",image:categoryCover.vegetables}]},
{"id": "roadside-telenesti", "hostId": "host-roadside-telenesti", "hostName": "Sergiu", "name": "Sergiu’s village bakery", "village": "Telenești", "region": "Moldova countryside", "country": "md", "lat": 47.503, "lng": 28.367, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A small stop near Telenești for country loaf, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.bread, products:[{id:"roadside-telenesti-1",name:"Country loaf",detail:"Take along for the day",price:35,unit:"loaf",category:"bread",image:categoryCover.bread}]},
{"id": "roadside-saratenii", "hostId": "host-roadside-saratenii", "hostName": "Eugenia", "name": "Eugenia’s fruit shade", "village": "Sărătenii Vechi", "region": "Moldova countryside", "country": "md", "lat": 47.528, "lng": 28.546, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A small stop near Sărătenii Vechi for pear basket, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.fruit, products:[{id:"roadside-saratenii-1",name:"Pear basket",detail:"Take along for the day",price:60,unit:"basket",category:"fruit",image:categoryCover.fruit}]},
{"id": "roadside-ghindesti", "hostId": "host-roadside-ghindesti", "hostName": "Boris", "name": "Boris’s cheese basket", "village": "Ghindești", "region": "Moldova countryside", "country": "md", "lat": 47.859, "lng": 28.373, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A small stop near Ghindești for picnic cheese, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.cheese, products:[{id:"roadside-ghindesti-1",name:"Picnic cheese",detail:"Take along for the day",price:85,unit:"basket",category:"cheese",image:categoryCover.cheese}]},
{"id": "roadside-rublenita", "hostId": "host-roadside-rublenita", "hostName": "Tamara", "name": "Tamara’s honey porch", "village": "Rublenița", "region": "Moldova countryside", "country": "md", "lat": 48.175, "lng": 28.231, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A small stop near Rublenița for summer blossom honey, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.honey, products:[{id:"roadside-rublenita-1",name:"Summer blossom honey",detail:"Take along for the day",price:115,unit:"jar",category:"honey",image:categoryCover.honey}]},
{"id": "roadside-vorniceni", "hostId": "host-roadside-vorniceni", "hostName": "Cristina", "name": "Cristina’s herb corner", "village": "Vorniceni", "region": "Moldova countryside", "country": "md", "lat": 47.163, "lng": 28.428, "rating": 0, "reviews": 0, "categories": ["herbs"], "story": "A small stop near Vorniceni for lemon balm tea, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.herbs, products:[{id:"roadside-vorniceni-1",name:"Lemon balm tea",detail:"Take along for the day",price:45,unit:"bag",category:"herbs",image:categoryCover.herbs}]},
{"id": "roadside-straseni", "hostId": "host-roadside-straseni", "hostName": "Andrei", "name": "Andrei’s warm bread", "village": "Strășeni", "region": "Moldova countryside", "country": "md", "lat": 47.139, "lng": 28.607, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A small stop near Strășeni for seeded loaf, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.bread, products:[{id:"roadside-straseni-1",name:"Seeded loaf",detail:"Take along for the day",price:40,unit:"loaf",category:"bread",image:categoryCover.bread}]},
{"id": "roadside-panasesti", "hostId": "host-roadside-panasesti", "hostName": "Ludmila", "name": "Ludmila’s orchard table", "village": "Pănășești", "region": "Moldova countryside", "country": "md", "lat": 47.152, "lng": 28.524, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A small stop near Pănășești for mixed orchard box, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.fruit, products:[{id:"roadside-panasesti-1",name:"Mixed orchard box",detail:"Take along for the day",price:65,unit:"box",category:"fruit",image:categoryCover.fruit}]},
{"id": "roadside-scoreni", "hostId": "host-roadside-scoreni", "hostName": "Nicolae", "name": "Nicolae’s forest pantry", "village": "Scoreni", "region": "Moldova countryside", "country": "md", "lat": 47.069, "lng": 28.608, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "A small stop near Scoreni for plum preserve, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.preserves, products:[{id:"roadside-scoreni-1",name:"Plum preserve",detail:"Take along for the day",price:60,unit:"jar",category:"preserves",image:categoryCover.preserves}]},
{"id": "roadside-suruceni", "hostId": "host-roadside-suruceni", "hostName": "Elisabeta", "name": "Elisabeta’s garden gate", "village": "Suruceni", "region": "Moldova countryside", "country": "md", "lat": 46.982, "lng": 28.672, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "A small stop near Suruceni for tomato basket, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.vegetables, products:[{id:"roadside-suruceni-1",name:"Tomato basket",detail:"Take along for the day",price:65,unit:"basket",category:"vegetables",image:categoryCover.vegetables}]},
{"id": "roadside-bardar", "hostId": "host-roadside-bardar", "hostName": "Vasile", "name": "Vasile’s honey table", "village": "Bardar", "region": "Moldova countryside", "country": "md", "lat": 46.899, "lng": 28.671, "rating": 0, "reviews": 0, "categories": ["honey"], "story": "A small stop near Bardar for acacia honey, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.honey, products:[{id:"roadside-bardar-1",name:"Acacia honey",detail:"Take along for the day",price:110,unit:"jar",category:"honey",image:categoryCover.honey}]},
{"id": "roadside-carpineni", "hostId": "host-roadside-carpineni", "hostName": "Larisa", "name": "Larisa’s cheese kitchen", "village": "Cărpineni", "region": "Moldova countryside", "country": "md", "lat": 46.759, "lng": 28.415, "rating": 0, "reviews": 0, "categories": ["cheese"], "story": "A small stop near Cărpineni for salted sheep cheese, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.cheese, products:[{id:"roadside-carpineni-1",name:"Salted sheep cheese",detail:"Take along for the day",price:90,unit:"round",category:"cheese",image:categoryCover.cheese}]},
{"id": "roadside-razeni", "hostId": "host-roadside-razeni", "hostName": "Oleg", "name": "Oleg’s orchard stop", "village": "Răzeni", "region": "Moldova countryside", "country": "md", "lat": 46.769, "lng": 28.929, "rating": 0, "reviews": 0, "categories": ["fruit"], "story": "A small stop near Răzeni for seasonal apples, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.fruit, products:[{id:"roadside-razeni-1",name:"Seasonal apples",detail:"Take along for the day",price:50,unit:"box",category:"fruit",image:categoryCover.fruit}]},
{"id": "roadside-cainari", "hostId": "host-roadside-cainari", "hostName": "Ecaterina", "name": "Ecaterina’s village oven", "village": "Căinari", "region": "Moldova countryside", "country": "md", "lat": 46.678, "lng": 29.05, "rating": 0, "reviews": 0, "categories": ["bread"], "story": "A small stop near Căinari for savoury plăcinte, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.bread, products:[{id:"roadside-cainari-1",name:"Savoury plăcinte",detail:"Take along for the day",price:45,unit:"pair",category:"bread",image:categoryCover.bread}]},
{"id": "roadside-cioburciu", "hostId": "host-roadside-cioburciu", "hostName": "Alexei", "name": "Alexei’s vineyard basket", "village": "Cioburciu", "region": "Moldova countryside", "country": "md", "lat": 46.663, "lng": 29.722, "rating": 0, "reviews": 0, "categories": ["wine"], "story": "A small stop near Cioburciu for family rosé, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.wine, products:[{id:"roadside-cioburciu-1",name:"Family rosé",detail:"Take along for the day",price:155,unit:"bottle",category:"wine",image:categoryCover.wine}]},
{"id": "roadside-talmaza", "hostId": "host-roadside-talmaza", "hostName": "Zina", "name": "Zina’s riverside pantry", "village": "Talmaza", "region": "Moldova countryside", "country": "md", "lat": 46.636, "lng": 29.659, "rating": 0, "reviews": 0, "categories": ["preserves"], "story": "A small stop near Talmaza for apricot jam, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.preserves, products:[{id:"roadside-talmaza-1",name:"Apricot jam",detail:"Take along for the day",price:65,unit:"jar",category:"preserves",image:categoryCover.preserves}]},
{"id": "roadside-cazaclia", "hostId": "host-roadside-cazaclia", "hostName": "Petra", "name": "Petra’s garden harvest", "village": "Cazaclia", "region": "Moldova countryside", "country": "md", "lat": 45.959, "lng": 28.612, "rating": 0, "reviews": 0, "categories": ["vegetables"], "story": "A small stop near Cazaclia for pepper and tomato box, a friendly hello and a picnic refill. Fictional roadside host with an approximate location.", "comments": [], cover:categoryCover.vegetables, products:[{id:"roadside-cazaclia-1",name:"Pepper and tomato box",detail:"Take along for the day",price:75,unit:"box",category:"vegetables",image:categoryCover.vegetables}]},

]

export const demoTraveler: User = {
  id: 'traveler-sandro',
  role: 'traveler',
  name: 'Sandro',
  email: 'sandro@sat.local',
  country: 'ge',
  categories: ['wine', 'vegetables', 'honey', 'bread'],
}

export const demoHost: User = {
  id: 'host-nino',
  role: 'host',
  name: 'Nino',
  email: 'nino@sat.local',
  country: 'ge',
  categories: ['wine', 'preserves'],
  placeId: 'place-nino',
}

function sold(
  id: string,
  productName: string,
  qty: number,
  unit: string,
  total: number,
  hours: number,
  status: Order['status'] = 'accepted',
  travelerName = 'A traveler',
): Order {
  return {
    id,
    placeId: 'place-nino',
    hostId: 'host-nino',
    travelerId: `guest-${id}`,
    travelerName,
    productName,
    qty,
    unit,
    total,
    currency: '₾',
    status,
    createdAt: hoursAgo(hours),
  }
}

export const seedOrders: Order[] = [
  sold('o1', 'Rkatsiteli', 2, 'bottle', 36, 24 * 6 + 3, 'accepted', 'Luka'),
  sold('o2', 'Saperavi', 1, 'bottle', 26, 24 * 5 + 2, 'accepted', 'Marta'),
  sold('o3', 'Churchkhela', 3, 'string', 21, 24 * 4 + 5, 'accepted', 'Gio'),
  sold('o4', 'Saperavi', 2, 'bottle', 52, 24 * 2 + 4, 'accepted', 'Nia'),
  sold('o5', 'Rkatsiteli', 1, 'bottle', 18, 24 + 6, 'accepted', 'Tamar'),
  sold('o6', 'Churchkhela', 4, 'string', 28, 6, 'accepted', 'Sandro'),
  sold('o7', 'Saperavi', 2, 'bottle', 52, 3, 'accepted', 'Elena'),
  sold('o8', 'Rkatsiteli', 2, 'bottle', 36, 24 * 12, 'accepted', 'Irakli'),
  sold('o9', 'Saperavi', 3, 'bottle', 78, 24 * 10, 'accepted', 'Ana'),
  sold('o10', 'Churchkhela', 2, 'string', 14, 24 * 8, 'accepted', 'Dato'),
  sold('o11', 'Churchkhela', 3, 'string', 21, 24 * 3, 'declined', 'Levan'),
  sold('o12', 'Saperavi', 2, 'bottle', 52, 0.4, 'pending', 'Levan'),
  sold('o13', 'Rkatsiteli', 1, 'bottle', 18, 2, 'pending', 'Elena'),
]

export function buildPlace(input: {
  hostId: string
  hostName: string
  placeName: string
  country: string
  areaId: string
  categories: CategoryId[]
}): Place {
  const area = (areas[input.country] ?? []).find((a) => a.id === input.areaId) ?? areas.ge[0]
  const nudge = (input.placeName.length * 17) % 100
  const lat = area.lat + ((nudge / 100) - 0.5) * 0.06
  const lng = area.lng + ((((nudge * 3) % 100) / 100) - 0.5) * 0.06
  const labels = input.categories
    .map((id) => starters[id].name.toLowerCase())
    .slice(0, 3)
    .join(', ')

  return {
    id: uid('place'),
    hostId: input.hostId,
    hostName: input.hostName,
    name: input.placeName.trim(),
    village: area.name,
    region: area.name,
    country: input.country,
    lat,
    lng,
    cover: categoryCover[input.categories[0]] ?? categoryCover.wine,
    rating: 0,
    reviews: 0,
    categories: input.categories,
    story: `${input.hostName} keeps ${input.placeName.trim()} in ${area.name}. Travelers can stop for ${labels}.`,
    products: input.categories.slice(0, 4).map((category) => {
      const item = starters[category]
      return {
        id: uid('prod'),
        name: item.name,
        detail: item.detail,
        price: item.price,
        unit: item.unit,
        category,
        image: categoryCover[category],
      }
    }),
    comments: [],
  }
}

export function buildWelcomeOrders(place: Place, currency: string): Order[] {
  const names = ['Nia', 'Giorgi']
  return place.products.slice(0, 2).map((item, index) => {
    const qty = index === 0 ? 2 : 1
    return {
      id: uid('ord'),
      placeId: place.id,
      hostId: place.hostId,
      travelerId: `passer-${index}`,
      travelerName: names[index] ?? 'A traveler',
      productName: item.name,
      qty,
      unit: item.unit,
      total: item.price * qty,
      currency,
      status: 'pending' as const,
      createdAt: Date.now() - (index === 0 ? 22 : 100) * 60 * 1000,
    }
  })
}
