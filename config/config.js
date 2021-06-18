let config = {};
config.hubs=[
	{domain:'uat.kyowakirinhub.com', hubId:'hub-id'},
	{domain:'kki-hub-dev.rapp-customers.co.uk', hubId:'hub-id'},
	{domain:'kki-hub.rapp-customers.co.uk', hubId:'hub-id'},
	{domain:'hww.kkihub.s3-website.us-east-2.amazonaws.com', hubId:'37dd7bf6-5628-4aac-8464-f4894ddfb8c4'},
	{domain:'kyowakirinhub.com', hubId:'hub-id'}
]



config.contentTypes=['Layout+H+-+Content+promo','Layout C+-+Main+therapy+page','Layout+E+-+Article',
'Layout+D+-+Content+list+page','Layout+D+-+Content+list+page','Layout+G+-+Main+Promo+Page','Layout+K+-+Generic+page',
'Layout+-+Veeva+player+page','Layout+J+-+Main+Promo+Page+Alternate','Layout+-+Content+page','Layout+-+Pre-registration+page',
'Layout+E+-+Dynamic+article','Layout+F+-+Dynamic+content+page','eDetailer+Page'];


config.libraries = [
  { code: 'de-de',libraryId: '040d342f-c78d-44c2-872c-b5f0acd07d6b'},
  { code: 'en-ie',libraryId: '4838a63c-9cd1-4d4e-a28e-3db6fda6ac38'},
  { code: 'fr-fr',libraryId: '95cc85ac-1669-4088-bcd2-c8fff18bd617'},
  { code: 'it-it',libraryId: 'dd57ecba-c892-4303-b61a-ae43c17c7fbf'},
  { code: 'nl-nl',libraryId: '0a861b00-ad92-4d19-b851-443f11c4a683'},
  { code: 'no-no',libraryId: 'c8d215b7-2b92-42c7-b8bf-22ce07727798'},
  { code: 'en-gb',libraryId: '77d05f48-8ade-4160-be16-09a97605c322'},
  { code: 'es-es',libraryId: '064d499c-fad8-46bf-96d9-99a1c323743f'},
  { code: 'en-sa',libraryId: 'ba7ed98d-e84f-40c7-abd9-a0614f400766'}
];

config.baseQuery='https://content-eu-1.content-cms.com/api/#hubId#/delivery/v1/';
config.searchQuery='search';
config.getItemById='rendering/context/';
config.queryMain ='?q=*:*&fl=name%2Cstring1%2Cid%2Cclassification%2Ctype%2Cstatus&fq=type%3A%28#contenttypes#%29&rows=10000&start=0&fq=libraryId%3A%28#libraryid#%29';



module.exports = config;