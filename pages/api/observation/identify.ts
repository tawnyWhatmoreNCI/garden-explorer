import OpenAI, { ClientOptions } from 'openai'
import * as dotenv from 'dotenv'
import { kMaxLength } from 'buffer'
dotenv.config()

//reference: https://platform.openai.com/docs/guides/vision?lang=node


export async function POST(request: Request) {

  var userDescription = ""
  var prompt = `Your job is to identify the species of animal, plant or fungi present in the given image.
  {userDescription}
  If there is an animal and a plant, opt to identify the animal as priority.
  Populate the following JSON object with the appropriate details. 
  The JSON description field should be a brief introduction and/or some facts about the species.
  If the image does not contain a plant, animal, or fungi, return an error JSON object with a meaningful message.
  
  JSON Object Template:
  {
      "common_name": "{Generate}",
      "scientific_name": "{Generate}",
      "kingdom": "{Generate}",
      "phylum": "{Generate}",
      "class": "{Generate}",
      "order": "{Generate}",
      "family": "{Generate}",
      "genus": "{Generate}",
      "species": "{Generate}",
      "description": "{Generate}"
  }
  
  Error JSON Template:
  {
      "error": "The image does not contain a recognizable plant, animal, or fungi."
  }`
  


  
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
    }


    // Parse JSON body from the request
    const requestBody = await request.json()
    const mediaUrl = requestBody.mediaUrl
    const userGivenDescription = requestBody.description
    const hasGardenBalance = requestBody.hasGardenBalance

    if(!hasGardenBalance) {
      return new Response('You must own a Garden Explorer Token', { status: 403 })
  }

    // Validate file existence
    if (!mediaUrl) {
        return new Response('Media url not found in the request', {
            status: 400,
        })
    }

    //user dscription is optional
    if(userGivenDescription) {
        console.log(`User description: ${userGivenDescription}`)
        userDescription = `I have found this species and it looks like ${userGivenDescription}`

    }
    prompt = prompt.replace("{userDescription}", userDescription)
   
    //validate media url is from gardenexplorer blob.
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME
    if (!mediaUrl.includes(`${account}.blob.core.windows.net`)) {
        return new Response('Media url is not from a Garden Explorer store.', {
            status: 400,
        })
    }
    //media url is okay.
    console.log(`About to identify: ${mediaUrl} with prompt ${prompt}`)
    
    //open ai 
    const openAiKey: ClientOptions = {
        apiKey: process.env.OPENAI_API_KEY
      };

      const openai = new OpenAI(openAiKey);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 1, //lower temperature for more accurate, truthful results
        messages: [ //message for model context 
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  "url": mediaUrl,
                },
              },
            ],
          },
        ],
      });
      //we expect the response to be a JSON object because that's what we asked for. I hope this approach is reliable. 
      //if response is not there, we can return json error string. 
        var responseData: string = response.choices[0].message.content ?? `{ "error": "No response from OpenAI" }`;
    
    
   
    /*//sending back dummy while testing so as not to waste OpenAI tokens
    var responseData: string = `
      {
          "common_name": "Honeybee",
          "scientific_name": "Apis mellifera",
          "kingdom": "Animalia",
          "phylum": "Arthropoda",
          "class": "Insecta",
          "order": "Hymenoptera",
          "family": "Apidae",
          "genus": "Apis",
          "species": "Apis mellifera",
          "description": "The honeybee is a social insect known for its role in pollination and producing honey. They live in colonies and are vital for the ecosystem.",
          "id_confidence_level": 5
      }`*/

    //clean up backticks and other strange characters so it doesn't fail to parse later.
    responseData = responseData.replace(/[`]|json/g, '')
    console.log(`Response from OpenAI: ${responseData}`)
    return new Response(responseData, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
