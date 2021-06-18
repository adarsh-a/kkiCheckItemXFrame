const axios = require('axios');

async function getItemDetail(domain,path,culture)
{
    
    let xframeOption = "allow";
      //hardcode domain - to non prod 8 for Uk site
    let itemRoutesUrl = "https://content-eu-1.content-cms.com/api/37dd7bf6-5628-4aac-8464-f4894ddfb8c4/delivery/v1/search?q=*%3A*";
    itemRoutesUrl=itemRoutesUrl+"&fl=name%2Cstring1%2Cid%2Cclassification%2Ctype%2Cstatus&fq=type%3A%28%22Layout+H+-+Content+promo%22+OR+%22Layout";
    itemRoutesUrl=itemRoutesUrl +"+C+-+Main+therapy+page%22+OR+%22Layout+E+-+Article%22+OR+%22Layout+D+-+Content+list+page%22+";
    itemRoutesUrl=itemRoutesUrl+"OR+%22Layout+G+-+Main+Promo+Page%22+OR+%22Layout+K+-+Generic+page%22+OR+%22Layout+-";
    itemRoutesUrl=itemRoutesUrl +"+Veeva+player+page%22+OR+%22Layout+J+-+Main+Promo+Page+Alternate%22+OR+%22Layout+-+Content+page%22+OR+%22Layout+-";
    itemRoutesUrl=itemRoutesUrl  +"+Pre-registration+page%22+OR+%22Layout+E+-+Dynamic+article%22+OR+%22Layout+F+-+Dynamic+content+page%22+OR";
    itemRoutesUrl=itemRoutesUrl  +"+%22eDetailer+Page%22%29&rows=10000&start=0&fq=libraryId%3A%28%2277d05f48-8ade-4160-be16-09a97605c322%22%29";
    
    let result = await axios.get(itemRoutesUrl).then((response) => {
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
                  return {code:"ok", data:id};
              }
            }
        }
        return{code:"fail"};
        
    }).catch(err => {
        return {
            code: "fail",
            data: err
        }
    });
    
    if(result.code =="ok")
    {
        let id=result.data;
        let itemDataPath = "https://content-eu-1.content-cms.com/api/37dd7bf6-5628-4aac-8464-f4894ddfb8c4/delivery/v1/rendering/context/"+id;
        let itemData = await axios.get(itemDataPath).then((response) => {
                return response.data.elements.xFrameOption.value;
        }).catch((error) => {
              console.error('api request error1', error);
              return "allow";
        });
        
        xframeOption = itemData;
    }
    
    return xframeOption;
    
}

exports.handler = async (event, context, callback) => {
    /*
     * Generate HTTP response using 200 status code with a simple body.
     */
     
    let path = event.Records[0].cf.request.uri;
    let domain = event.Records[0].cf.request.origin.custom.domainName;
    let itempath = path.substring(6); 
    let culture = path.substring(1,6); 
    let xframeOption = await getItemDetail(domain,itempath,culture);
   
    const response = event.Records[0].cf.response;
    const headers = response.headers;
   
   let xssP = '1; mode=block;path='+path + ' domain='+domain +' culture='+culture;

    headers['x-frame-options'] = [{key: 'X-Frame-Options', value: xframeOption}]; 
    headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: xssP}]; 
    headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}]; 
    
    //Return modified response
    callback(null, response);

    return response;
};

