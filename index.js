const axios = require('axios');
const config = {
    bearer_token: "AAAAAAAAAAAAAAAAAAAAAIQi9gAAAAAARwNABNifDYARYY1z%2FGUVf1L3xj8%3Di5dvnFW837nagtmoOIhgwWg3a0Wqtlc9e9u1ZhzU9omJtmBKBC"
};
const TWITTER_BASE_URL = "https://api.twitter.com/1.1/statuses/user_timeline.json";
const TWEET_COUNT = 2;

// Function to return all tweets by a user
getUserTweets = (username) => {

    //Build request options
    let options = {
        headers: {
            'Authorization': 'Bearer ' + config.bearer_token
        }
    }

    //Build Options
    let url = `${TWITTER_BASE_URL}?screen_name=${username}&count=${TWEET_COUNT}`;

    axios.get(url, options)
        .then(response => {
            response.data.map(tweets => {
                console.log(tweets.text);
            })
        })
        .catch(error => {
            console.log("error", error);
        });

}


getUserTweets("cj2samuel");

