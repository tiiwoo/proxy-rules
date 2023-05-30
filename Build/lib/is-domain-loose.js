const { parse } = require('tldts');

module.exports.isDomainLoose = (domain) => {
  const { isIcann, isPrivate, isIp } = parse(domain, {
    allowPrivateDomains: true,
  });
  return !!(!isIp && (isIcann || isPrivate));
};

module.exports.normalizeDomain = (domain) => {
  if (domain == null) {
    return null;
  }

  const { isIcann, isPrivate, hostname, isIp } = parse(domain, {
    allowPrivateDomains: true,
  });
  if (isIp) {
    return null;
  }

  if (isIcann || isPrivate) {
    return hostname;
  }

  return null;
};
