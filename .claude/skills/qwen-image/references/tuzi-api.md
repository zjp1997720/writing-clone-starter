# Tuzi API reference (image generation)

Base URL:

- `https://api.tu-zi.com`

Auth:

- Header: `Authorization: Bearer <API_KEY>`
- Header: `Content-Type: application/json`

Endpoint:

- `POST /v1/images/generations`

Example request body:

```json
{
  "model": "qwen-image-2.0",
  "prompt": "...",
  "size": "2048x1152",
  "n": 1
}
```

Observed response shapes (Tuzi may vary by gateway/version):

Shape A:

```json
{
  "data": {
    "created": 1736160000,
    "images": [{ "url": "https://..." }]
  }
}
```

Shape B:

```json
{
  "created": 1771688121,
  "data": [{ "url": "https://..." }]
}
```

Notes:

- Some models return a larger internal resolution than requested; postprocess if you need exact `2048x1152`.
