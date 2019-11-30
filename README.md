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

