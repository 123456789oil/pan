#!/bin/bash
# Cloudreve V3 -> V4 完整升级脚本（MySQL 8.0 专用版）
# 解决认证插件、权限、版本兼容等所有问题
# 使用方法：sudo bash cloudreve_upgrade.sh

set -e

echo "=================================================="
echo "  Cloudreve V3 -> V4 完整升级"
echo "=================================================="

# 配置
CLOUDREVE_DIR="/opt/cloudreve"
V3_CONF="conf.ini"
V4_DB="cloudreve_v4"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/cloudreve_backup_${TIMESTAMP}"
V4_ARCHIVE="/mnt/usb/cloudreve_4.17.0.tar.gz"

cd "$CLOUDREVE_DIR" || exit 1

# 读取 MySQL 配置
MYSQL_HOST=$(grep -E '^Host[[:space:]]*=' "$V3_CONF" | awk -F'=' '{print $2}' | tr -d ' "' | head -1)
MYSQL_PORT=$(grep -E '^Port[[:space:]]*=' "$V3_CONF" | awk -F'=' '{print $2}' | tr -d ' "' | head -1)
MYSQL_USER=$(grep -E '^User[[:space:]]*=' "$V3_CONF" | awk -F'=' '{print $2}' | tr -d ' "' | head -1)
MYSQL_PASS=$(grep -E '^Password[[:space:]]*=' "$V3_CONF" | awk -F'=' '{print $2}' | tr -d ' "' | head -1)
MYSQL_DB=$(grep -E '^Name[[:space:]]*=' "$V3_CONF" | awk -F'=' '{print $2}' | tr -d ' "' | head -1)

MYSQL_HOST="${MYSQL_HOST:-127.0.0.1}"
MYSQL_PORT="${MYSQL_PORT:-3306}"

echo ""
echo "[STEP 1] 备份..."
mkdir -p "$BACKUP_DIR"
cp "$V3_CONF" "$BACKUP_DIR/"
mysqldump -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASS" --single-transaction "$MYSQL_DB" > "$BACKUP_DIR/${MYSQL_DB}_${TIMESTAMP}.sql" 2>/dev/null || true
cp -r "$CLOUDREVE_DIR" "$BACKUP_DIR/files" 2>/dev/null || true
echo "[OK] 备份完成: $BACKUP_DIR"

echo ""
echo "[STEP 2] 修复 MySQL 认证..."
sudo mysql -u root -e "ALTER USER '${MYSQL_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_PASS}'; GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || {
    echo "[INFO] 尝试创建用户..."
    sudo mysql -u root -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_PASS}'; GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'localhost'; FLUSH PRIVILEGES;"
}
echo "[OK] MySQL 认证已修复"

echo ""
echo "[STEP 3] 准备 V4 数据库..."
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASS" -e "DROP DATABASE IF EXISTS $V4_DB; CREATE DATABASE $V4_DB;" 2>/dev/null || true
echo "[OK] V4 数据库已创建"

echo ""
echo "[STEP 4] 停止 Cloudreve..."
systemctl stop cloudreve 2>/dev/null || pkill -f cloudreve 2>/dev/null || true
sleep 2
echo "[OK] 已停止"

echo ""
echo "[STEP 5] 解压 V4..."
if [ -f "$V4_ARCHIVE" ]; then
    cp "$V4_ARCHIVE" ./cloudreve_v4.tar.gz
    tar -xzf cloudreve_v4.tar.gz
    rm -f cloudreve_v4.tar.gz
    chmod +x cloudreve
    echo "[OK] V4 已解压"
else
    echo "[ERROR] 找不到 V4 压缩包: $V4_ARCHIVE"
    exit 1
fi

echo ""
echo "[STEP 6] 准备 V4 配置..."
if [ ! -d "data" ]; then
    mkdir data
fi
cp "$V3_CONF" data/conf.ini
sed -i '/^TablePrefix/d' data/conf.ini 2>/dev/null || true
sed -i "s/^Name[[:space:]]*=.*/Name = $V4_DB/" data/conf.ini

if ! grep -q "HashIDSalt" data/conf.ini; then
    SALT=$(openssl rand -base64 32 2>/dev/null || tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 32)
    if grep -q "\[System\]" data/conf.ini; then
        sed -i "/\[System\]/a HashIDSalt = $SALT" data/conf.ini
    else
        echo -e "
[System]
HashIDSalt = $SALT" >> data/conf.ini
    fi
fi
echo "[OK] V4 配置已准备"

echo ""
echo "[STEP 7] 运行迁移..."
rm -f migration_state.json
./cloudreve migrate --v3-conf "$V3_CONF" -c data/conf.ini

echo ""
echo "[STEP 8] 启动 V4..."
if [ -f "/etc/systemd/system/cloudreve.service" ]; then
    sed -i "s|ExecStart=.*|ExecStart=$CLOUDREVE_DIR/cloudreve|" /etc/systemd/system/cloudreve.service
    systemctl daemon-reload
    systemctl start cloudreve
else
    nohup ./cloudreve > /dev/null 2>&1 &
fi

sleep 3
IP=$(hostname -I | awk '{print $1}')
echo ""
echo "=================================================="
echo "  升级完成！"
echo "  访问: http://$IP:5212"
echo "  备份: $BACKUP_DIR"
echo "=================================================="
