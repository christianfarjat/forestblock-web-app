// (1.5 = +50%)
export const PRICE_MULTIPLIER = 1.5;

export const hardcodedVintages = [
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2022",
  "2023",
];

export const POLLING_INTERVAL = 15000; // 15 seconds
export const MAX_MONITORING_TIME = 600000; // 10 minutes

export const LATAM_COUNTRIES = [
  "Peru",
  "Colombia",
  "Chile",
  "Belize",
  "Bolivia",
  "Brazil",
];

export const ASIAN_COUNTRIES = [
  "China",
  "India",
  "Korea, Republic of",
  "South Korea",
  "Myanmar",
  "Pakistan",
  "Viet Nam",
  "Cambodia",
  "Turkey",
  "Türkiye",
];

export const SDG_TITLES = [
  { id: 1, name: "Fin de la pobreza" },
  { id: 2, name: "Hambre cero" },
  { id: 3, name: "Salud y bienestar" },
  { id: 4, name: "Educación de calidad" },
  { id: 5, name: "Igualdad de género" },
  { id: 6, name: "Agua limpia y saneamiento" },
  { id: 7, name: "Energía asequible y no contaminante" },
  { id: 8, name: "Trabajo decente y crecimiento económico" },
  { id: 9, name: "Industria, innovación e infraestructura" },
  { id: 10, name: "Reducción de las desigualdades" },
  { id: 11, name: "Ciudades y comunidades sostenibles" },
  { id: 12, name: "Producción y consumo responsables" },
  { id: 13, name: "Acción por el clima" },
  { id: 14, name: "Vida submarina" },
  { id: 15, name: "Vida de ecosistemas terrestres" },
  { id: 16, name: "Paz, justicia e instituciones sólidas" },
  { id: 17, name: "Alianzas para lograr los objetivos" },
];

export const loom_video =
  "https://www.loom.com/share/316a1943f8e94ca1a0a0b80b6c053b6a";

export const plans = [
  {
    title: "Nivel Avanzado",
    description:
      "Ideal para empresas que buscan automatización y seguimiento detallado.",
    features: [
      "Seguimiento de Alcances 1, 2 y 3",
      "Informes automáticos",
      "Asistentes por correo electrónico",
      "Recordatorios de seguimiento",
      "Evidencias de sub cumplimiento",
      "Alertas personalizadas",
    ],
    popular: false,
  },
  {
    title: "Nivel Premium",
    description:
      "Ideal para empresas que requieren personalización y asesoría especializada.",
    features: [
      "Todas las funciones del Nivel Avanzado",
      "Personalización integral de informes y paneles de control",
      "Integraciones con herramientas personalizadas",
      "Asesoría y soporte especializado",
      "SLA de soporte preferencial",
    ],
    popular: true,
  },
  {
    title: "Nivel MultiSitio",
    description:
      "Ideal para empresas con múltiples ubicaciones y operaciones complejas.",
    features: [
      "Ajustes personalizados según región o sucursal",
      "Monitoreo de EUD y resistencia",
      "Consolidación de BD en tiempo real",
      "Reportes comparativos entre sitios",
      "Adaptación de costos según el complejo",
    ],
    popular: false,
  },
];

export const SPECIFICATION_OPTIONS = [
  { value: "mini", label: "Mini" },
  { value: "supermini", label: "Supermini" },
  { value: "lower_medium", label: "Medio bajo" },
  { value: "upper_medium", label: "Medio alto" },
  { value: "executive", label: "Ejecutivo" },
  { value: "luxury", label: "Lujo" },
  { value: "sports", label: "Deportivo" },
  { value: "dual_purpose_4x4", label: "4x4 de doble propósito" },
  { value: "mpv", label: "Monovolumen" },
  { value: "average", label: "Promedio" },
];

export const DETAIL_OPTIONS = [
  { value: "diesel", label: "Diésel" },
  { value: "petrol", label: "Gasolina" },
  { value: "battery_electric_vehicle", label: "Vehículo eléctrico de batería" },
  {
    value: "plug-in_hybrid_electric_vehicle",
    label: "Vehículo eléctrico híbrido enchufable",
  },
  { value: "average", label: "Promedio" },
];

export const HOTEL_CODES = [
  "fr",
  "de",
  "in",
  "id",
  "cr",
  "eg",
  "uk",
  "au",
  "be",
  "br",
  "ca",
  "cl",
  "cn",
  "co",
  "it",
  "jp",
  "jo",
  "kp",
  "my",
  "mv",
  "mx",
  "nl",
  "om",
  "ph",
  "pt",
  "qa",
  "ru",
  "sa",
  "sg",
  "za",
  "es",
  "ch",
  "th",
  "tr",
  "ae",
  "us",
  "average",
] as const;

export type HotelCode = (typeof HOTEL_CODES)[number];

export const HOTEL_OPTIONS = [
  { label: "France", value: "fr" },
  { label: "Germany", value: "de" },
  { label: "India", value: "in" },
  { label: "Indonesia", value: "id" },
  { label: "Costa Rica", value: "cr" },
  { label: "Egypt", value: "eg" },
  { label: "United Kingdom", value: "uk" },
  { label: "Australia", value: "au" },
  { label: "Belgium", value: "be" },
  { label: "Brazil", value: "br" },
  { label: "Canada", value: "ca" },
  { label: "Chile", value: "cl" },
  { label: "China", value: "cn" },
  { label: "Colombia", value: "co" },
  { label: "Italy", value: "it" },
  { label: "Japan", value: "jp" },
  { label: "Jordan", value: "jo" },
  { label: "North Korea", value: "kp" },
  { label: "Malaysia", value: "my" },
  { label: "Maldives", value: "mv" },
  { label: "Mexico", value: "mx" },
  { label: "Netherlands", value: "nl" },
  { label: "Oman", value: "om" },
  { label: "Philippines", value: "ph" },
  { label: "Portugal", value: "pt" },
  { label: "Qatar", value: "qa" },
  { label: "Russia", value: "ru" },
  { label: "Saudi Arabia", value: "sa" },
  { label: "Singapore", value: "sg" },
  { label: "South Africa", value: "za" },
  { label: "Spain", value: "es" },
  { label: "Switzerland", value: "ch" },
  { label: "Thailand", value: "th" },
  { label: "Turkey", value: "tr" },
  { label: "United Arab Emirates", value: "ae" },
  { label: "United States", value: "us" },
  { label: "Average", value: "average" },
];

export const CLOUD_PROVIDER_MAP: Record<string, string> = {
  "Other cloud provider": "average",
  "Amazon Web Services": "aws",
  "Microsoft Azure": "azure",
  "Google Cloud Platform": "gcp",
};

export const LOCATION_MAPS: Record<string, Record<string, string>> = {
  aws: {
    Average: "average",
    "North America": "us-east-1",
    Europe: "eu-west-1",
    Asia: "ap-northeast-1",
    "South America": "sa-east-1",
    Africa: "af-south-1",
  },
  azure: {
    Average: "average",
    "North America": "north-central-us",
    Europe: "north-europe",
    Asia: "east-asia",
    "South America": "south-central-us",
    Africa: "average",
  },
  gcp: {
    Average: "average",
    "North America": "us-east-1",
    Europe: "europe-west-1",
    Asia: "asia-southeast-1",
    "South America": "southamerica-east-1",
    Africa: "average",
  },
  average: {
    Average: "average",
    "North America": "average",
    Europe: "average",
    Asia: "average",
    "South America": "average",
    Africa: "average",
  },
};

export const specificationAirOptions: string[] = [
  "short-haul",
  "long-haul",
  "average",
];
export const detailAirOptionsMapping: { [key: string]: string[] } = {
  "short-haul": ["economy_class", "business_class", "average"],
  "long-haul": [
    "first_class",
    "premium_economy_class",
    "economy_class",
    "business_class",
  ],
  average: [
    "first_class",
    "premium_economy_class",
    "economy_class",
    "business_class",
  ],
};

export const specificationAirLabels: Record<string, string> = {
  "short-haul": "Vuelo Corto",
  "long-haul": "Vuelo Largo",
  average: "Promedio",
};

export const detailAirLabels: Record<string, string> = {
  economy_class: "Clase Económica",
  business_class: "Clase Ejecutiva",
  first_class: "Primera Clase",
  premium_economy_class: "Económica Premium",
  average: "Promedio",
};

export const BUS_SPEC_OPTIONS = [
  { label: "Tráfico local", value: "local_bus" },
  { label: "Larga distancia", value: "coach" },
];

export const TRIP_TYPE_OPTIONS = [
  { label: "Viaje de ida", value: false },
  { label: "Viaje de ida y vuelta", value: true },
];

export const TRAIN_TYPE_OPTIONS = [
  { label: "Nacional", value: "national_rail" },
  { label: "Internacional", value: "international_rail" },
  { label: "Tráfico local", value: "light_rail_and_tram" },
];

export const TRAIN_TRIP_TYPE_OPTIONS = [
  { label: "Viaje de ida", value: false },
  { label: "Viaje de ida y vuelta", value: true },
];

export const FUEL_SPECIFICATION_MAP: Record<string, string> = {
  Gasoline: "petrol_average_biofuel_blend",
  E10: "petrol_100%_mineral_petrol",
  E85: "petrol_average_biofuel_blend",
  Diesel: "diesel_100%_mineral_diesel",
};

export const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6330",
  "#3624EB",
  "#FFCE56",
];

export const CHART_COLORS = {
  alcance: ["#96CF9C", "#8DB7E5", "#E2B370"],
  categorias: COLORS,
  edificios: COLORS,
};
