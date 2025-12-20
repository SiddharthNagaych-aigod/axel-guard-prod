import json
import os
import urllib.request
import urllib.parse
import ssl

# Config
BASE_URL = "https://axelguard.com/"
LOCAL_CONTENT_PATH = "src/data/content.json"
PUBLIC_DIR = "public"

# Context for https without strict cert verification
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def recover_pdfs():
    # 1. Load Content
    try:
        with open(LOCAL_CONTENT_PATH, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {LOCAL_CONTENT_PATH}")
        return

    products = data.get("products", [])
    print(f"Found {len(products)} products. Scanning for manuals...")

    # 2. Extract and Download
    for p in products:
        manual_path = p.get("pdf_manual")
        
        if manual_path:
            # Clean up path
            clean_path_raw = manual_path.replace("AxelGuard/", "") 
            if clean_path_raw.startswith("/"):
                clean_path_raw = clean_path_raw[1:]
            
            # Local Save Path
            local_file_path = os.path.join(PUBLIC_DIR, clean_path_raw)
            
            # Remote URL Construction
            # We need to quote the path segments but keep the slashes
            # Split by '/' and quote each part
            parts = clean_path_raw.split('/')
            encoded_parts = [urllib.parse.quote(part) for part in parts]
            encoded_path = "/".join(encoded_parts)
            
            remote_url = urllib.parse.urljoin(BASE_URL, encoded_path)
            
            # Skip if already exists
            if os.path.exists(local_file_path):
                 print(f"Skipping (Exists): {local_file_path}")
                 continue

            print(f"Downloading: {remote_url} -> {local_file_path}")
            
            try:
                os.makedirs(os.path.dirname(local_file_path), exist_ok=True)
                
                # Download with urllib
                # Using a Request object with a User-Agent to avoid potential 403s on some servers
                req = urllib.request.Request(
                    remote_url, 
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                
                with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
                    if response.status == 200:
                         with open(local_file_path, 'wb') as f:
                            f.write(response.read())
                         print("  [OK]")
                    else:
                        print(f"  [FAILED] HTTP {response.status}")
            
            except Exception as e:
                print(f"  [ERROR] {e}")

if __name__ == "__main__":
    recover_pdfs()
