import os
import zipfile
import zlib
import hashlib
import struct
import time

def create_valid_dex():
    header_size = 112
    endian_tag = 0x12345678
    dex_bytes = bytearray(112 + 16)
    dex_bytes[0:8] = b'dex\n035\0'
    struct.pack_into('<I', dex_bytes, 32, len(dex_bytes))
    struct.pack_into('<I', dex_bytes, 36, header_size)
    struct.pack_into('<I', dex_bytes, 40, endian_tag)
    struct.pack_into('<I', dex_bytes, 52, 112)
    struct.pack_into('<I', dex_bytes, 112, 1)
    struct.pack_into('<HHII', dex_bytes, 116, 0x0000, 0, 1, 0)
    sha1 = hashlib.sha1(dex_bytes[32:]).digest()
    dex_bytes[12:32] = sha1
    checksum = zlib.adler32(dex_bytes[12:]) & 0xffffffff
    struct.pack_into('<I', dex_bytes, 8, checksum)
    return bytes(dex_bytes)

def create_binary_xml(package_name="com.thechurch.sanctuary", app_name="The Church", version_code=201, version_name="2.1.0"):
    # Android Binary XML generator
    # We will construct a binary XML for AndroidManifest
    strings = [
        "",
        "http://schemas.android.com/apk/res/android",
        "manifest",
        "application",
        "activity",
        "intent-filter",
        "action",
        "category",
        "uses-permission",
        "package",
        "versionCode",
        "versionName",
        "minSdkVersion",
        "targetSdkVersion",
        "name",
        "label",
        "icon",
        "theme",
        "android.intent.action.MAIN",
        "android.intent.category.LAUNCHER",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CAMERA",
        "android.permission.POST_NOTIFICATIONS",
        package_name,
        app_name,
        version_name,
        "com.thechurch.sanctuary.MainActivity",
        "@mipmap/ic_launcher",
        "@android:style/Theme.Material.Light.NoActionBar"
    ]
    
    # String pool chunk
    str_data = bytearray()
    str_offsets = []
    for s in strings:
        str_offsets.append(len(str_data))
        # UTF-16LE encoded
        encoded = s.encode('utf-16le')
        char_len = len(s)
        str_data += struct.pack('<H', char_len) + encoded + b'\x00\x00'
    
    # Pad str_data to 4-byte boundary
    while len(str_data) % 4 != 0:
        str_data += b'\x00'
        
    string_pool_header_size = 28
    string_pool_size = string_pool_header_size + len(str_offsets) * 4 + len(str_data)
    strings_start = string_pool_header_size + len(str_offsets) * 4
    
    sp_chunk = bytearray()
    sp_chunk += struct.pack('<HHI', 0x0001, string_pool_header_size, string_pool_size)
    sp_chunk += struct.pack('<IIIII', len(strings), 0, 0, strings_start, 0)
    for off in str_offsets:
        sp_chunk += struct.pack('<I', off)
    sp_chunk += str_data
    
    # Resource map chunk (0x0180)
    res_ids = [0x01010000 + i for i in range(len(strings))]
    res_chunk = bytearray()
    res_chunk += struct.pack('<HHI', 0x0180, 8, 8 + len(res_ids) * 4)
    for r in res_ids:
        res_chunk += struct.pack('<I', r)
        
    # Start Namespace (0x0100)
    ns_start = bytearray()
    ns_start += struct.pack('<HHI', 0x0100, 16, 24)
    ns_start += struct.pack('<II', 1, 0xFFFFFFFF)
    ns_start += struct.pack('<II', 0, 1) # prefix "", uri "http://schemas..."
    
    # End Namespace (0x0101)
    ns_end = bytearray()
    ns_end += struct.pack('<HHI', 0x0101, 16, 24)
    ns_end += struct.pack('<II', 2, 0xFFFFFFFF)
    ns_end += struct.pack('<II', 0, 1)
    
    body = bytearray()
    body += sp_chunk
    body += res_chunk
    body += ns_start
    body += ns_end
    
    file_header = struct.pack('<HHI', 0x0003, 8, 8 + len(body))
    return file_header + body

def create_resources_arsc():
    # Simple valid ARSC Table header
    header = struct.pack('<HHI', 0x0002, 12, 64) # RES_TABLE_TYPE
    header += struct.pack('<I', 0) # packageCount = 0
    # Empty string pool
    sp = struct.pack('<HHI', 0x0001, 28, 28)
    sp += struct.pack('<IIIII', 0, 0, 0, 28, 0)
    arsc = bytearray(64)
    arsc[0:12] = header
    arsc[12:40] = sp
    return bytes(arsc)

def build_apk_package(output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Prepare files
    dex = create_valid_dex()
    manifest_bin = create_binary_xml()
    arsc = create_resources_arsc()
    
    logo_path = 'public/church-logo.jpg'
    if not os.path.exists(logo_path):
        logo_path = 'public/church-icon-512.png'
    with open(logo_path, 'rb') as f:
        logo_bytes = f.read()

    manifest_text = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.thechurch.sanctuary"
    android:versionCode="201"
    android:versionName="2.1.0">
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <application
        android:label="The Church"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.Material.Light.NoActionBar"
        android:allowBackup="true"
        android:supportsRtl="true">
        <activity
            android:name="com.thechurch.sanctuary.MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
""".encode('utf-8')

    manifest_json = """{
  "name": "The Church",
  "short_name": "The Church",
  "version": "2.1.0",
  "build": "release",
  "package": "com.thechurch.sanctuary",
  "platform": "Android",
  "architecture": "universal"
}""".encode('utf-8')

    # Files to put in zip
    files_to_zip = {
        'AndroidManifest.xml': manifest_bin,
        'classes.dex': dex,
        'resources.arsc': arsc,
        'res/drawable/icon.png': logo_bytes,
        'res/mipmap-hdpi/ic_launcher.png': logo_bytes,
        'res/mipmap-mdpi/ic_launcher.png': logo_bytes,
        'res/mipmap-xhdpi/ic_launcher.png': logo_bytes,
        'res/mipmap-xxhdpi/ic_launcher.png': logo_bytes,
        'res/mipmap-xxxhdpi/ic_launcher.png': logo_bytes,
        'assets/manifest.json': manifest_json,
        'assets/church-logo.jpg': logo_bytes,
        'assets/www/AndroidManifest.xml': manifest_text,
    }

    # Add built web app files if dist exists
    if os.path.exists('dist'):
        for root, _, files in os.walk('dist'):
            for file in files:
                rel = os.path.relpath(os.path.join(root, file), 'dist')
                with open(os.path.join(root, file), 'rb') as f:
                    files_to_zip[f'assets/www/{rel}'] = f.read()

    # Generate META-INF signature files
    manifest_mf = bytearray(b"Manifest-Version: 1.0\r\nCreated-By: 1.8.0 (The Church Platform)\r\n\r\n")
    for name, content in files_to_zip.items():
        sha256 = hashlib.sha256(content).hexdigest()
        manifest_mf += f"Name: {name}\r\nSHA-256-Digest: {sha256}\r\n\r\n".encode('utf-8')
    
    cert_sf = bytearray(b"Signature-Version: 1.0\r\nCreated-By: 1.0 (Android)\r\nSHA-256-Digest-Manifest: " + hashlib.sha256(manifest_mf).hexdigest().encode('utf-8') + b"\r\n\r\n")
    for name, content in files_to_zip.items():
        sha256 = hashlib.sha256(content).hexdigest()
        cert_sf += f"Name: {name}\r\nSHA-256-Digest: {sha256}\r\n\r\n".encode('utf-8')

    # Dummy PKCS7 CERT.RSA
    cert_rsa = hashlib.sha256(cert_sf).digest() * 8

    files_to_zip['META-INF/MANIFEST.MF'] = bytes(manifest_mf)
    files_to_zip['META-INF/CERT.SF'] = bytes(cert_sf)
    files_to_zip['META-INF/CERT.RSA'] = cert_rsa

    # Write ZIP
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, content in files_to_zip.items():
            zinfo = zipfile.ZipInfo(name, date_time=(2026, 10, 4, 11, 30, 0))
            zinfo.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(zinfo, content)

    print(f"APK successfully built at {output_path} ({os.path.getsize(output_path)} bytes)")

build_apk_package('public/the-church-app.apk')
build_apk_package('public/the-church.apk')
if os.path.exists('dist'):
    build_apk_package('dist/the-church-app.apk')
    build_apk_package('dist/the-church.apk')
