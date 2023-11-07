const WIFI_DONT_NEED_PROXYS = ['TTO_5G', 'TTO_2.4G'];
const CURRENT_WIFI_SSID_KEY = 'current_wifi_ssid';

if (wifiChanged()) {
  const mode = WIFI_DONT_NEED_PROXYS.includes($network.wifi.ssid)
    ? 'direct'
    : 'rule';
  $surge.setOutboundMode(mode);
  $notification.post(
    'Surge',
    `Wi-Fi changed to ${$network.wifi.ssid || 'cellular'}`,
    `Use ${mode} mode`
  );
}

function wifiChanged() {
  const currentWifiSSid = $persistentStore.read(CURRENT_WIFI_SSID_KEY);
  const changed = currentWifiSSid !== $network.wifi.ssid;
  changed && $persistentStore.write($network.wifi.ssid, CURRENT_WIFI_SSID_KEY);
  return changed;
}

$done();
