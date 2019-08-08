import axios from 'axios';

function getPlaylist(playlist) {
  if (!playlists[playlist]) return false;
  const url = playlists[playlist];
  const request = axios.get(url);
  return request.then(response => response.data);
}

export default { getPlaylist };

const playlists = {
  VIP: 'https://vip.aersia.net/roster.xml',
  mellow: 'https://vip.aersia.net/roster-mellow.xml',
  source: 'https://vip.aersia.net/roster-source.xml',
  exiled: 'https://vip.aersia.net/roster-exiled.xml',
  WAP: 'https://wap.aersia.net/roster.xml',
  CPP: 'https://cpp.aersia.net/roster.xml'
}
