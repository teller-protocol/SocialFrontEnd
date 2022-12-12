// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}

// var axios = require('axios');
// var qs = require('qs');
// var data = qs.stringify({

// });
// var config = {
//   method: 'get',
//   url: 'http://127.0.0.1:8000/elonmusk',
//   headers: {
//     'accept': 'application/json'
//   },
//   data: data
// };

// axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
