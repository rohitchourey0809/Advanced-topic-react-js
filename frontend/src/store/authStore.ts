let _access: string | null = null

export function getAccessToken() {
  return _access
}

export function setAccessToken(token: string | null) {
  _access = token
}

export default {
  getAccessToken,
  setAccessToken
}
