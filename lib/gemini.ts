import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi=new GoogleGenerativeAI( `AIzaSyB9Xce5hD4YcAr9nUYXY6DzviZ_Yd1aUJ0`);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

export const summarize=async(diff:string)=>{
    const response=await model.generateContent([
`wxplain this commit  every thing which are in this
please summrize this whole commit file \n\n${diff}

`
    ])
    return response.response.text()
}


async function main() {
    console.log(await summarize(``))
}
main()
