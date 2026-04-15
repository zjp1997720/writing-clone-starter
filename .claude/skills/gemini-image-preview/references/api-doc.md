# Gemini Image Preview via AIGCDesk

## Base API Contract

- Base URL: `https://api.aigcdesk.com`
- Auth: `Authorization: Bearer <API_KEY>`
- Content-Type: `application/json`
- Endpoint: `POST /v1/chat/completions`
- Model: `gemini-3.1-flash-image-preview`

## Minimal Request

```json
{
  "model": "gemini-3.1-flash-image-preview",
  "messages": [
    {
      "role": "user",
      "content": "Generate a simple image of a blue coffee mug on a white table, minimal style."
    }
  ]
}
```

## Tested Response Pattern

Successful responses currently use an OpenAI-style chat completion object.

Important path:

```text
choices[0].message.content
```

The content is a string in this shape:

```text
![image](data:image/jpeg;base64,/9j/4AAQ...)
```

So the backend script must:

1. read `choices[0].message.content`
2. extract the `data:image/...;base64,...` payload
3. base64-decode it
4. save it locally

## Model Discovery

You can verify model availability with:

```text
GET https://api.aigcdesk.com/v1/models
```

In the tested environment, AIGCDesk returned this model with supported endpoint types:

```json
{
  "id": "gemini-3.1-flash-image-preview",
  "supported_endpoint_types": ["gemini", "openai"]
}
```

## Notes

- The response body can be large because the image arrives as inline base64.
- Do not print the full payload on failure.
- Treat this as a preview-model integration; response shape may change in the future.
