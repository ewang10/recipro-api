# ReciPro API

* **URL**
https://still-fjord-13060.herokuapp.com/api/users

  * **Method:**
  `POST` 

  *  **URL Params**
     **Required:**
    'user_name: [string]'
    'password: [string]'

  * **Data Params**
    `{ user_name: "username", password: "Password!0" }`

  * **Success Response:**
    * **Code:** 201 <br />
      **Content:**
      `{ "id": 9, "user_name": "username" }`

  * **Error Response:**
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Username already taken }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'user_name' in request body }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'password' in request body }`

  * **Sample Call:**
    `fetch('https://still-fjord-13060.herokuapp.com/api/users',{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({user_name: "username", password: "Password!0"})})`

* **URL**
https://still-fjord-13060.herokuapp.com/api/auth/login

  * **Method:**
  `POST` 

  *  **URL Params**
     **Required:**
    'user_name: [string]'
    'password: [string]'

  * **Data Params**
    `{ user_name: "username", password: "Password!0" }`

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:**
      `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc" }`

  * **Error Response:**
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Incorrect user_name or password }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'user_name' in request body }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'password' in request body }`

  * **Sample Call:**
    `fetch('https://still-fjord-13060.herokuapp.com/api/auth/login',{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({user_name: "username", password: "Password!0"})})`
    
* **URL**
https://still-fjord-13060.herokuapp.com/api/auth/refresh

  * **Method:**
  `POST` 

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:**
      `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc" }`

  * **Sample Call:**
    `fetch('https://still-fjord-13060.herokuapp.com/api/auth/refresh',{method:'POST', headers: {content-type: 'application/json','authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}}})`
