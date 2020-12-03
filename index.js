const axios = require('axios');
const CONFIG = {
    bearer_token_twitter: "AAAAAAAAAAAAAAAAAAAAAIQi9gAAAAAARwNABNifDYARYY1z%2FGUVf1L3xj8%3Di5dvnFW837nagtmoOIhgwWg3a0Wqtlc9e9u1ZhzU9omJtmBKBC",
    bearer_token_ibm: "eyJraWQiOiIyMDE3MTEyOSIsImFsZyI6IlJTMjU2In0.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLWFiOWMzNTQ5LWIyYjEtNDVmNC1hZGQwLTRmMmQyZTk0NzRjZCIsImlkIjoiaWFtLVNlcnZpY2VJZC1hYjljMzU0OS1iMmIxLTQ1ZjQtYWRkMC00ZjJkMmU5NDc0Y2QiLCJyZWFsbWlkIjoiaWFtIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC1hYjljMzU0OS1iMmIxLTQ1ZjQtYWRkMC00ZjJkMmU5NDc0Y2QiLCJzdWIiOiJTZXJ2aWNlSWQtYWI5YzM1NDktYjJiMS00NWY0LWFkZDAtNGYyZDJlOTQ3NGNkIiwic3ViX3R5cGUiOiJTZXJ2aWNlSWQiLCJ1bmlxdWVfaW5zdGFuY2VfY3JucyI6WyJjcm46djE6Ymx1ZW1peDpwdWJsaWM6bmF0dXJhbC1sYW5ndWFnZS11bmRlcnN0YW5kaW5nOmV1LWdiOmEvMTA1ODVkYjZkMWFmNDIyOWUxMzRmZTg3ZmI2NzU3ZTA6YTIxYjRhOTYtMzM3Ni00ZmMyLTlmMWUtZjgzY2M1MGRhYzM0OjoiXSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiMTA1ODVkYjZkMWFmNDIyOWUxMzRmZTg3ZmI2NzU3ZTAifSwiaWF0IjoxNTUyNTYzNTgyLCJleHAiOjE1NTI1NjcxODIsImlzcyI6Imh0dHBzOi8vaWFtLmJsdWVtaXgubmV0L2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.jbLS2NWbVwu4LK9AUDHq62jjFNuu57rn0F7-zludkpZ6NvavFOhhPDHpF9ZDcb91jLq-8GD_QImEs6t9gSuPH0XvGWCUb3ubZNxVIrqyqi7zzt4TG1FuhyiZx7rkonQqio2aqHijA8FbdolweAbOOjRtlxsQ7pXpNxjjm-VtrVg4mzMk0aW9xQC4GVITF5UBXfEdNDTvWqJruNr8NBHCap_5FQPp4bvEhFsuuwBcmZVDn6gwc3DeT2w10TID8BOciPuSVN5MgUHlrN0SGIJ-HK7BRZg-dnz0VgJhlWDaZ6xJX1PQbjPOP7WhsZRVLknbphT3PfICM6dr4e3D0WxwcQ"
};
const TWITTER_BASE_URL = "https://api.twitter.com/1.1/statuses/user_timeline.json";
const TWEET_COUNT = 50;
const IBM_NLU_BASE_URL = "https://gateway-lon.watsonplatform.net/natural-language-understanding/api/v1/analyze";
const IBM_NLU_VERSION = "2018-11-16";
const IBM_NLU_CATEGORY = "categories";
let note = "";

// Function to return all tweets by a user
getUserTweets = (username) => {

    console.log("--- Getting Tweet ---");

    //Build request options
    let options = {
        headers: {
            'Authorization': 'Bearer ' + CONFIG.bearer_token_twitter
        }
    }

    //Build Twitter URL
    let url = `${TWITTER_BASE_URL}?screen_name=${username}&count=${TWEET_COUNT}`;

    //Make a request to Twitter API
    axios.get(url, options)
        .then(response => {

            console.log("--- Tweet Found ---");

            //concatenate each tweet to form a note.
            response.data.map(tweets => {
                convertTweetsToNote(tweets.text);
            })

            //Analyze the note.
            analyzeNote(note);
        })
        .catch(error => {
            console.log("--- Tweet Error ---", error);
            console.log("error", error);
        });

}

convertTweetsToNote = (tweet) => {
    //  console.log("--- converting Tweets to Note ---");
    //Remove Special Characters
    let cleanedTweet = tweet.replace(/[^a-zA-Z0-9 ]/g, "")
    // let cleanedTweet = tweet.replace(/[!@#$%^&*]/g, ""); 

    note += `${cleanedTweet}. `;

}

analyzeNote = (note) => {
    console.log("Note ---- >", note);
    console.log("--- Analyzing Note ---");

    //Build request options
    let options = {
        headers: {
            'Authorization': 'Bearer ' + CONFIG.bearer_token_ibm
        }
    }

    //Build IBM URL
    let url = `${IBM_NLU_BASE_URL}?version=${IBM_NLU_VERSION}&text=${note}&features=${IBM_NLU_CATEGORY}`;

    //Make a request to IBM API
    axios.get(url, options)
        .then(response => {
            console.log("------ Success. Note Was Analyzed ------");
            console.log(response.data);
        })
        .catch(error => {
            console.log("--- Failed to Analyze Note ---", error.message);

            //TODO : if response is 401 unauthorized, make a request to IBM endpoint to refresh the token and make a new request.
            console.log("error", error.message);
        });
}



getUserTweets("michael_vons");

