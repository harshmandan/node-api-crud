
  
# FELB2BNode
FunEduLearn Coaching Tech

# Installation & Usage  

  Installation:
   - Clone this repo.
   - Then run `npm install` to install dependencies
   - Then start the nodejs server using `npm start`

 
# Documentation

**Local Host with Port**: `localhost:3099`

## Authentication routes:

**Login**

- **POST**  `/auth/login`: Log-in with credentials.

Required params in the JSON body:
```json
{
	"email": "9461794955",
	"password":"EXMPL"
}
```
**Responses can be:**

| Status Code | Meaning |
| ------ | ------ |
| 200| Authentication successful. Returned a JWT |
| 400 | Error. See the error in the response body |
  
---

**Signup/Create New User**

- **POST**  `/auth/signup`: Sign-up with credentials.

Required params in the JSON body:
```json
{
	"email": "9461794955",
	"password":"EXMPL",
	"name": "Harsh"
}
```
**Responses can be:**

| Status Code | Meaning |
| ------ | ------ |
| 200| Sign-up and login successful. Returned a JWT |
| 400 | Error. See the error in the response body |
  

## User routes:

PS: All User routes require an **Authorization** header. **Example**:
| Header | Value |
| ------ | ------ |
| authorization| eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd.. |

---
**Get profile**

- **GET**  `/user/profile`: Log-in with credentials.:

**Responses can be:**

| Status Code | Meaning |
| ------ | ------ |
| 200| Success |
| 400 | Error. See the error in the response body |
  
---

**Update profile/Add address - Simple JSON**

- **POST**  `/user/update_profile`: Update user profile.

At least 1 parameter is required in the JSON body: The fields that can be updated are:
```json
{
	"name": "Harsh",
	"address": "ABC"
}
```
**Responses can be:**

| Status Code | Meaning |
| ------ | ------ |
| 200| Profile updated |
| 400 | Error. See the error in the response body |
 
  ---

**Update profile/Add address - JSON Patch**

- **POST**  `/user/patch_json`: Update user profile.

Send JSON object to be patched as `doc` and the patch as `patch`. Example:
```json
"patch": [
	{ "op": "replace", "path": "/baz", "value": "boo" },
	{ "op": "add", "path": "/hello", "value": ["world"] },
	{ "op": "remove", "path": "/foo" }
],
"doc": {
	 "baz":  "qux",
	 "foo":  "bar"
}
```
Note: Above request would update the name and unset/remove the address.

**Responses can be:**

| Status Code | Meaning |
| ------ | ------ |
| 200| Document Patched |
| 400 | Error. See the error in the response body |
  
   ---

**Generate thumbnail**

- **POST**  `/user/generate_thumbnail`: Generate a thumbnail.

Required parameter in the JSON body:

```json
"link": "https://www.nasa.gov/sites/default/files/thumbnails/image/mars2020-sample-tubes.jpg"
```

**Responses can be:**

| Status Code | Meaning |
| ------ | ------ |
| 200| Success |
| 400 | Error. See the error in the response body |
  
  
## End