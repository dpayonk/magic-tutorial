
class Configuration {
  static BACKEND_URL: string = process.env.NODE_ENV === 'development' ? "http://localhost:8001" : 'https://pyvise-jvebf.ondigitalocean.app'
  static MAGIC_PUBLISHABLE_KEY: string = "pk_test_39290D72D6702DA7"
  static AUTH_CALLBACK_ROUTE = '/login'
}

export default Configuration