# Nginx Configuration Guide - Online Clinic

This directory contains the Nginx reverse-proxy configuration for the **Online Clinic** application (`dr-rahimi-pt.ir`).

---

## 1. Architecture Overview

| Domain / Subdomain | Target Service | Local Port / Path | Purpose |
| :--- | :--- | :--- | :--- |
| `dr-rahimi-pt.ir`<br>`www.dr-rahimi-pt.ir` | Next.js Frontend | `http://127.0.0.1:3000` | User interface, SSR & Client routing |
| `api.dr-rahimi-pt.ir` | Django API (Gunicorn) | `http://127.0.0.1:8000` | REST API, Admin panel & Business logic |
| `api.dr-rahimi-pt.ir/static/` | Nginx Static Alias | `/opt/online-clinic/backend/static/` | Django & Admin static assets |
| `api.dr-rahimi-pt.ir/media/` | Nginx Media Alias | `/opt/online-clinic/backend/media/` | User uploads, documents, media |

> **Note on Cloudflare:** The configuration forwards `$http_cf_connecting_ip` as `X-Real-IP` to ensure accurate client IP logging behind Cloudflare CDN.

---

## 2. Prerequisites

1. **Nginx installed** on the server:
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```
2. **Firewall allowed**:
   ```bash
   sudo ufw allow 'Nginx Full'
   ```
3. **Application directories created** with appropriate read/write permissions for `www-data`:
   ```bash
   sudo mkdir -p /opt/online-clinic/backend/static
   sudo mkdir -p /opt/online-clinic/backend/media
   sudo chown -R www-data:www-data /opt/online-clinic/backend/static
   sudo chown -R www-data:www-data /opt/online-clinic/backend/media
   sudo chmod -R 755 /opt/online-clinic/backend/static
   sudo chmod -R 775 /opt/online-clinic/backend/media
   ```

---

## 3. Installation & Deployment Steps

### Option A: Standard Ubuntu / Debian Method (Recommended)

1. **Copy the configuration file** to `sites-available`:
   ```bash
   # If copying from local repository on the server:
   sudo cp devops/nginx/online-clinic.conf /etc/nginx/sites-available/online-clinic.conf
   ```

2. **Enable the site** by creating a symbolic link in `sites-enabled`:
   ```bash
   sudo ln -s /etc/nginx/sites-available/online-clinic.conf /etc/nginx/sites-enabled/
   ```

3. **Disable default configuration** (avoids conflicts on port 80):
   ```bash
   sudo rm -f /etc/nginx/sites-enabled/default
   ```

4. **Verify configuration syntax**:
   ```bash
   sudo nginx -t
   ```
   *Output must indicate:* `syntax is ok` and `test is successful`.

5. **Reload Nginx**:
   ```bash
   sudo systemctl reload nginx
   ```

---

### Option B: Direct `conf.d` Method (CentOS / RHEL / Simple Setup)

1. **Copy the configuration file** directly to `conf.d`:
   ```bash
   sudo cp devops/nginx/online-clinic.conf /etc/nginx/conf.d/online-clinic.conf
   ```

2. **Test & Reload**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 4. SSL / HTTPS Configuration (Let's Encrypt Certbot)

If your domains are directly resolving to this server (not strictly proxied through Cloudflare Flexible SSL):

1. **Install Certbot & Nginx plugin**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Issue and auto-configure SSL certificates**:
   ```bash
   sudo certbot --nginx -d dr-rahimi-pt.ir -d www-dr-rahimi-pt.ir -d api.dr-rahimi-pt.ir
   ```

3. **Verify automatic renewal**:
   ```bash
   sudo certbot renew --dry-run
   ```

> **Cloudflare SSL Notice:** If you use Cloudflare with **Full (Strict)** encryption, ensure you either generate Cloudflare Origin Certificates or run Certbot as shown above. If using **Flexible SSL**, port 80 is sufficient, but **Full (Strict)** is recommended for healthcare application security.

---

## 5. Maintenance & Useful Commands

| Action | Command |
| :--- | :--- |
| **Check Nginx Status** | `sudo systemctl status nginx` |
| **Test Configuration** | `sudo nginx -t` |
| **Reload (Zero Downtime)** | `sudo systemctl reload nginx` |
| **Hard Restart** | `sudo systemctl restart nginx` |
| **View Access Logs** | `sudo tail -f /var/log/nginx/access.log` |
| **View Error Logs** | `sudo tail -f /var/log/nginx/error.log` |

---

## 6. Common Issues & Troubleshooting

- **502 Bad Gateway**:
  - Frontend not running: Check Next.js service on port 3000 (`curl http://127.0.0.1:3000`).
  - Backend not running: Check Gunicorn / Django service on port 8000 (`curl http://127.0.0.1:8000`).
- **403 Forbidden on `/static/` or `/media/`**:
  - Permissions issue: Ensure Nginx worker user (`www-data`) has read permissions to the directory path:
    ```bash
    sudo chmod +x /opt /opt/online-clinic /opt/online-clinic/backend
    sudo chown -R www-data:www-data /opt/online-clinic/backend/static /opt/online-clinic/backend/media
    ```
- **File Upload Limits (413 Request Entity Too Large)**:
  - If users upload large medical records or images, ensure `client_max_body_size` is configured inside `http` or `server` blocks:
    ```nginx
    client_max_body_size 25M;
    ```
