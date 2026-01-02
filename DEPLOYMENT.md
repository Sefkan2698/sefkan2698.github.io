# Deployment Anleitung für Hetzner Server

## Voraussetzungen
- Hetzner Server mit Ubuntu/Debian
- SSH-Zugang zum Server
- Domain mit DNS auf Server-IP konfiguriert

## 1. Server vorbereiten

SSH auf den Server einloggen:
```bash
ssh root@DEINE-SERVER-IP
```

### Docker installieren
```bash
# System aktualisieren
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren
apt install docker-compose -y

# Docker beim Systemstart aktivieren
systemctl enable docker
systemctl start docker
```

### Nginx und Certbot installieren
```bash
apt install nginx certbot python3-certbot-nginx -y
```

## 2. Repository auf Server klonen

```bash
# Git installieren falls nicht vorhanden
apt install git -y

# Nach /opt wechseln
cd /opt

# Repository klonen (ersetze mit deiner GitHub URL)
git clone https://github.com/DEIN-USERNAME/sakaits-website.git
cd sakaits-website
```

## 3. Docker Container starten

Die `next.config.mjs` ist bereits auf `standalone` konfiguriert.

## 4. Container starten

```bash
# Container bauen und starten
docker-compose up -d --build

# Logs prüfen
docker-compose logs -f

# Container Status prüfen
docker ps
```

Die Next.js App läuft jetzt auf `localhost:3000` auf dem Server.

## 5. Nginx konfigurieren

### Nginx Config erstellen
```bash
nano /etc/nginx/sites-available/sakaits
```

Füge folgendes ein (ersetze `DEINE-DOMAIN.de` mit deiner Domain):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name DEINE-DOMAIN.de www.DEINE-DOMAIN.de;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Config aktivieren
```bash
# Symlink erstellen
ln -s /etc/nginx/sites-available/sakaits /etc/nginx/sites-enabled/

# Default Config deaktivieren (optional)
rm /etc/nginx/sites-enabled/default

# Nginx Config testen
nginx -t

# Nginx neu starten
systemctl restart nginx
```

## 6. SSL mit Let's Encrypt einrichten

```bash
# SSL Zertifikat holen
certbot --nginx -d DEINE-DOMAIN.de -d www.DEINE-DOMAIN.de

# Folge den Anweisungen:
# - Email eingeben
# - Terms akzeptieren
# - Redirect auf HTTPS wählen (Option 2)
```

Certbot konfiguriert automatisch SSL und HTTPS-Redirect in der Nginx Config.

### Auto-Renewal testen
```bash
# Test ob Auto-Renewal funktioniert
certbot renew --dry-run
```

Das Zertifikat erneuert sich automatisch alle 90 Tage.

## 7. Firewall konfigurieren (optional aber empfohlen)

```bash
# UFW installieren
apt install ufw -y

# SSH erlauben (WICHTIG, sonst sperrst du dich aus!)
ufw allow OpenSSH

# HTTP und HTTPS erlauben
ufw allow 'Nginx Full'

# Firewall aktivieren
ufw enable

# Status prüfen
ufw status
```

## Updates deployen

Wenn du Änderungen am Code machst:

```bash
# Auf dem Server
cd /opt/sakaits-website

# Neuesten Code holen
git pull

# Container neu bauen
docker-compose up -d --build
```

## Automatisches Deployment mit GitHub Actions (Optional)

Du kannst auch automatisches Deployment einrichten. Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hetzner

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/sakaits-website
            git pull
            docker-compose up -d --build
```

Füge in GitHub Settings > Secrets hinzu:
- `SERVER_IP`: Deine Server IP
- `SSH_PRIVATE_KEY`: Dein SSH Private Key

## Nützliche Befehle

```bash
# Container Logs anschauen
docker-compose logs -f

# Container stoppen
docker-compose down

# Container neu starten
docker-compose restart

# Nginx Logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Nginx neu laden
systemctl reload nginx
```

## Troubleshooting

### Port 3000 wird nicht erreicht
```bash
# Prüfe ob Container läuft
docker ps

# Prüfe Container Logs
docker-compose logs
```

### Nginx Fehler
```bash
# Nginx Config testen
nginx -t

# Nginx Status
systemctl status nginx

# Logs prüfen
tail -f /var/log/nginx/error.log
```

### SSL Probleme
```bash
# Certbot Logs
certbot certificates

# Certbot neu ausführen
certbot --nginx -d DEINE-DOMAIN.de
```
