# ReciPro API

* **URL**
https://recipro-api.onrender.com/api/users

  * **Method:**
  `POST` 

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
    `fetch('https://recipro-api.onrender.com/api/users',{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({user_name: "username", password: "Password!0"})})`

* **URL**
https://recipro-api.onrender.com/api/auth/login

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
    `fetch('https://recipro-api.onrender.com/api/auth/login',{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({user_name: "username", password: "Password!0"})})`
    
* **URL**
https://recipro-api.onrender.com/api/auth/refresh

  * **Method:**
  `POST` 

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:**
      `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc" }`

  * **Sample Call:**
    `fetch('https://recipro-api.onrender.com/api/auth/refresh',{method:'POST', headers: {content-type: 'application/json','authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}}})`

* **URL**
https://recipro-api.onrender.com/api/fridge-categories

  * **Method:**
  `GET`, `POST` 

  * **Data Params**
    `{ name: "category name" }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 9, "name": "category name", "userid": 1}, {"id": 20, "name": "category name 1", "userid": 1 }]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 9, "name": "category name", "userid": 1}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 9, "name": "category name", "userid": 1}`

  * **Error Response:**
    * GET
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Category doesn't exist'} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`

  * **Sample Call:**
    * POST
    `fetch('https://recipro-api.onrender.com/api/fridge-categories',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "category name"})})`
    * GET
    `fetch('https://recipro-api.onrender.com/api/fridge-categories',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://recipro-api.onrender.com/api/fridge-categories/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`

* **URL**
https://recipro-api.onrender.com/api/pantry-categories

  * **Method:**
  `GET`, `POST` 

  * **Data Params**
    `{ name: "category name" }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 9, "name": "category name", "userid": 1}, {"id": 20, "name": "category name 1", "userid": 1 }]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 9, "name": "category name", "userid": 1}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 9, "name": "category name", "userid": 1}`

  * **Error Response:**
    * GET
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Category doesn't exist'} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`

  * **Sample Call:**
    * POST
    `fetch('https://recipro-api.onrender.com/api/pantry-categories',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "category name"})})`
    * GET
    `fetch('https://recipro-api.onrender.com/api/pantry-categories',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://recipro-api.onrender.com/api/pantry-categories/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`

* **URL**
https://recipro-api.onrender.com/api/fridge-items

  * **Method:**
  `GET`, `POST`, `DELETE`, `PATCH`

  * **Data Params**
    `{ name: "item name", expiration: "2020-11-11", categoryid: 1 }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 11,"name": "testing","modified": "2019-11-24T20:54:19.617Z","expiration": "2019-11-29","note": "","categoryid":1,"userid": 2}]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 11,"name": "testing","modified": "2019-11-24T20:54:19.617Z","expiration": "2019-11-29","note": "","categoryid":1,"userid": 2}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 11,"name": "testing","modified": "2019-11-24T20:54:19.617Z","expiration": "2019-11-29","note": "","categoryid":1,"userid": 2}`    
    * DELETE/PATCH
      **Code:** 204<br />
      
  * **Error Response:**
    * GET/DELETE/PATCH
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Item doesn't exist'} }`
    * PATCH
      **Code:** 400 <br />
      **Content:**
      `{ error: {message: "Request body must contain either 'name', 'expiration', 'note', or 'categoryid'"} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'expiration' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'categoryid' in request body' }`
      
  * **Sample Call:**
    * POST
    `fetch('https://recipro-api.onrender.com/api/frige-items',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "item name", expiration: "2020-11-11", note: "", categoryid: 1})})`
    * GET
    `fetch('https://recipro-api.onrender.com/api/frige-items',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://recipro-api.onrender.com/api/frige-items/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * DELETE (:id)
    `fetch('https://recipro-api.onrender.com/api/frige-items/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * PATCH (:id)
    `fetch('https://recipro-api.onrender.com/api/frige-items/1',{method:'GET', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "item name", expiration: "2020-11-11", note: "", categoryid: 1})})`
    
* **URL**
https://recipro-api.onrender.com/api/pantry-items

  * **Method:**
  `GET`, `POST`, `DELETE`, `PATCH`

  * **Data Params**
    `{ name: "item name", expiration: "2020-11-11", categoryid: 1 }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 11,"name": "testing","modified": "2019-11-24T20:54:19.617Z","expiration": "2019-11-29","note": "","categoryid":1,"userid": 2}]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 11,"name": "testing","modified": "2019-11-24T20:54:19.617Z","expiration": "2019-11-29","note": "","categoryid":1,"userid": 2}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 11,"name": "testing","modified": "2019-11-24T20:54:19.617Z","expiration": "2019-11-29","note": "","categoryid":1,"userid": 2}`    
    * DELETE/PATCH
      **Code:** 204<br />
      
  * **Error Response:**
    * GET/DELETE/PATCH
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Item doesn't exist'} }`
    * PATCH
      **Code:** 400 <br />
      **Content:**
      `{ error: {message: "Request body must contain either 'name', 'expiration', 'note', or 'categoryid'"} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'expiration' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'categoryid' in request body' }`

  * **Sample Call:**
    * POST
    `fetch('https://recipro-api.onrender.com/api/pantry-items',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "item name", expiration: "2020-11-11", note: "", categoryid: 1})})`
    * GET
    `fetch('https://recipro-api.onrender.com/api/pantry-items',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://recipro-api.onrender.com/api/pantry-items/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * DELETE (:id)
    `fetch('https://recipro-api.onrender.com/api/pantry-items/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * PATCH (:id)
    `fetch('https://recipro-api.onrender.com/api/pantry-items/1',{method:'GET', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "item name", expiration: "2020-11-11", note: "", categoryid: 1})})`
    
 * **URL**
https://recipro-api.onrender.com/api/groceries

  * **Method:**
  `GET`, `POST` 

  * **Data Params**
    `{ name: "grocery name" }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 9, "name": "grocery name", "userid": 1}, {"id": 20, "name": "grocery name 1", "userid": 1 }]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 9, "name": "grocery name", "userid": 1}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 9, "name": "grocery name", "userid": 1}`

  * **Error Response:**
    * GET
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Grocery doesn't exist'} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`

  * **Sample Call:**
    * POST
    `fetch('https://recipro-api.onrender.com/api/groceries',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "category name"})})`
    * GET
    `fetch('https://recipro-api.onrender.com/api/groceries',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://recipro-api.onrender.com/api/groceries/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    
 * **URL**
https://recipro-api.onrender.com/api/recipes

  * **Method:**
  `GET`, `POST`, `DELETE`

  * **Data Params**
    `{"name": "Beef Stroganoff","image": "https://www.edamam.com/web-img/ba5/ba5f382509d84cc31530fdea39624072.jpg","url": "http://www.marthastewart.com/341384/beef-stroganoff","ingredients": ["1 pound beef tenderloin","Coarse salt and ground pepper","3 tablespoons canola oil","1 medium onion, thinly sliced","1 pound white mushrooms, sliced 1/2 inch thick","1 cup reduced-sodium canned beef broth","1 tablespoon dijon mustard","1/2 cup sour cream","Chopped fresh dill, for garnish"]}`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{["id": 16,"name": "Beef Stroganoff","image": "https://www.edamam.com/web-img/ba5/ba5f382509d84cc31530fdea39624072.jpg","url": "http://www.marthastewart.com/341384/beef-stroganoff","ingredients": ["1 pound beef tenderloin","Coarse salt and ground pepper","3 tablespoons canola oil","1 medium onion, thinly sliced","1 pound white mushrooms, sliced 1/2 inch thick","1 cup reduced-sodium canned beef broth","1 tablespoon dijon mustard","1/2 cup sour cream","Chopped fresh dill, for garnish"],"userid": 2]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 16,"name": "Beef Stroganoff","image": "https://www.edamam.com/web-img/ba5/ba5f382509d84cc31530fdea39624072.jpg","url": "http://www.marthastewart.com/341384/beef-stroganoff","ingredients": ["1 pound beef tenderloin","Coarse salt and ground pepper","3 tablespoons canola oil","1 medium onion, thinly sliced","1 pound white mushrooms, sliced 1/2 inch thick","1 cup reduced-sodium canned beef broth","1 tablespoon dijon mustard","1/2 cup sour cream","Chopped fresh dill, for garnish"],"userid": 2}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 16,"name": "Beef Stroganoff","image": "https://www.edamam.com/web-img/ba5/ba5f382509d84cc31530fdea39624072.jpg","url": "http://www.marthastewart.com/341384/beef-stroganoff","ingredients": ["1 pound beef tenderloin","Coarse salt and ground pepper","3 tablespoons canola oil","1 medium onion, thinly sliced","1 pound white mushrooms, sliced 1/2 inch thick","1 cup reduced-sodium canned beef broth","1 tablespoon dijon mustard","1/2 cup sour cream","Chopped fresh dill, for garnish"],"userid": 2}`    
    * DELETE
      **Code:** 204 <br />
      
  * **Error Response:**
    * GET/DELETE
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Recipe doesn't exist'} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'image' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'url' in request body' }`

  * **Sample Call:**
    * POST
    `fetch('https://recipro-api.onrender.com/api/recipes',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({"name": "Beef Stroganoff","image": "https://www.edamam.com/web-img/ba5/ba5f382509d84cc31530fdea39624072.jpg","url": "http://www.marthastewart.com/341384/beef-stroganoff","ingredients": ["1 pound beef tenderloin","Coarse salt and ground pepper","3 tablespoons canola oil","1 medium onion, thinly sliced","1 pound white mushrooms, sliced 1/2 inch thick","1 cup reduced-sodium canned beef broth","1 tablespoon dijon mustard","1/2 cup sour cream","Chopped fresh dill, for garnish"]})})`
    * GET
    `fetch('https://recipro-api.onrender.com/api/recipes',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://recipro-api.onrender.com/api/recipes/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * DELETE (:id)
    `fetch('https://recipro-api.onrender.com/api/recipes/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
