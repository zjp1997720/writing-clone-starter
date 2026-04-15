---
name: picgo-upload
description: |
  Upload local images to image hosting service via PicGo/PicList API. Use when you need to upload images to get online URLs. Supports batch upload. Keywords: picgo, piclist, image upload, 图床, 上传图片, image hosting.
---

# PicGo Upload Skill

Upload local images to your configured image hosting service (Tencent COS, Aliyun OSS, etc.) via PicGo/PicList API.

## Prerequisites

1. **PicGo or PicList must be running** with server enabled
2. Default server: `http://127.0.0.1:36677`

### Check if PicGo is running

```bash
curl -s http://127.0.0.1:36677/upload -X POST -H "Content-Type: application/json" -d '{"list":[]}'
```

If running, should return: `{"success":true,"result":[]}`

## Quick Start

```bash
# Upload single image
node scripts/upload.mjs /path/to/image.png

# Upload multiple images
node scripts/upload.mjs /path/to/image1.png /path/to/image2.png

# With custom server
PICGO_SERVER="http://custom:port" node scripts/upload.mjs /path/to/image.png
```

## Output Format

The script outputs the uploaded URL(s) to stdout (one per line), making it easy to capture in scripts:

```bash
url=$(node scripts/upload.mjs /path/to/image.png)
echo "Uploaded to: $url"
```

Example output:
```
https://obsidian-1344509300.cos.ap-beijing.myqcloud.com/obsidian/2026/03/image.png
```

## Error Handling

- Exit code 0: Success
- Exit code 1: Upload failed (error message to stderr)
- Exit code 2: No images provided

## API Reference

### PicGo/PicList Upload API

```
POST http://127.0.0.1:36677/upload
Content-Type: application/json

{"list": ["/absolute/path/to/image.png"]}
```

Response:
```json
{
  "success": true,
  "result": ["https://your-bucket.cos.region.myqcloud.com/path/image.png"]
}
```

### Delete API

```
POST http://127.0.0.1:36677/delete
Content-Type: application/json

{"list": ["https://your-bucket.cos.region.myqcloud.com/path/image.png"]}
```

## Integration with Other Skills

This skill is designed to be called by other skills (e.g., `baoyu-article-illustrator`) to upload generated images.

### Example Integration

```bash
# In another skill's script
image_path="illustrations/topic/image.png"
uploaded_url=$(node ~/.claude/skills/picgo-upload/scripts/upload.mjs "$image_path")

if [ $? -eq 0 ]; then
  # Replace local path with online URL in Markdown
  sed -i '' "s|$image_path|$uploaded_url|g" article.md
fi
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PICGO_SERVER` | `http://127.0.0.1:36677` | PicGo/PicList server URL |

### PicGo/PicList Configuration

Your image hosting configuration is managed by PicGo/PicList, not this skill.

Common configuration locations:
- PicList: `~/Library/Application Support/piclist/data.json`
- PicGo: `~/.picgo/config.json`

## Troubleshooting

### "Connection refused"

PicGo/PicList server is not running. Start it from your applications.

### "No such file"

Ensure you're using absolute paths. The script will convert relative paths to absolute.

### Upload fails silently

Check PicGo/PicList logs for details. Common issues:
- Invalid credentials
- Bucket doesn't exist
- Network issues

---

**Last Updated**: 2026-03-04
**Compatible with**: PicGo 2.x, PicList 2.x
