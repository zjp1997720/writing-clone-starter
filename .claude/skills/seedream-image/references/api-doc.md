# Doubao Seedream API Documentation

## Endpoint

```
POST https://ark.cn-beijing.volces.com/api/v3/images/generations
```

## Authentication

```
Authorization: Bearer <SEEDREAM_API_KEY>
```

## Request Body

```json
{
  "model": "doubao-seedream-5-0-260128",
  "prompt": "图片描述",
  "sequential_image_generation": "disabled",
  "response_format": "url",
  "size": "2K",
  "stream": false,
  "watermark": true
}
```

### Parameters

| Parameter                      | Type    | Required | Description                          |
| ------------------------------ | ------- | -------- | ------------------------------------ |
| `model`                        | string  | Yes      | Model name: doubao-seedream-5-0-260128 |
| `prompt`                       | string  | Yes      | Image generation prompt              |
| `sequential_image_generation`  | string  | No       | "disabled" (default)                 |
| `response_format`              | string  | No       | "url" (default)                      |
| `size`                         | string  | No       | "2K" (default, 2048x1152)            |
| `stream`                       | boolean | No       | false (default)                      |
| `watermark`                    | boolean | No       | true (default)                       |

## Response

```json
{
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

## Example

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d '{
    "model": "doubao-seedream-5-0-260128",
    "prompt": "星际穿越，黑洞，电影大片",
    "response_format": "url",
    "size": "2K"
  }'
```

## Size Options

| Size Value | Dimensions  | Aspect Ratio |
| ---------- | ----------- | ------------ |
| "2K"       | 2048x1152   | 16:9         |
| "1K"       | 1024x1024   | 1:1          |
| Custom     | WxH format  | Custom       |

## Error Codes

| Code | Message                | Action                          |
| ---- | ---------------------- | ------------------------------- |
| 401  | Unauthorized           | Check API key                   |
| 429  | Rate limit exceeded    | Wait and retry                  |
| 500  | Internal server error  | Retry after a few seconds       |
