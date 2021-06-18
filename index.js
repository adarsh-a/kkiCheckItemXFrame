const axios = require('axios');
var config = require('./config/config');

async function getItemDetail(query,path)
{    
    let result = await axios.get(query).then((response) => {
        let items = response.data.documents;
        let numFound = response.data.numFound;
        if(numFound > 0)
        {
            for(let i=0;i< numFound;i++)
            {
              let routePath = items[i].string1;
              if(path == routePath)
              {
                  let id=items[i].id;
                  return id;
              }
            }
        }
        return '';
        
    }).catch(err => {
        console.error('api request error1', err);
        return '';
    }); 
   
   return result;
}

async function getXFrameValue(query)
{    
    let itemData = await axios.get(query).then((response) => {
            return response.data.elements.xFrameOption.value;
    }).catch((error) => {
            console.error('api request error1', error);
            return '';
    });
    
    if(itemData!=='')
    {
        return itemData;
    }
    
    return 'allow';
    
}

function getHubId(domain)
{
    let hubs = config.hubs;
    let hubId='';
    if(hubs.length > 0)
    {
        for(let i=0;i< hubs.length;i++)
        {
            if(domain == hubs[i].domain)
            {
                return hubs[i].hubId;
                
            }
        }        
    }
    return '';
}

function getLibraryId(culture)
{ 
    let libraries = config.libraries;   
    if(libraries.length > 0)
    {
        for(let i=0;i< libraries.length;i++)
        {
            if(libraries[i].code == culture)
            {
                return libraries[i].libraryId;
            }
        }        
    }

    return '';
}

function getContentTypes()
{
    let contentTypes=config.contentTypes;
    let contentTypeQuery='';

    if(contentTypes.length> 0)
    {
        for(let i=0;i< contentTypes.length;i++)
        {
            if(contentTypeQuery.length == 0)
            {
                contentTypeQuery='"'+contentTypes[i]+'"';
            }
            else
            {
                contentTypeQuery = contentTypeQuery+' OR "'+contentTypes[i]+ '"';
            }
        }
    }
    return contentTypeQuery;
}

function buildRoutesQuery(hubId,libraryId,contentTypes)
{
    let baseQuery=config.baseQuery.replace('#hubId#',hubId);
    let searchQuery=config.searchQuery;
    let mainQuery = config.queryMain;
    mainQuery=mainQuery.replace('#contenttypes#',contentTypes)
    .replace('#libraryid#',libraryId);

    let finalQuery=baseQuery+searchQuery+mainQuery;
    return finalQuery;
}

function buildItemQuery(hubId,contentId)
{
    let baseQuery=config.baseQuery.replace('#hubId#',hubId);
    let itemQuery=config.getItemById + contentId;
    let finalQuery=baseQuery+itemQuery;
    return finalQuery;

}

exports.handler = async (event, context, callback) => {
    
    let path = event.Records[0].cf.request.uri;
    let domain = event.Records[0].cf.request.origin.custom.domainName;
    let itemPath = path.substring(6); 
    let culture = path.substring(1,6);    
    
    let hubId=getHubId(domain);
    let libraryId=getLibraryId(culture);
    let contentTypeQuery = getContentTypes();
    let routesQuery= buildRoutesQuery(hubId,libraryId,contentTypeQuery);
    let itemId = await getItemDetail(routesQuery,itemPath);  
    let itemQuery = buildItemQuery(hubId, itemId);
    let xFrameOption=await getXFrameValue(itemQuery);
    
    const response = event.Records[0].cf.response;
    const headers = response.headers;
    
    headers['x-frame-options'] = [{key: 'X-Frame-Options', value: xFrameOption}]; 
    headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block;'}]; 
    headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}]; 
    
    //Return modified response
    callback(null, response);

    return response;
};

