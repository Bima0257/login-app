type RateData = {
  count: number;
  lastRequest: number;
};

const rateLimitMap = new Map<string, RateData>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const data = rateLimitMap.get(ip);

  if (!data) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return { allowed: true, remainingTime: 0 };
  }

  const elapsed = now - data.lastRequest;

  if (elapsed > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return { allowed: true, remainingTime: 0 };
  }

  if (data.count >= limit) {
    return {
      allowed: false,
      remainingTime: Math.ceil((windowMs - elapsed) / 1000),
    };
  }

  data.count++;
  return { allowed: true, remainingTime: 0 };
}
