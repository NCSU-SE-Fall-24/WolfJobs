## APIs

### Login

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/create-session`

**Response 1:**
```json
res.json(422, {
  "message": "Invalid username or password"
});
```

**Response 2:**
```json
res.json(200, {
  "message": "Sign In Successful, here is your token, please keep it safe",
  "data": {
    "token": jwt.sign(user.toJSON(), "wolfjobs", { expiresIn: "100000" }),
    "user": user
  },
  "success": true
});
```

### Sign Up

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/signup`

**Response 1:**
```json
res.json(422, {
  "message": "Passwords do not match"
});
```

**Response 2:**
```json
res.json(200, {
  "message": "Sign Up Successful, here is your token, please keep it safe",
  "data": {
    "token": jwt.sign(user.toJSON(), "wolfjobs", { expiresIn: "100000" }),
    "user": user
  },
  "success": true
});
```

**Response 3:**
```json
res.json(500, {
  "message": "Internal Server Error"
});
```

### Edit Profile

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/edit`

**Response 1:**
```json
res.json(200, {
  "message": "User is updated Successfully",
  "data": { "user": user },
  "success": true
});
```

**Response 2:**
```json
res.json(500, {
  "message": "Internal Server Error"
});
```

**Response 3:**
```json
res.json(400, {
  "message": "Bad Request"
});
```

### Create Job

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/createjob`

**Response 1:**
```json
res.json(200, {
  "data": { "job": job },
  "message": "Job Created!!",
  "success": true
});
```

**Response 2:**
```json
res.json(500, {
  "message": "NOT CREATED"
});
```

### Close Job

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/closejob`

**Response 1:**
```json
res.json(200, {
  "message": "Job is updated Successfully",
  "data": { "job": job },
  "success": true
});
```

**Response 2:**
```json
res.json(500, {
  "message": "Internal Server Error"
});
```

### Create Application

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/createapplication`

**Response 1:**
```json
res.json(400, {
  "message": "You have already applied for the job",
  "error": true
});
```

**Response 2:**
```json
res.json(200, {
  "data": { "application": application },
  "message": "Job Created!!",
  "success": true
});
```

**Response 3:**
```json
res.json(500, {
  "message": "NOT CREATED"
});
```

---

### Save Job

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/savejob`

**Description:** Saves a job to the user's list of saved jobs if `jobId` is provided. If no `jobId` is provided, returns the list of all saved jobs.

**Response 1:**
```json
res.json(404, {
  "message": "User not found",
  "success": false
});
```

**Response 2 (Save Job):**
```json
res.json(200, {
  "message": "Job saved successfully",
  "success": true,
  "data": user.savedJobs
});
```

**Response 3 (Retrieve Saved Jobs):**
```json
res.json(200, {
  "message": "List of saved jobs retrieved successfully",
  "success": true,
  "data": user.savedJobs
});
```

**Response 4 (Error):**
```json
res.json(500, {
  "message": "Internal Server Error",
  "error": "Error message here",
  "success": false
});
```

### Unsave Job

- **Method:** `POST`
- **Endpoint:** `/api/v1/users/unsavejob`

**Description:** Removes a job from the user's list of saved jobs.

**Response 1:**
```json
res.json(404, {
  "message": "User not found",
  "success": false
});
```

**Response 2:**
```json
res.json(200, {
  "message": "Job unsaved successfully",
  "success": true,
  "data": user.savedJobs
});
```

**Response 3 (Error):**
```json
res.json(500, {
  "message": "Internal Server Error",
  "error": "Error message here",
  "success": false
});
```